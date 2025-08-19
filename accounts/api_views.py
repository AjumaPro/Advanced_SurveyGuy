from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from .models import User
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_api(request):
    """API endpoint for React frontend login"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(request, username=email, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        token = str(refresh.access_token)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token,
            'message': 'Login successful'
        })
    else:
        return Response({
            'error': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_api(request):
    """API endpoint for React frontend registration"""
    email = request.data.get('email')
    password = request.data.get('password')
    name = request.data.get('name', '')
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({
            'error': 'User with this email already exists'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user with required fields
    first_name = name.split()[0] if name else ''
    last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''
    username = email  # Use email as username since USERNAME_FIELD is email
    
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_approved=True  # Auto-approve for now
        )
        
        refresh = RefreshToken.for_user(user)
        token = str(refresh.access_token)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token,
            'message': 'Account created successfully!'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Registration failed: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_api(request):
    """API endpoint to get current user info"""
    return Response({
        'user': UserSerializer(request.user).data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """API endpoint for logout"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
    except Exception:
        pass
    
    return Response({
        'message': 'Logout successful'
    }) 