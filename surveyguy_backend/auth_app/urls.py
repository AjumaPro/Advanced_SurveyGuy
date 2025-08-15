from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('me/', views.get_user_profile, name='get_user_profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # Admin registration
    path('admin/register/', views.AdminRegistrationView.as_view(), name='admin_register'),
    path('super-admin/register/', views.SuperAdminRegistrationView.as_view(), name='super_admin_register'),
    
    # Account management
    path('approvals/', views.AccountApprovalView.as_view(), name='account_approvals'),
    path('subscriptions/', views.PaymentSubscriptionView.as_view(), name='payment_subscriptions'),
    path('payment-intents/', views.PaymentIntentView.as_view(), name='payment_intents'),
] 