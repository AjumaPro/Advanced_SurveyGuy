from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login, logout
from django.utils import timezone
from django.db.models import Q
from django.conf import settings
from .models import User, UserProfile, UserActivity, PasswordReset
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, PasswordChangeSerializer, UserActivitySerializer,
    AdminUserSerializer, UserApprovalSerializer
)
import uuid


class UserRegistrationView(APIView):
    """User registration endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Auto-approve in development
            if settings.DEBUG:
                user.is_approved = True
                user.save()
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='registration',
                description='User registered',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({
                'message': 'User registered successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserLoginView(APIView):
    """User login endpoint."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='login',
                description='User logged in',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserLogoutView(APIView):
    """User logout endpoint."""
    
    def post(self, request):
        logout(request)
        
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='logout',
            description='User logged out',
            ip_address=self.get_client_ip(request)
        )
        
        return Response({'message': 'Logout successful'})
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserProfileView(APIView):
    """User profile management."""
    
    def get(self, request):
        """Get current user profile."""
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({'message': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        """Update user profile."""
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """Password change endpoint."""
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='password_change',
                description='Password changed',
                ip_address=self.get_client_ip(request)
            )
            
            return Response({'message': 'Password changed successfully'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AdminUserListView(generics.ListAPIView):
    """Admin view for listing users."""
    
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    
    def get_queryset(self):
        queryset = User.objects.all()
        
        # Filter by search query
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(username__icontains=search)
            )
        
        # Filter by user type
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        # Filter by approval status
        is_approved = self.request.query_params.get('is_approved', None)
        if is_approved is not None:
            is_approved = is_approved.lower() == 'true'
            queryset = queryset.filter(is_approved=is_approved)
        
        return queryset.order_by('-created_at')


class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    """Admin view for user detail and approval."""
    
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminUserSerializer
    queryset = User.objects.all()
    
    def patch(self, request, *args, **kwargs):
        """Update user approval status."""
        user = self.get_object()
        serializer = UserApprovalSerializer(data=request.data, partial=True)
        
        if serializer.is_valid():
            if 'is_approved' in serializer.validated_data:
                user.is_approved = serializer.validated_data['is_approved']
            
            if 'user_type' in serializer.validated_data:
                user.user_type = serializer.validated_data['user_type']
            
            user.save()
            
            # Log activity
            UserActivity.objects.create(
                user=request.user,
                activity_type='user_approval',
                description=f'Updated user {user.email} approval status',
                ip_address=self.get_client_ip(request)
            )
            
            return Response(AdminUserSerializer(user).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserActivityListView(generics.ListAPIView):
    """View for listing user activities."""
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserActivitySerializer
    
    def get_queryset(self):
        if self.request.user.is_admin:
            return UserActivity.objects.all()
        return UserActivity.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def create_admin_user(request):
    """Development endpoint for creating admin users."""
    from django.conf import settings
    
    if not settings.DEBUG:
        return Response({'error': 'This endpoint is only available in development'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.user_type = 'admin'
        user.is_approved = True
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        return Response({
            'message': 'Admin user created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Get current user information."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data) 