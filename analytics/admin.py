from django.contrib import admin
from .models import SurveyAnalytics, QuestionAnalytics, ResponseExport, DashboardMetrics


@admin.register(SurveyAnalytics)
class SurveyAnalyticsAdmin(admin.ModelAdmin):
    """Admin for SurveyAnalytics model."""
    
    list_display = ['survey', 'total_responses', 'completed_responses', 'abandoned_responses',
                   'average_completion_time', 'last_calculated']
    list_filter = ['last_calculated']
    search_fields = ['survey__title']
    readonly_fields = ['last_calculated']
    ordering = ['-last_calculated']


@admin.register(QuestionAnalytics)
class QuestionAnalyticsAdmin(admin.ModelAdmin):
    """Admin for QuestionAnalytics model."""
    
    list_display = ['question', 'total_responses', 'skipped_responses', 'average_rating', 'last_calculated']
    list_filter = ['last_calculated']
    search_fields = ['question__text']
    readonly_fields = ['last_calculated']
    ordering = ['-last_calculated']


@admin.register(ResponseExport)
class ResponseExportAdmin(admin.ModelAdmin):
    """Admin for ResponseExport model."""
    
    list_display = ['survey', 'created_by', 'export_format', 'is_completed', 'created_at']
    list_filter = ['export_format', 'is_completed', 'created_at']
    search_fields = ['survey__title', 'created_by__email']
    readonly_fields = ['created_at', 'completed_at']
    ordering = ['-created_at']


@admin.register(DashboardMetrics)
class DashboardMetricsAdmin(admin.ModelAdmin):
    """Admin for DashboardMetrics model."""
    
    list_display = ['user', 'total_surveys', 'active_surveys', 'total_responses', 'last_calculated']
    list_filter = ['last_calculated']
    search_fields = ['user__email']
    readonly_fields = ['last_calculated']
    ordering = ['-last_calculated'] 