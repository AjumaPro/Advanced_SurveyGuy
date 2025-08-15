from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminDashboard(models.Model):
    """Model for admin dashboard statistics"""
    
    total_users = models.IntegerField(default=0)
    total_surveys = models.IntegerField(default=0)
    total_events = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    active_subscriptions = models.IntegerField(default=0)
    pending_approvals = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_dashboard'
    
    def __str__(self):
        return f"Admin Dashboard - {self.last_updated}"


class AdminAccount(models.Model):
    """Model for admin accounts management"""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_account')
    department = models.CharField(max_length=100, blank=True)
    permissions = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_admin_accounts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_accounts'
    
    def __str__(self):
        return f"{self.user.email} - {self.department}"


class AdminPackage(models.Model):
    """Model for admin package management"""
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('draft', 'Draft'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    interval = models.CharField(max_length=20, default='monthly')
    features = models.JSONField(default=list)
    max_surveys = models.IntegerField(default=3)
    max_responses_per_survey = models.IntegerField(default=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_featured = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_admin_packages')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_packages'
        ordering = ['sort_order', 'price']
    
    def __str__(self):
        return self.name


class AdminPayment(models.Model):
    """Model for admin payment management"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_payments')
    plan_id = models.CharField(max_length=50)
    plan_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_reference = models.CharField(max_length=255, unique=True)
    payment_method = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    billing_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    paid_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'admin_payments'
        ordering = ['-billing_date']
    
    def __str__(self):
        return f"{self.user.email} - {self.plan_name} ({self.status})"
