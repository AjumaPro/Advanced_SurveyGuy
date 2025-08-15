from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class BillingHistory(models.Model):
    """Model for billing history"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='billing_history')
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
        db_table = 'billing_history'
        ordering = ['-billing_date']
    
    def __str__(self):
        return f"{self.user.email} - {self.plan_name} ({self.status})"


class PaymentMethod(models.Model):
    """Model for payment methods"""
    
    TYPE_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
        ('mobile_money', 'Mobile Money'),
        ('paystack', 'Paystack'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=100)
    last_four = models.CharField(max_length=4, blank=True)
    expiry_month = models.IntegerField(null=True, blank=True)
    expiry_year = models.IntegerField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_methods'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.name}"
