from django.contrib import admin
from .models import SubscriptionPlan, Subscription, Payment, Invoice, PaymentMethod


@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    """Admin for SubscriptionPlan model."""
    
    list_display = ['name', 'plan_type', 'price', 'billing_cycle', 'currency', 'is_active', 'is_featured']
    list_filter = ['plan_type', 'billing_cycle', 'is_active', 'is_featured', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['price']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'plan_type', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'billing_cycle', 'currency')
        }),
        ('Features', {
            'fields': ('max_surveys', 'max_responses', 'max_team_members', 'features')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin for Subscription model."""
    
    list_display = ['user', 'plan', 'status', 'start_date', 'end_date', 'amount', 'is_active', 'is_trial']
    list_filter = ['status', 'plan__plan_type', 'auto_renew', 'created_at']
    search_fields = ['user__email', 'plan__name']
    readonly_fields = ['is_active', 'is_trial', 'days_remaining', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Subscription Details', {
            'fields': ('user', 'plan', 'status', 'start_date', 'end_date', 'trial_end_date')
        }),
        ('Billing', {
            'fields': ('amount', 'currency', 'auto_renew')
        }),
        ('Provider', {
            'fields': ('payment_provider', 'provider_subscription_id')
        }),
        ('Status', {
            'fields': ('is_active', 'is_trial', 'days_remaining'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin for Payment model."""
    
    list_display = ['user', 'amount', 'currency', 'status', 'payment_method', 'provider', 'created_at']
    list_filter = ['status', 'payment_method', 'provider', 'created_at']
    search_fields = ['user__email', 'description', 'provider_payment_id']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Payment Details', {
            'fields': ('user', 'subscription', 'amount', 'currency', 'status', 'payment_method')
        }),
        ('Provider', {
            'fields': ('provider', 'provider_payment_id', 'provider_fee')
        }),
        ('Description', {
            'fields': ('description', 'metadata')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    """Admin for Invoice model."""
    
    list_display = ['invoice_number', 'user', 'status', 'total_amount', 'currency', 'issue_date', 'due_date']
    list_filter = ['status', 'currency', 'issue_date', 'due_date']
    search_fields = ['invoice_number', 'user__email']
    readonly_fields = ['invoice_number', 'created_at', 'updated_at']
    ordering = ['-issue_date']
    
    fieldsets = (
        ('Invoice Details', {
            'fields': ('user', 'subscription', 'payment', 'invoice_number', 'status')
        }),
        ('Amounts', {
            'fields': ('subtotal', 'tax_amount', 'discount_amount', 'total_amount', 'currency')
        }),
        ('Dates', {
            'fields': ('issue_date', 'due_date', 'paid_date')
        }),
        ('Billing', {
            'fields': ('billing_address', 'items', 'notes')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin for PaymentMethod model."""
    
    list_display = ['user', 'payment_type', 'provider', 'last4', 'brand', 'is_default', 'is_active']
    list_filter = ['payment_type', 'provider', 'is_default', 'is_active', 'created_at']
    search_fields = ['user__email', 'provider_payment_method_id']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-is_default', '-created_at']
    
    fieldsets = (
        ('Payment Method', {
            'fields': ('user', 'payment_type', 'provider', 'provider_payment_method_id')
        }),
        ('Card Details', {
            'fields': ('last4', 'brand', 'expiry_month', 'expiry_year')
        }),
        ('Status', {
            'fields': ('is_default', 'is_active')
        }),
        ('Metadata', {
            'fields': ('metadata', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 