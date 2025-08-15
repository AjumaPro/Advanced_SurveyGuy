from rest_framework import serializers
from .models import SurveyAnalytics, QuestionAnalytics, UserActivity, DashboardMetrics, ExportLog


class SurveyAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for SurveyAnalytics model"""
    
    class Meta:
        model = SurveyAnalytics
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class QuestionAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for QuestionAnalytics model"""
    
    class Meta:
        model = QuestionAnalytics
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for UserActivity model"""
    
    class Meta:
        model = UserActivity
        fields = '__all__'
        read_only_fields = ['created_at']


class DashboardMetricsSerializer(serializers.ModelSerializer):
    """Serializer for DashboardMetrics model"""
    
    class Meta:
        model = DashboardMetrics
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ExportLogSerializer(serializers.ModelSerializer):
    """Serializer for ExportLog model"""
    
    class Meta:
        model = ExportLog
        fields = '__all__'
        read_only_fields = ['created_at', 'completed_at'] 