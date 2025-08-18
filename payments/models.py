from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class SubscriptionPlan(models.Model):
    """Model for subscription plans."""
    
    PLAN_TYPES = (
        ('basic', 'Basic'),
        ('pro', 'Professional'),
        ('enterprise', 'Enterprise'),
        ('custom', 'Custom'),
    )
    
    BILLING_CYCLES = (
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('quarterly', 'Quarterly'),
    )
    
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    description = models.TextField()
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLES, default='monthly')
    currency = models.CharField(max_length=3, default='USD')
    
    # Features
    max_surveys = models.PositiveIntegerField(default=10)
    max_responses = models.PositiveIntegerField(default=1000)
    max_team_members = models.PositiveIntegerField(default=1)
    features = models.JSONField(default=dict)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - {self.get_billing_cycle_display()}"


class Subscription(models.Model):
    """Model for user subscriptions."""
    
    SUBSCRIPTION_STATUS = (
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('pending', 'Pending'),
        ('trial', 'Trial'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Subscription details
    status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS, default='pending')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    trial_end_date = models.DateTimeField(blank=True, null=True)
    
    # Billing
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    auto_renew = models.BooleanField(default=True)
    
    # Payment provider
    payment_provider = models.CharField(max_length=50, blank=True, null=True)
    provider_subscription_id = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name}"
    
    @property
    def is_active(self):
        """Check if subscription is currently active."""
        now = timezone.now()
        return (self.status == 'active' and 
                self.start_date <= now <= self.end_date)
    
    @property
    def is_trial(self):
        """Check if subscription is in trial period."""
        now = timezone.now()
        return (self.status == 'trial' and 
                self.trial_end_date and now <= self.trial_end_date)
    
    @property
    def days_remaining(self):
        """Get days remaining in subscription."""
        now = timezone.now()
        if self.end_date > now:
            return (self.end_date - now).days
        return 0


class Payment(models.Model):
    """Model for payment transactions."""
    
    PAYMENT_STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_METHODS = (
        ('card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('other', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments', blank=True, null=True)
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    
    # Provider details
    provider = models.CharField(max_length=50)
    provider_payment_id = models.CharField(max_length=100, blank=True, null=True)
    provider_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Description
    description = models.CharField(max_length=200)
    metadata = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} {self.currency}"


class Invoice(models.Model):
    """Model for invoices."""
    
    INVOICE_STATUS = (
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='invoices', blank=True, null=True)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='invoice', blank=True, null=True)
    
    # Invoice details
    invoice_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=INVOICE_STATUS, default='draft')
    
    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    # Dates
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    paid_date = models.DateTimeField(blank=True, null=True)
    
    # Billing information
    billing_address = models.JSONField(default=dict, blank=True)
    items = models.JSONField(default=list, blank=True)
    
    # Notes
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-issue_date']
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            last_invoice = Invoice.objects.order_by('-id').first()
            if last_invoice:
                last_number = int(last_invoice.invoice_number.split('-')[-1])
                self.invoice_number = f"INV-{timezone.now().strftime('%Y%m')}-{last_number + 1:04d}"
            else:
                self.invoice_number = f"INV-{timezone.now().strftime('%Y%m')}-0001"
        super().save(*args, **kwargs)


class PaymentMethod(models.Model):
    """Model for stored payment methods."""
    
    PAYMENT_TYPES = (
        ('card', 'Credit Card'),
        ('bank_account', 'Bank Account'),
        ('paypal', 'PayPal'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payment_methods')
    
    # Payment method details
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    provider = models.CharField(max_length=50)
    provider_payment_method_id = models.CharField(max_length=100)
    
    # Card details (masked)
    last4 = models.CharField(max_length=4, blank=True, null=True)
    brand = models.CharField(max_length=20, blank=True, null=True)
    expiry_month = models.PositiveIntegerField(blank=True, null=True)
    expiry_year = models.PositiveIntegerField(blank=True, null=True)
    
    # Status
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_default', '-created_at']
    
    def __str__(self):
        if self.payment_type == 'card':
            return f"{self.brand} ****{self.last4}"
        return f"{self.get_payment_type_display()} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Ensure only one default payment method per user
        if self.is_default:
            PaymentMethod.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs) 