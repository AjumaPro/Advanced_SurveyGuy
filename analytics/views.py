from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import SurveyAnalytics, QuestionAnalytics, ResponseExport, DashboardMetrics
from .serializers import (
    SurveyAnalyticsSerializer, QuestionAnalyticsSerializer, ResponseExportSerializer,
    ResponseExportCreateSerializer, DashboardMetricsSerializer, AnalyticsSummarySerializer,
    QuestionAnalyticsDetailSerializer
)
from django.db.models import Count
from surveys.models import Survey, SurveyResponse


class SurveyAnalyticsView(generics.RetrieveAPIView):
    """Get analytics for a specific survey."""
    
    serializer_class = SurveyAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        survey_id = self.kwargs.get('survey_id')
        return get_object_or_404(SurveyAnalytics, survey_id=survey_id, survey__creator=self.request.user)


class QuestionAnalyticsView(generics.ListAPIView):
    """Get analytics for questions in a survey."""
    
    serializer_class = QuestionAnalyticsSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['total_responses', 'average_rating']
    ordering = ['-total_responses']
    
    def get_queryset(self):
        survey_id = self.kwargs.get('survey_id')
        return QuestionAnalytics.objects.filter(
            question__survey_id=survey_id,
            question__survey__creator=self.request.user
        )


class QuestionAnalyticsDetailView(generics.RetrieveAPIView):
    """Get detailed analytics for a specific question."""
    
    serializer_class = QuestionAnalyticsDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        question_id = self.kwargs.get('question_id')
        return get_object_or_404(
            QuestionAnalytics,
            question_id=question_id,
            question__survey__creator=self.request.user
        )


class DashboardMetricsView(generics.RetrieveAPIView):
    """Get dashboard metrics for the current user."""
    
    serializer_class = DashboardMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        metrics, created = DashboardMetrics.objects.get_or_create(user=self.request.user)
        return metrics


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def analytics_summary(request):
    """Get analytics summary for the current user."""
    from datetime import datetime, timedelta
    
    user = request.user
    today = datetime.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Get survey statistics
    total_surveys = Survey.objects.filter(creator=user).count()
    total_responses = SurveyResponse.objects.filter(survey__creator=user).count()
    
    # Get response trends
    responses_today = SurveyResponse.objects.filter(
        survey__creator=user,
        created_at__date=today
    ).count()
    
    responses_this_week = SurveyResponse.objects.filter(
        survey__creator=user,
        created_at__date__gte=week_ago
    ).count()
    
    responses_this_month = SurveyResponse.objects.filter(
        survey__creator=user,
        created_at__date__gte=month_ago
    ).count()
    
    # Calculate completion rate
    completed_responses = SurveyResponse.objects.filter(
        survey__creator=user,
        is_complete=True
    ).count()
    
    average_completion_rate = (completed_responses / total_responses * 100) if total_responses > 0 else 0
    
    # Get top performing surveys
    top_surveys = Survey.objects.filter(creator=user).annotate(
        response_count=Count('responses')
    ).order_by('-response_count')[:5]
    
    top_performing_surveys = [
        {
            'id': survey.id,
            'title': survey.title,
            'response_count': survey.response_count,
            'status': survey.status
        }
        for survey in top_surveys
    ]
    
    # Get recent activity
    from accounts.models import UserActivity
    recent_activity = UserActivity.objects.filter(user=user).order_by('-created_at')[:10]
    
    recent_activity_list = [
        {
            'type': activity.activity_type,
            'description': activity.description,
            'timestamp': activity.created_at.isoformat()
        }
        for activity in recent_activity
    ]
    
    data = {
        'total_surveys': total_surveys,
        'total_responses': total_responses,
        'average_completion_rate': round(average_completion_rate, 2),
        'average_response_time': 0,  # Placeholder
        'responses_today': responses_today,
        'responses_this_week': responses_this_week,
        'responses_this_month': responses_this_month,
        'top_performing_surveys': top_performing_surveys,
        'recent_activity': recent_activity_list
    }
    
    return Response(data)


class ResponseExportListView(generics.ListCreateAPIView):
    """List and create response exports."""
    
    serializer_class = ResponseExportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['export_format', 'is_completed']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return ResponseExport.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResponseExportCreateSerializer
        return ResponseExportSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ResponseExportDetailView(generics.RetrieveAPIView):
    """Get export details."""
    
    serializer_class = ResponseExportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ResponseExport.objects.filter(created_by=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_export(request, export_id):
    """Download an export file."""
    export = get_object_or_404(ResponseExport, id=export_id, created_by=request.user)
    
    if not export.is_completed:
        return Response({'error': 'Export not completed'}, status=status.HTTP_400_BAD_REQUEST)
    
    # This would handle file download logic
    # For now, return a placeholder response
    return Response({
        'message': 'Download functionality would be implemented here',
        'file_path': export.file_path
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def realtime_analytics(request, survey_id):
    """Get real-time analytics for a survey."""
    survey = get_object_or_404(Survey, id=survey_id, creator=request.user)
    
    # Get real-time data
    from surveys.models import SurveyResponse
    from datetime import datetime, timedelta
    
    now = datetime.now()
    last_hour = now - timedelta(hours=1)
    last_24_hours = now - timedelta(hours=24)
    
    # Recent responses
    recent_responses = SurveyResponse.objects.filter(
        survey=survey,
        created_at__gte=last_24_hours
    ).count()
    
    # Hourly breakdown
    hourly_data = []
    for i in range(24):
        hour_start = now - timedelta(hours=i+1)
        hour_end = now - timedelta(hours=i)
        count = SurveyResponse.objects.filter(
            survey=survey,
            created_at__gte=hour_start,
            created_at__lt=hour_end
        ).count()
        hourly_data.append({
            'hour': hour_start.strftime('%H:00'),
            'count': count
        })
    
    hourly_data.reverse()
    
    data = {
        'survey_id': survey_id,
        'recent_responses': recent_responses,
        'hourly_data': hourly_data,
        'last_updated': now.isoformat()
    }
    
    return Response(data) 