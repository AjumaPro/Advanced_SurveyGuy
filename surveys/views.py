from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Survey, Question, QuestionOption, SurveyResponse, QuestionResponse, SurveyTemplate
from .serializers import (
    SurveySerializer, SurveyCreateSerializer, SurveyUpdateSerializer,
    QuestionSerializer, QuestionCreateSerializer, QuestionOptionSerializer,
    SurveyResponseSerializer, SurveyResponseCreateSerializer,
    QuestionResponseSerializer, QuestionResponseCreateSerializer,
    SurveyTemplateSerializer, SurveyTemplateCreateSerializer,
    SurveyWithQuestionsSerializer, SurveyPublishSerializer, SurveyDuplicateSerializer
)


class SurveyListView(generics.ListCreateAPIView):
    """List and create surveys."""
    
    serializer_class = SurveySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'survey_type', 'is_public']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Show user's own surveys and public surveys
            return Survey.objects.filter(
                Q(creator=user) | Q(is_public=True)
            ).distinct()
        else:
            # Show only public surveys for anonymous users
            return Survey.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class SurveyDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete surveys."""
    
    serializer_class = SurveySerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Survey.objects.filter(
                Q(creator=user) | Q(is_public=True)
            ).distinct()
        else:
            return Survey.objects.filter(is_public=True)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SurveyUpdateSerializer
        return SurveySerializer


class SurveyWithQuestionsView(generics.RetrieveAPIView):
    """Get survey with all questions for taking the survey."""
    
    serializer_class = SurveyWithQuestionsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Survey.objects.filter(
            Q(status='published') | Q(is_public=True)
        )


class QuestionListView(generics.ListCreateAPIView):
    """List and create questions for a survey."""
    
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        survey_id = self.kwargs.get('survey_id')
        return Question.objects.filter(survey_id=survey_id, survey__creator=self.request.user)
    
    def perform_create(self, serializer):
        survey_id = self.kwargs.get('survey_id')
        survey = get_object_or_404(Survey, id=survey_id, creator=self.request.user)
        serializer.save(survey=survey)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete questions."""
    
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Question.objects.filter(survey__creator=self.request.user)


class QuestionOptionListView(generics.ListCreateAPIView):
    """List and create question options."""
    
    serializer_class = QuestionOptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        question_id = self.kwargs.get('question_id')
        return QuestionOption.objects.filter(
            question_id=question_id, 
            question__survey__creator=self.request.user
        )
    
    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')
        question = get_object_or_404(
            Question, 
            id=question_id, 
            survey__creator=self.request.user
        )
        serializer.save(question=question)


class SurveyResponseListView(generics.ListCreateAPIView):
    """List and create survey responses."""
    
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        survey_id = self.kwargs.get('survey_id')
        survey = get_object_or_404(Survey, id=survey_id)
        
        # Only show responses to survey creator or if survey is public
        if self.request.user.is_authenticated and survey.creator == self.request.user:
            return SurveyResponse.objects.filter(survey=survey)
        else:
            # For public surveys, only show anonymous responses
            return SurveyResponse.objects.filter(
                survey=survey, 
                respondent__isnull=True
            )
    
    def perform_create(self, serializer):
        survey_id = self.kwargs.get('survey_id')
        survey = get_object_or_404(Survey, id=survey_id)
        
        # Set respondent if user is authenticated
        if self.request.user.is_authenticated:
            serializer.save(
                survey=survey,
                respondent=self.request.user,
                ip_address=self.get_client_ip(),
                user_agent=self.request.META.get('HTTP_USER_AGENT', '')
            )
        else:
            serializer.save(
                survey=survey,
                ip_address=self.get_client_ip(),
                user_agent=self.request.META.get('HTTP_USER_AGENT', '')
            )
    
    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


class SurveyResponseDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update survey responses."""
    
    serializer_class = SurveyResponseSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        survey_id = self.kwargs.get('survey_id')
        survey = get_object_or_404(Survey, id=survey_id)
        
        if self.request.user.is_authenticated and survey.creator == self.request.user:
            return SurveyResponse.objects.filter(survey=survey)
        else:
            return SurveyResponse.objects.filter(
                survey=survey, 
                respondent__isnull=True
            )
    
    def perform_update(self, serializer):
        # Mark as complete when updating
        serializer.save(is_complete=True, completed_at=timezone.now())


class QuestionResponseListView(generics.ListCreateAPIView):
    """List and create question responses."""
    
    serializer_class = QuestionResponseSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        response_id = self.kwargs.get('response_id')
        return QuestionResponse.objects.filter(survey_response_id=response_id)
    
    def perform_create(self, serializer):
        response_id = self.kwargs.get('response_id')
        survey_response = get_object_or_404(SurveyResponse, id=response_id)
        serializer.save(survey_response=survey_response)


class SurveyTemplateListView(generics.ListCreateAPIView):
    """List and create survey templates."""
    
    serializer_class = SurveyTemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return SurveyTemplate.objects.filter(
            Q(is_featured=True) | Q(created_by=self.request.user)
        ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class SurveyTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete survey templates."""
    
    serializer_class = SurveyTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SurveyTemplate.objects.filter(
            Q(created_by=self.request.user) | Q(is_featured=True)
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_survey(request, survey_id):
    """Publish a survey."""
    survey = get_object_or_404(Survey, id=survey_id, creator=request.user)
    serializer = SurveyPublishSerializer(data=request.data, context={'survey': survey})
    
    if serializer.is_valid():
        status_value = serializer.validated_data['status']
        survey.status = status_value
        
        if status_value == 'published':
            survey.published_at = timezone.now()
        
        survey.save()
        return Response(SurveySerializer(survey).data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def duplicate_survey(request, survey_id):
    """Duplicate a survey."""
    survey = get_object_or_404(Survey, id=survey_id, creator=request.user)
    serializer = SurveyDuplicateSerializer(data=request.data)
    
    if serializer.is_valid():
        new_title = serializer.validated_data['new_title']
        include_responses = serializer.validated_data['include_responses']
        
        # Create new survey
        new_survey = Survey.objects.create(
            title=new_title,
            description=survey.description,
            creator=request.user,
            survey_type=survey.survey_type,
            is_public=survey.is_public,
            allow_anonymous=survey.allow_anonymous,
            require_login=survey.require_login,
            max_responses=survey.max_responses,
            theme_color=survey.theme_color,
            logo=survey.logo,
            status='draft'
        )
        
        # Copy questions
        for question in survey.questions.all():
            new_question = Question.objects.create(
                survey=new_survey,
                text=question.text,
                question_type=question.question_type,
                is_required=question.is_required,
                order=question.order,
                options=question.options,
                settings=question.settings,
                validation_rules=question.validation_rules
            )
            
            # Copy question options
            for option in question.question_options.all():
                QuestionOption.objects.create(
                    question=new_question,
                    text=option.text,
                    value=option.value,
                    order=option.order,
                    image=option.image,
                    is_correct=option.is_correct
                )
        
        # Copy responses if requested
        if include_responses:
            for response in survey.responses.all():
                new_response = SurveyResponse.objects.create(
                    survey=new_survey,
                    respondent=response.respondent,
                    session_id=response.session_id,
                    ip_address=response.ip_address,
                    user_agent=response.user_agent,
                    is_complete=response.is_complete,
                    started_at=response.started_at,
                    completed_at=response.completed_at,
                    time_spent=response.time_spent
                )
                
                # Copy question responses
                for q_response in response.question_responses.all():
                    QuestionResponse.objects.create(
                        survey_response=new_response,
                        question=new_survey.questions.get(order=q_response.question.order),
                        answer=q_response.answer,
                        file_upload=q_response.file_upload
                    )
        
        return Response(SurveySerializer(new_survey).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def use_template(request, template_id):
    """Use a survey template to create a new survey."""
    template = get_object_or_404(SurveyTemplate, id=template_id)
    serializer = SurveyCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        survey_data = serializer.validated_data
        survey_data['creator'] = request.user
        survey_data['status'] = 'draft'
        
        # Create survey from template
        survey = Survey.objects.create(**survey_data)
        
        # Apply template data
        template_data = template.template_data
        if 'questions' in template_data:
            for q_data in template_data['questions']:
                question = Question.objects.create(
                    survey=survey,
                    text=q_data.get('text', ''),
                    question_type=q_data.get('question_type', 'text'),
                    is_required=q_data.get('is_required', True),
                    order=q_data.get('order', 0),
                    options=q_data.get('options', []),
                    settings=q_data.get('settings', {}),
                    validation_rules=q_data.get('validation_rules', {})
                )
        
        # Update template usage count
        template.usage_count += 1
        template.save()
        
        return Response(SurveySerializer(survey).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def survey_stats(request, survey_id):
    """Get survey statistics."""
    survey = get_object_or_404(Survey, id=survey_id, creator=request.user)
    
    responses = survey.responses.all()
    completed_responses = responses.filter(is_complete=True)
    
    stats = {
        'total_responses': responses.count(),
        'completed_responses': completed_responses.count(),
        'abandoned_responses': responses.count() - completed_responses.count(),
        'completion_rate': (completed_responses.count() / responses.count() * 100) if responses.count() > 0 else 0,
        'average_completion_time': completed_responses.aggregate(
            avg_time=models.Avg('time_spent')
        )['avg_time'] or 0,
        'question_stats': []
    }
    
    # Question statistics
    for question in survey.questions.all():
        question_responses = QuestionResponse.objects.filter(question=question)
        question_stats = {
            'question_id': question.id,
            'question_text': question.text,
            'response_count': question_responses.count(),
            'skip_count': responses.count() - question_responses.count()
        }
        
        if question.question_type in ['multiple_choice', 'checkbox']:
            option_counts = {}
            for q_response in question_responses:
                answer = q_response.answer
                if isinstance(answer, list):
                    for option in answer:
                        option_counts[option] = option_counts.get(option, 0) + 1
                else:
                    option_counts[answer] = option_counts.get(answer, 0) + 1
            question_stats['option_counts'] = option_counts
        
        elif question.question_type in ['rating', 'emoji_scale', 'likert']:
            ratings = []
            for q_response in question_responses:
                rating = q_response.answer
                if isinstance(rating, (int, float)):
                    ratings.append(rating)
            
            if ratings:
                question_stats['average_rating'] = sum(ratings) / len(ratings)
                question_stats['rating_distribution'] = {}
                for rating in ratings:
                    question_stats['rating_distribution'][str(rating)] = \
                        question_stats['rating_distribution'].get(str(rating), 0) + 1
        
        stats['question_stats'].append(question_stats)
    
    return Response(stats) 