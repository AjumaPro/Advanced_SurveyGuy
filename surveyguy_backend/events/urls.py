from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'registrations', views.EventRegistrationViewSet, basename='eventregistration')
router.register(r'templates', views.EventTemplateViewSet, basename='eventtemplate')

urlpatterns = [
    path('', include(router.urls)),
] 