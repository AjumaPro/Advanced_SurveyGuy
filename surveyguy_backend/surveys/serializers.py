from rest_framework import serializers
from .models import Survey, Question, Response, SurveyTemplate, SurveyCategory, SurveySubcategory


class SurveySerializer(serializers.ModelSerializer):
    """Serializer for Survey model"""
    question_count = serializers.SerializerMethodField()
    response_count = serializers.SerializerMethodField()
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Survey
        fields = [
            'id', 'title', 'description', 'status', 'theme', 'settings',
            'completion_rate', 'total_responses', 'created_at', 'updated_at',
            'user', 'user_email', 'question_count', 'response_count'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_question_count(self, obj):
        return obj.questions.count()
    
    def get_response_count(self, obj):
        return obj.responses.count()


class SurveyDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed survey view with questions"""
    questions = serializers.SerializerMethodField()
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Survey
        fields = [
            'id', 'title', 'description', 'status', 'theme', 'settings',
            'completion_rate', 'total_responses', 'created_at', 'updated_at',
            'user', 'user_email', 'questions'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def get_questions(self, obj):
        questions = obj.questions.all().order_by('order_index')
        return QuestionSerializer(questions, many=True).data


class SurveyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating surveys"""
    
    class Meta:
        model = Survey
        fields = ['title', 'description', 'theme', 'settings']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for Question model"""
    
    class Meta:
        model = Question
        fields = [
            'id', 'type', 'title', 'description', 'required', 'options',
            'settings', 'validation', 'order_index', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ResponseSerializer(serializers.ModelSerializer):
    """Serializer for Response model"""
    
    class Meta:
        model = Response
        fields = [
            'id', 'answer', 'respondent_id', 'session_id', 'user',
            'created_at'
        ]
        read_only_fields = ['created_at']


class SurveyTemplateSerializer(serializers.ModelSerializer):
    """Serializer for SurveyTemplate model"""
    
    class Meta:
        model = SurveyTemplate
        fields = ['id', 'name', 'description', 'category', 'subcategory', 
                 'template_data', 'is_public', 'created_at']
        read_only_fields = ['id', 'created_at']


class SurveyCategorySerializer(serializers.ModelSerializer):
    """Serializer for SurveyCategory model"""
    
    class Meta:
        model = SurveyCategory
        fields = ['id', 'category_key', 'name', 'description', 'icon', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class SurveySubcategorySerializer(serializers.ModelSerializer):
    """Serializer for SurveySubcategory model"""
    
    class Meta:
        model = SurveySubcategory
        fields = ['id', 'category_key', 'subcategory_key', 'name', 'description', 
                 'icon', 'template_data', 'created_at']
        read_only_fields = ['id', 'created_at']


class SurveyWithQuestionsSerializer(serializers.ModelSerializer):
    """Serializer for Survey with nested questions"""
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'status', 'theme', 'settings', 
                 'completion_rate', 'total_responses', 'questions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'completion_rate', 'total_responses', 'created_at', 'updated_at']


class SurveyWithResponsesSerializer(serializers.ModelSerializer):
    """Serializer for Survey with nested responses"""
    responses = ResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'status', 'responses', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TemplateCreateSerializer(serializers.Serializer):
    """Serializer for creating surveys from templates"""
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value 