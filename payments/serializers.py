from rest_framework import serializers
from .models import SubscriptionPlan, Subscription, Payment, Invoice, PaymentMethod


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    """Serializer for subscription plans."""
    
    class Meta:
        model = SubscriptionPlan
        fields = ['id', 'name', 'plan_type', 'description', 'price', 'billing_cycle',
                 'currency', 'max_surveys', 'max_responses', 'max_team_members',
                 'features', 'is_active', 'is_featured', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscriptions."""
    
    plan = SubscriptionPlanSerializer(read_only=True)
    user = serializers.StringRelatedField()
    is_active = serializers.ReadOnlyField()
    is_trial = serializers.ReadOnlyField()
    days_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'status', 'start_date', 'end_date',
                 'trial_end_date', 'amount', 'currency', 'auto_renew',
                 'payment_provider', 'provider_subscription_id', 'is_active',
                 'is_trial', 'days_remaining', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating subscriptions."""
    
    class Meta:
        model = Subscription
        fields = ['plan', 'start_date', 'end_date', 'amount', 'currency', 'auto_renew']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payments."""
    
    user = serializers.StringRelatedField()
    subscription = SubscriptionSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'subscription', 'amount', 'currency', 'status',
                 'payment_method', 'provider', 'provider_payment_id', 'provider_fee',
                 'description', 'metadata', 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'completed_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments."""
    
    class Meta:
        model = Payment
        fields = ['subscription', 'amount', 'currency', 'payment_method', 'provider', 'description']


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for invoices."""
    
    user = serializers.StringRelatedField()
    subscription = SubscriptionSerializer(read_only=True)
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'user', 'subscription', 'payment', 'invoice_number',
                 'status', 'subtotal', 'tax_amount', 'discount_amount', 'total_amount',
                 'currency', 'issue_date', 'due_date', 'paid_date', 'billing_address',
                 'items', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'invoice_number', 'created_at', 'updated_at']


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for payment methods."""
    
    user = serializers.StringRelatedField()
    
    class Meta:
        model = PaymentMethod
        fields = ['id', 'user', 'payment_type', 'provider', 'provider_payment_method_id',
                 'last4', 'brand', 'expiry_month', 'expiry_year', 'is_default',
                 'is_active', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PaymentMethodCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payment methods."""
    
    class Meta:
        model = PaymentMethod
        fields = ['payment_type', 'provider', 'provider_payment_method_id', 'last4',
                 'brand', 'expiry_month', 'expiry_year', 'is_default', 'metadata']


class SubscriptionCancelSerializer(serializers.Serializer):
    """Serializer for cancelling subscriptions."""
    
    reason = serializers.CharField(max_length=500, required=False)
    immediate = serializers.BooleanField(default=False) 