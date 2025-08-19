"""
URL configuration for surveyguy project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views
from .frontend_views import (
    landing_page, login_view, register_view, logout_view, dashboard_view,
    survey_builder_view, surveys_list_view, survey_detail_view, survey_analytics_view,
    template_library_view, event_management_view, profile_view, billing_view,
    add_question_api, delete_question_api,
    survey_preview_view, survey_response_view, pricing_view,
    subscriptions_view, team_view
)

def api_redirect(request):
    """Redirect /api to /api/"""
    return redirect('/api/')

def api_root(request):
    """API root endpoint showing available endpoints"""
    return JsonResponse({
        'message': 'SurveyGuy API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health/',
            'auth': '/api/auth/',
            'surveys': '/api/surveys/',
            'analytics': '/api/analytics/',
            'events': '/api/events/',
            'payments': '/api/payments/',
            'token': '/api/token/',
        },
        'documentation': 'Available endpoints for SurveyGuy API'
    })

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API redirect (without trailing slash)
    path('api', api_redirect, name='api_redirect'),
    
    # API root (with trailing slash)
    path('api/', api_root, name='api_root'),
    
    # Frontend Routes
    path('', landing_page, name='landing'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('pricing/', pricing_view, name='pricing'),
    path('subscriptions/', subscriptions_view, name='subscriptions'),
    path('team/', team_view, name='team'),
    path('survey/builder/', survey_builder_view, name='survey_builder'),
    path('survey/builder/<uuid:survey_id>/', survey_builder_view, name='survey_builder_edit'),
    path('surveys/', surveys_list_view, name='surveys'),
    path('survey/<uuid:survey_id>/', survey_detail_view, name='survey_detail'),
    path('survey/<uuid:survey_id>/analytics/', survey_analytics_view, name='survey_analytics'),
    path('survey/<uuid:survey_id>/preview/', survey_preview_view, name='survey_preview'),
    path('survey/<uuid:survey_id>/response/', survey_response_view, name='survey_response'),
    path('templates/', template_library_view, name='template_library'),
    path('events/', event_management_view, name='event_management'),
    path('profile/', profile_view, name='profile'),
    path('billing/', billing_view, name='billing'),
    
    # API Routes
    path('api/health/', views.health_check, name='health_check'),
    path('api/auth/', include('accounts.urls')),
    path('api/surveys/', include('surveys.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/events/', include('events.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints for frontend
    path('api/questions/add/', add_question_api, name='add_question_api'),
    path('api/questions/<int:question_id>/delete/', delete_question_api, name='delete_question_api'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 