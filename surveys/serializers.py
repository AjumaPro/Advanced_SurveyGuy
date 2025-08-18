from rest_framework import serializers
from .models import Survey, Question, QuestionOption, SurveyResponse, QuestionResponse, SurveyTemplate


class QuestionOptionSerializer(serializers.ModelSerializer):
    """Serializer for question options."""
    
    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'value', 'order', 'image', 'is_correct']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for survey questions."""
    
    options = QuestionOptionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'survey', 'text', 'question_type', 'is_required', 'order', 
                 'options', 'settings', 'validation_rules', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuestionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating questions."""
    
    class Meta:
        model = Question
        fields = ['survey', 'text', 'question_type', 'is_required', 'order', 
                 'options', 'settings', 'validation_rules']


class SurveySerializer(serializers.ModelSerializer):
    """Serializer for surveys."""
    
    questions = QuestionSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField()
    response_count = serializers.ReadOnlyField()
    completion_rate = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    
    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'creator', 'status', 'survey_type',
                 'is_public', 'allow_anonymous', 'require_login', 'max_responses',
                 'start_date', 'end_date', 'theme_color', 'logo', 'questions',
                 'response_count', 'completion_rate', 'is_active', 'created_at', 
                 'updated_at', 'published_at']
        read_only_fields = ['id', 'creator', 'response_count', 'completion_rate', 
                           'is_active', 'created_at', 'updated_at', 'published_at']


class SurveyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating surveys."""
    
    class Meta:
        model = Survey
        fields = ['title', 'description', 'survey_type', 'is_public', 'allow_anonymous',
                 'require_login', 'max_responses', 'start_date', 'end_date', 
                 'theme_color', 'logo']


class SurveyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating surveys."""
    
    class Meta:
        model = Survey
        fields = ['title', 'description', 'survey_type', 'is_public', 'allow_anonymous',
                 'require_login', 'max_responses', 'start_date', 'end_date', 
                 'theme_color', 'logo', 'status']


class QuestionResponseSerializer(serializers.ModelSerializer):
    """Serializer for question responses."""
    
    question = QuestionSerializer(read_only=True)
    
    class Meta:
        model = QuestionResponse
        fields = ['id', 'survey_response', 'question', 'answer', 'file_upload', 'created_at']
        read_only_fields = ['id', 'created_at']


class SurveyResponseSerializer(serializers.ModelSerializer):
    """Serializer for survey responses."""
    
    question_responses = QuestionResponseSerializer(many=True, read_only=True)
    respondent = serializers.StringRelatedField()
    
    class Meta:
        model = SurveyResponse
        fields = ['id', 'survey', 'respondent', 'session_id', 'ip_address', 'user_agent',
                 'is_complete', 'started_at', 'completed_at', 'time_spent', 
                 'question_responses', 'completion_time']
        read_only_fields = ['id', 'session_id', 'ip_address', 'user_agent', 'started_at',
                           'completed_at', 'completion_time']


class SurveyResponseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating survey responses."""
    
    class Meta:
        model = SurveyResponse
        fields = ['survey']


class QuestionResponseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating question responses."""
    
    class Meta:
        model = QuestionResponse
        fields = ['survey_response', 'question', 'answer', 'file_upload']


class SurveyTemplateSerializer(serializers.ModelSerializer):
    """Serializer for survey templates."""
    
    created_by = serializers.StringRelatedField()
    
    class Meta:
        model = SurveyTemplate
        fields = ['id', 'name', 'description', 'category', 'template_data', 
                 'usage_count', 'is_featured', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'usage_count', 'created_at', 'updated_at']


class SurveyTemplateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating survey templates."""
    
    class Meta:
        model = SurveyTemplate
        fields = ['name', 'description', 'category', 'template_data', 'is_featured']


class SurveyWithQuestionsSerializer(serializers.ModelSerializer):
    """Serializer for surveys with full question details."""
    
    questions = QuestionSerializer(many=True, read_only=True)
    creator = serializers.StringRelatedField()
    
    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'creator', 'status', 'survey_type',
                 'is_public', 'allow_anonymous', 'require_login', 'max_responses',
                 'start_date', 'end_date', 'theme_color', 'logo', 'questions',
                 'created_at', 'updated_at']


class SurveyPublishSerializer(serializers.Serializer):
    """Serializer for publishing surveys."""
    
    status = serializers.ChoiceField(choices=Survey.SURVEY_STATUS)
    
    def validate_status(self, value):
        if value == 'published':
            survey = self.context['survey']
            if not survey.questions.exists():
                raise serializers.ValidationError("Cannot publish survey without questions")
        return value


class SurveyDuplicateSerializer(serializers.Serializer):
    """Serializer for duplicating surveys."""
    
    new_title = serializers.CharField(max_length=200)
    include_responses = serializers.BooleanField(default=False) 