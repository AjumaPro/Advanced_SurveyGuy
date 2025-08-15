from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, AccountApproval, PaymentSubscription, PaymentIntent


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_approved and user.role not in ['admin', 'super_admin']:
                raise serializers.ValidationError('Account pending approval. Please contact support.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'subscription_plan', 
                 'subscription_status', 'is_approved', 'super_admin', 'date_joined']
        read_only_fields = ['id', 'role', 'subscription_plan', 'subscription_status', 
                           'is_approved', 'super_admin', 'date_joined']


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    current_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value


class AdminRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for admin registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    admin_key = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'role', 'password', 'password_confirm', 'admin_key']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Validate admin key
        from decouple import config
        if attrs['admin_key'] != config('ADMIN_REGISTRATION_KEY', default=''):
            raise serializers.ValidationError('Invalid admin key')
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data.pop('admin_key')
        user = CustomUser.objects.create_user(**validated_data)
        user.role = validated_data.get('role', 'admin')
        user.subscription_plan = 'admin'
        user.is_approved = True
        user.save()
        return user


class SuperAdminRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for super admin registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    super_admin_key = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'super_admin_key']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        
        # Validate super admin key
        from decouple import config
        if attrs['super_admin_key'] != config('SUPER_ADMIN_REGISTRATION_KEY', default=''):
            raise serializers.ValidationError('Invalid super admin key')
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        validated_data.pop('super_admin_key')
        user = CustomUser.objects.create_user(**validated_data)
        user.role = 'super_admin'
        user.subscription_plan = 'super_admin'
        user.super_admin = True
        user.is_approved = True
        user.save()
        return user


class AccountApprovalSerializer(serializers.ModelSerializer):
    """Serializer for account approval"""
    
    class Meta:
        model = AccountApproval
        fields = ['id', 'user', 'status', 'admin', 'approved_at', 'rejection_reason', 
                 'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for payment subscriptions"""
    
    class Meta:
        model = PaymentSubscription
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class PaymentIntentSerializer(serializers.ModelSerializer):
    """Serializer for payment intents"""
    
    class Meta:
        model = PaymentIntent
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at'] 