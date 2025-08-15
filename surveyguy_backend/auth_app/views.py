from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    ChangePasswordSerializer, AdminRegistrationSerializer, SuperAdminRegistrationSerializer,
    AccountApprovalSerializer, PaymentSubscriptionSerializer, PaymentIntentSerializer
)
from .models import CustomUser, AccountApproval, PaymentSubscription, PaymentIntent

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """View for user registration"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user = serializer.save()
            
            # Check if this is the first user (make them admin)
            if User.objects.count() == 1:
                user.role = 'admin'
                user.subscription_plan = 'admin'
                user.is_approved = True
                user.save()
                message = 'Admin account created successfully with admin subscription!'
            else:
                user.is_approved = False
                user.save()
                # Create account approval record
                AccountApproval.objects.create(user=user, status='pending')
                message = 'Account created successfully! Pending admin approval.'
            
            # Create free subscription
            PaymentSubscription.objects.create(
                user=user,
                plan_id=user.subscription_plan,
                plan_name=f"{user.subscription_plan.title()} Plan",
                amount=0.00,
                currency='GHS',
                interval='monthly',
                status='active'
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'message': message
            }, status=status.HTTP_201_CREATED)


class UserLoginView(generics.GenericAPIView):
    """View for user login"""
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """View for changing password"""
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})


class AdminRegistrationView(generics.CreateAPIView):
    """View for admin registration"""
    serializer_class = AdminRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user = serializer.save()
            
            # Create admin subscription
            PaymentSubscription.objects.create(
                user=user,
                plan_id='admin',
                plan_name='Admin Plan',
                amount=0.00,
                currency='GHS',
                interval='monthly',
                status='active'
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'message': 'Admin account created successfully!'
            }, status=status.HTTP_201_CREATED)


class SuperAdminRegistrationView(generics.CreateAPIView):
    """View for super admin registration"""
    serializer_class = SuperAdminRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            user = serializer.save()
            
            # Create super admin subscription
            PaymentSubscription.objects.create(
                user=user,
                plan_id='super_admin',
                plan_name='Super Admin Plan',
                amount=0.00,
                currency='GHS',
                interval='monthly',
                status='active'
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'message': 'Super Admin account created successfully!'
            }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    serializer = UserProfileSerializer(request.user)
    return Response({'user': serializer.data})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    """Logout user (blacklist refresh token)"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Logged out successfully'})
    except Exception:
        return Response({'message': 'Logged out successfully'})


class AccountApprovalView(generics.ListCreateAPIView):
    """View for account approvals (admin only)"""
    serializer_class = AccountApprovalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'super_admin']:
            return AccountApproval.objects.filter(status='pending')
        return AccountApproval.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(admin=self.request.user)


class PaymentSubscriptionView(generics.ListCreateAPIView):
    """View for payment subscriptions"""
    serializer_class = PaymentSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentSubscription.objects.filter(user=self.request.user)


class PaymentIntentView(generics.ListCreateAPIView):
    """View for payment intents"""
    serializer_class = PaymentIntentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentIntent.objects.filter(user=self.request.user)
