from rest_framework import serializers
from .models import AdminDashboard, AdminAccount, AdminPackage, AdminPayment


class AdminDashboardSerializer(serializers.ModelSerializer):
    """Serializer for AdminDashboard model"""
    
    class Meta:
        model = AdminDashboard
        fields = '__all__'


class AdminAccountSerializer(serializers.ModelSerializer):
    """Serializer for AdminAccount model"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = AdminAccount
        fields = [
            'id', 'user', 'user_email', 'user_name', 'department',
            'permissions', 'status', 'created_by', 'created_by_email',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']


class AdminPackageSerializer(serializers.ModelSerializer):
    """Serializer for AdminPackage model"""
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = AdminPackage
        fields = [
            'id', 'name', 'description', 'price', 'currency', 'interval',
            'features', 'max_surveys', 'max_responses_per_survey', 'status',
            'is_featured', 'sort_order', 'created_by', 'created_by_email',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']


class AdminPaymentSerializer(serializers.ModelSerializer):
    """Serializer for AdminPayment model"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = AdminPayment
        fields = [
            'id', 'user', 'user_email', 'user_name', 'plan_id', 'plan_name',
            'amount', 'currency', 'status', 'payment_reference',
            'payment_method', 'description', 'billing_date', 'due_date',
            'paid_date'
        ] 