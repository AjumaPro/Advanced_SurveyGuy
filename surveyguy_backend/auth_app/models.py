from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    """Custom user model for SurveyGuy application"""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    ]
    
    SUBSCRIPTION_PLAN_CHOICES = [
        ('free', 'Free'),
        ('basic', 'Basic'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    ]
    
    SUBSCRIPTION_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Custom fields
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    subscription_plan = models.CharField(max_length=20, choices=SUBSCRIPTION_PLAN_CHOICES, default='free')
    subscription_status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS_CHOICES, default='active')
    is_approved = models.BooleanField(default=True)
    approved_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_users', db_column='approved_by')
    approved_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    super_admin = models.BooleanField(default=False)
    
    # Override email field to be unique
    email = models.EmailField(unique=True)
    
    # Override username field to be optional
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    
    # Override password field to match existing database
    password = models.CharField(max_length=255, db_column='password_hash')
    
    # Fix the approved_by field to match existing database
    approved_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_users', db_column='approved_by')
    
    # Add missing Django fields
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def save(self, *args, **kwargs):
        # Auto-generate username if not provided
        if not self.username:
            self.username = self.email
        
        # Set role based on super_admin field
        if self.super_admin:
            self.role = 'super_admin'
            self.subscription_plan = 'super_admin'
        
        super().save(*args, **kwargs)


class AccountApproval(models.Model):
    """Model for tracking account approval requests"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='account_approval')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='approvals_given')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'account_approvals'
    
    def __str__(self):
        return f"Approval for {self.user.email} - {self.status}"


class AdminAuditLog(models.Model):
    """Model for tracking admin actions"""
    
    admin = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50)
    target_id = models.IntegerField(null=True, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'admin_audit_log'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.admin.email if self.admin else 'System'} - {self.action}"


class PaymentSubscription(models.Model):
    """Model for payment subscriptions"""
    
    INTERVAL_CHOICES = [
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('one_time', 'One Time'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_subscriptions')
    plan_id = models.CharField(max_length=50)
    plan_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    interval = models.CharField(max_length=20, choices=INTERVAL_CHOICES, default='monthly')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    payment_transaction_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payment_subscriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.plan_name}"


class PaymentIntent(models.Model):
    """Model for payment intents"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payment_intents')
    plan_id = models.CharField(max_length=50)
    plan_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    reference = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_transaction_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_intents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.reference}"


class SubscriptionPackage(models.Model):
    """Model for subscription packages"""
    
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_packages')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    interval = models.CharField(max_length=20, choices=PaymentSubscription.INTERVAL_CHOICES, default='monthly')
    features = models.JSONField(default=list)
    max_surveys = models.IntegerField(default=3)
    max_responses_per_survey = models.IntegerField(default=50)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscription_packages'
        ordering = ['sort_order', 'price']
    
    def __str__(self):
        return self.name
