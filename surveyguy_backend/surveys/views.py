from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.utils import timezone
from django.db import transaction

from .models import Survey, Question, Response
from .serializers import (
    SurveySerializer, 
    SurveyDetailSerializer, 
    SurveyCreateSerializer,
    QuestionSerializer,
    ResponseSerializer
)


class SurveyViewSet(viewsets.ModelViewSet):
    """ViewSet for Survey model"""
    serializer_class = SurveySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter surveys for current user"""
        return Survey.objects.filter(user=self.request.user).annotate(
            question_count=Count('questions'),
            response_count=Count('responses')
        ).order_by('-updated_at')
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return SurveyCreateSerializer
        elif self.action in ['retrieve', 'update']:
            return SurveyDetailSerializer
        return SurveySerializer
    
    def perform_create(self, serializer):
        """Set the user and create questions"""
        with transaction.atomic():
            survey = serializer.save(user=self.request.user)
            
            # Create questions if provided
            questions_data = self.request.data.get('questions', [])
            for i, question_data in enumerate(questions_data):
                Question.objects.create(
                    survey=survey,
                    type=question_data.get('type'),
                    title=question_data.get('title'),
                    description=question_data.get('description', ''),
                    required=question_data.get('required', False),
                    options=question_data.get('options', []),
                    settings=question_data.get('settings', {}),
                    order_index=i
                )
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a survey"""
        survey = self.get_object()
        
        with transaction.atomic():
            # Create new survey
            new_survey = Survey.objects.create(
                user=request.user,
                title=f"{survey.title} (Copy)",
                description=survey.description,
                theme=survey.theme,
                settings=survey.settings
            )
            
            # Duplicate questions
            for question in survey.questions.all():
                Question.objects.create(
                    survey=new_survey,
                    type=question.type,
                    title=question.title,
                    description=question.description,
                    required=question.required,
                    options=question.options,
                    settings=question.settings,
                    order_index=question.order_index
                )
            
            serializer = self.get_serializer(new_survey)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """Publish a survey"""
        survey = self.get_object()
        survey.status = 'published'
        survey.save()
        
        serializer = self.get_serializer(survey)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        """Archive a survey"""
        survey = self.get_object()
        survey.status = 'archived'
        survey.save()
        
        serializer = self.get_serializer(survey)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get survey statistics"""
        user = request.user
        queryset = self.get_queryset()
        
        total_surveys = queryset.count()
        published_surveys = queryset.filter(status='published').count()
        draft_surveys = queryset.filter(status='draft').count()
        archived_surveys = queryset.filter(status='archived').count()
        
        # Get surveys with responses
        surveys_with_responses = queryset.filter(responses__isnull=False).distinct().count()
        
        # Get total responses
        total_responses = Response.objects.filter(survey__user=user).count()
        
        # Get average completion rate
        avg_completion_rate = queryset.aggregate(
            avg_rate=Count('responses', filter=Q(responses__isnull=False)) * 100.0 / Count('id')
        )['avg_rate'] or 0
        
        return Response({
            'total_surveys': total_surveys,
            'published_surveys': published_surveys,
            'draft_surveys': draft_surveys,
            'archived_surveys': archived_surveys,
            'surveys_with_responses': surveys_with_responses,
            'total_responses': total_responses,
            'avg_completion_rate': round(avg_completion_rate, 2)
        })


class QuestionViewSet(viewsets.ModelViewSet):
    """ViewSet for Question model"""
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter questions for surveys owned by current user"""
        return Question.objects.filter(survey__user=self.request.user)
    
    def perform_create(self, serializer):
        """Set the survey"""
        survey_id = self.request.data.get('survey_id')
        survey = get_object_or_404(Survey, id=survey_id, user=self.request.user)
        serializer.save(survey=survey)


class ResponseViewSet(viewsets.ModelViewSet):
    """ViewSet for Response model"""
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter responses for surveys owned by current user"""
        return Response.objects.filter(survey__user=self.request.user)
    
    def perform_create(self, serializer):
        """Set the survey and question"""
        survey_id = self.request.data.get('survey_id')
        question_id = self.request.data.get('question_id')
        
        survey = get_object_or_404(Survey, id=survey_id, user=self.request.user)
        question = get_object_or_404(Question, id=question_id, survey=survey)
        
        serializer.save(survey=survey, question=question)
