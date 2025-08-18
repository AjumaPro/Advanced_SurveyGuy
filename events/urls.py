from django.urls import path
from . import views

urlpatterns = [
    # Event management
    path('', views.EventListView.as_view(), name='event_list'),
    path('<uuid:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('<uuid:event_id>/publish/', views.publish_event, name='publish_event'),
    path('<uuid:event_id>/duplicate/', views.duplicate_event, name='duplicate_event'),
    path('<uuid:event_id>/stats/', views.event_stats, name='event_stats'),
    
    # Event registrations
    path('<uuid:event_id>/registrations/', views.EventRegistrationListView.as_view(), name='event_registration_list'),
    path('<uuid:event_id>/registrations/<int:pk>/', views.EventRegistrationDetailView.as_view(), name='event_registration_detail'),
    
    # Event surveys
    path('<uuid:event_id>/surveys/', views.EventSurveyListView.as_view(), name='event_survey_list'),
    
    # Event categories
    path('categories/', views.EventCategoryListView.as_view(), name='event_category_list'),
    path('categories/<int:pk>/', views.EventCategoryDetailView.as_view(), name='event_category_detail'),
    
    # User-specific endpoints
    path('my-events/', views.my_events, name='my_events'),
    path('my-registrations/', views.my_registrations, name='my_registrations'),
] 