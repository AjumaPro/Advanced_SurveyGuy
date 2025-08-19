from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .api_views import login_api, register_api, me_api, logout_api

urlpatterns = [
    # JWT Token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # React API endpoints
    path('login/', login_api, name='api_login'),
    path('register/', register_api, name='api_register'),
    path('me/', me_api, name='api_me'),
    path('logout/', logout_api, name='api_logout'),
] 