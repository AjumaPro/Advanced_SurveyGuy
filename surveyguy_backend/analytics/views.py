from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, Avg, Sum
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models.functions import TruncDate

from surveys.models import Survey, Question, Response
from events.models import Event, EventRegistration
from auth_app.models import PaymentSubscription


class AnalyticsViewSet(viewsets.ViewSet):
    """ViewSet for Analytics"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get overall analytics for the authenticated user"""
        user = request.user
        
        # Get user's survey statistics
        survey_stats = Survey.objects.filter(user=user).aggregate(
            total_surveys=Count('id'),
            published_surveys=Count('id', filter=Q(status='published')),
            draft_surveys=Count('id', filter=Q(status='draft')),
            archived_surveys=Count('id', filter=Q(status='archived'))
        )
        
        # Get total responses across all surveys
        response_stats = Response.objects.filter(survey__user=user).aggregate(
            total_responses=Count('id'),
            unique_respondents=Count('session_id', distinct=True),
            surveys_with_responses=Count('survey', distinct=True)
        )
        
        # Get recent activity
        recent_activity = Survey.objects.filter(user=user).annotate(
            response_count=Count('responses')
        ).values('title', 'status', 'updated_at', 'response_count').order_by('-updated_at')[:5]
        
        return Response({
            'surveyStats': survey_stats,
            'responseStats': response_stats,
            'recentActivity': list(recent_activity)
        })
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get advanced dashboard data"""
        user = request.user
        time_range = request.query_params.get('range', '30d')
        
        # Calculate date range
        now = timezone.now()
        if time_range == '7d':
            start_date = now - timedelta(days=7)
        elif time_range == '30d':
            start_date = now - timedelta(days=30)
        elif time_range == '90d':
            start_date = now - timedelta(days=90)
        elif time_range == '1y':
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=30)
        
        # Get overview statistics
        overview = Survey.objects.filter(user=user).aggregate(
            total_surveys=Count('id'),
            total_questions=Count('questions'),
            avg_completion_rate=Avg('completion_rate')
        )
        
        # Get response statistics
        response_stats = Response.objects.filter(
            survey__user=user,
            created_at__gte=start_date
        ).aggregate(
            total_responses=Count('id'),
            unique_respondents=Count('session_id', distinct=True)
        )
        
        # Get revenue statistics
        revenue_stats = PaymentSubscription.objects.filter(
            user=user,
            status='active'
        ).aggregate(
            total_revenue=Sum('amount'),
            active_subscriptions=Count('id')
        )
        
        # Get daily trends
        daily_trends = Response.objects.filter(
            survey__user=user,
            created_at__gte=start_date
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            responses=Count('id')
        ).order_by('date')
        
        return Response({
            'overview': overview,
            'responseStats': response_stats,
            'revenueStats': revenue_stats,
            'dailyTrends': list(daily_trends)
        })
    
    @action(detail=False, methods=['get'])
    def surveys(self, request):
        """Get survey-specific analytics"""
        user = request.user
        
        # Get survey analytics
        survey_analytics = Survey.objects.filter(user=user).annotate(
            question_count=Count('questions'),
            response_count=Count('responses'),
            unique_respondents=Count('responses__session_id', distinct=True)
        ).values(
            'id', 'title', 'status', 'completion_rate', 'question_count',
            'response_count', 'unique_respondents', 'created_at', 'updated_at'
        ).order_by('-updated_at')
        
        # Get question type distribution
        question_types = Question.objects.filter(survey__user=user).values('type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Get response trends
        response_trends = Response.objects.filter(
            survey__user=user,
            created_at__gte=timezone.now() - timedelta(days=30)
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            responses=Count('id')
        ).order_by('date')
        
        return Response({
            'surveyAnalytics': list(survey_analytics),
            'questionTypes': list(question_types),
            'responseTrends': list(response_trends)
        })
    
    @action(detail=False, methods=['get'])
    def responses(self, request):
        """Get response analytics"""
        user = request.user
        
        # Get response analytics
        response_analytics = Response.objects.filter(survey__user=user).aggregate(
            total_responses=Count('id'),
            unique_respondents=Count('session_id', distinct=True),
            surveys_with_responses=Count('survey', distinct=True)
        )
        
        # Get daily trends
        daily_trends = Response.objects.filter(
            survey__user=user,
            created_at__gte=timezone.now() - timedelta(days=7)
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            responses=Count('id')
        ).order_by('date')
        
        return Response({
            'overview': response_analytics,
            'dailyTrends': list(daily_trends)
        })
    
    @action(detail=False, methods=['get'])
    def events(self, request):
        """Get event analytics"""
        user = request.user
        
        # Get event statistics
        event_stats = Event.objects.filter(created_by=user).aggregate(
            total_events=Count('id'),
            upcoming_events=Count('id', filter=Q(date__gte=timezone.now().date())),
            past_events=Count('id', filter=Q(date__lt=timezone.now().date()))
        )
        
        # Get registration statistics
        registration_stats = EventRegistration.objects.filter(
            event__created_by=user
        ).aggregate(
            total_registrations=Count('id'),
            unique_registrants=Count('email', distinct=True)
        )
        
        # Get monthly event trends
        monthly_trends = Event.objects.filter(
            created_by=user,
            created_date__gte=timezone.now() - timedelta(days=90)
        ).annotate(
            month=TruncDate('created_date', 'month')
        ).values('month').annotate(
            events=Count('id')
        ).order_by('month')
        
        return Response({
            'eventStats': event_stats,
            'registrationStats': registration_stats,
            'monthlyTrends': list(monthly_trends)
        })
