from rest_framework import serializers
from .models import SurveyAnalytics, QuestionAnalytics, ResponseExport, DashboardMetrics


class SurveyAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for survey analytics."""
    
    survey = serializers.StringRelatedField()
    
    class Meta:
        model = SurveyAnalytics
        fields = ['id', 'survey', 'total_responses', 'completed_responses', 'abandoned_responses',
                 'average_completion_time', 'median_completion_time', 'unique_visitors',
                 'return_visitors', 'desktop_responses', 'mobile_responses', 'tablet_responses',
                 'last_calculated']
        read_only_fields = ['id', 'last_calculated']


class QuestionAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for question analytics."""
    
    question = serializers.StringRelatedField()
    
    class Meta:
        model = QuestionAnalytics
        fields = ['id', 'question', 'total_responses', 'skipped_responses', 'option_counts',
                 'average_rating', 'rating_distribution', 'average_text_length', 'common_words',
                 'last_calculated']
        read_only_fields = ['id', 'last_calculated']


class ResponseExportSerializer(serializers.ModelSerializer):
    """Serializer for response exports."""
    
    survey = serializers.StringRelatedField()
    created_by = serializers.StringRelatedField()
    
    class Meta:
        model = ResponseExport
        fields = ['id', 'survey', 'created_by', 'export_format', 'file_path',
                 'include_metadata', 'anonymize_responses', 'date_range_start', 'date_range_end',
                 'is_completed', 'error_message', 'created_at', 'completed_at']
        read_only_fields = ['id', 'created_by', 'file_path', 'is_completed', 'error_message',
                           'created_at', 'completed_at']


class ResponseExportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating response exports."""
    
    class Meta:
        model = ResponseExport
        fields = ['survey', 'export_format', 'include_metadata', 'anonymize_responses',
                 'date_range_start', 'date_range_end']


class DashboardMetricsSerializer(serializers.ModelSerializer):
    """Serializer for dashboard metrics."""
    
    user = serializers.StringRelatedField()
    
    class Meta:
        model = DashboardMetrics
        fields = ['id', 'user', 'total_surveys', 'active_surveys', 'total_responses',
                 'responses_today', 'responses_this_week', 'responses_this_month',
                 'average_completion_rate', 'average_response_time', 'last_calculated']
        read_only_fields = ['id', 'user', 'last_calculated']


class AnalyticsSummarySerializer(serializers.Serializer):
    """Serializer for analytics summary."""
    
    total_surveys = serializers.IntegerField()
    total_responses = serializers.IntegerField()
    average_completion_rate = serializers.FloatField()
    average_response_time = serializers.FloatField()
    responses_today = serializers.IntegerField()
    responses_this_week = serializers.IntegerField()
    responses_this_month = serializers.IntegerField()
    top_performing_surveys = serializers.ListField()
    recent_activity = serializers.ListField()


class QuestionAnalyticsDetailSerializer(serializers.Serializer):
    """Serializer for detailed question analytics."""
    
    question_id = serializers.IntegerField()
    question_text = serializers.CharField()
    question_type = serializers.CharField()
    total_responses = serializers.IntegerField()
    skipped_responses = serializers.IntegerField()
    response_rate = serializers.FloatField()
    option_counts = serializers.DictField(required=False)
    average_rating = serializers.FloatField(required=False)
    rating_distribution = serializers.DictField(required=False)
    average_text_length = serializers.FloatField(required=False)
    common_words = serializers.ListField(required=False) 