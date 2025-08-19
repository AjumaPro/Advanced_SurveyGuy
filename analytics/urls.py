from django.urls import path
from . import views

urlpatterns = [
    # Survey analytics
    path('survey/<uuid:survey_id>/', views.SurveyAnalyticsView.as_view(), name='survey_analytics'),
    path('survey/<uuid:survey_id>/questions/', views.QuestionAnalyticsView.as_view(), name='question_analytics'),
    path('survey/<uuid:survey_id>/questions/<int:question_id>/', views.QuestionAnalyticsDetailView.as_view(), name='question_analytics_detail'),
    
    # Dashboard
    path('dashboard/', views.DashboardMetricsView.as_view(), name='dashboard_metrics'),
    path('dashboard/summary/', views.analytics_summary, name='analytics_summary'),
    
    # Exports
    path('export/', views.ResponseExportListView.as_view(), name='export_list'),
    path('export/<int:export_id>/', views.ResponseExportDetailView.as_view(), name='export_detail'),
    path('export/<int:export_id>/download/', views.download_export, name='download_export'),
    
    # Real-time analytics
    path('realtime/<uuid:survey_id>/', views.realtime_analytics, name='realtime_analytics'),
] 