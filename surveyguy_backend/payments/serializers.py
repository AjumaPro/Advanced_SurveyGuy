from rest_framework import serializers
from .models import BillingHistory, PaymentMethod


class BillingHistorySerializer(serializers.ModelSerializer):
    """Serializer for BillingHistory model"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = BillingHistory
        fields = [
            'id', 'user', 'user_email', 'plan_id', 'plan_name', 'amount',
            'currency', 'status', 'payment_reference', 'payment_method',
            'description', 'billing_date', 'due_date', 'paid_date'
        ]
        read_only_fields = ['user', 'billing_date']


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for PaymentMethod model"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'user', 'user_email', 'type', 'name', 'last_four',
            'expiry_month', 'expiry_year', 'is_default', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at'] 