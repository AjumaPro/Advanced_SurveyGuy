from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
    path('current-user/', views.current_user, name='current_user'),
    
    # Profile management
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('change-password/', views.PasswordChangeView.as_view(), name='change_password'),
    
    # Admin endpoints
    path('admin/users/', views.AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/create-admin/', views.create_admin_user, name='create_admin'),
    
    # Activity tracking
    path('activities/', views.UserActivityListView.as_view(), name='user_activities'),
] 