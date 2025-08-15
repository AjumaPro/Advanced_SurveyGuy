"""
URL configuration for surveyguy_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenRefreshView

@csrf_exempt
def root_view(request):
    """Root view that provides API information"""
    return JsonResponse({
        'message': 'SurveyGuy Django API Backend',
        'version': '1.0.0',
        'status': 'running',
        'frontend_url': 'http://localhost:3001',
        'api_documentation': {
            'health_check': '/api/health/',
            'authentication': '/api/auth/',
            'surveys': '/api/surveys/',
            'analytics': '/api/analytics/',
            'admin': '/admin/',
        },
        'instructions': 'This is the API backend. Access the frontend at http://localhost:3001'
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth_app.urls')),
    path('api/surveys/', include('surveys.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/events/', include('events.urls')),
    path('api/templates/', include('templates.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/admin/', include('admin_panel.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/health/', include('health_check.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
