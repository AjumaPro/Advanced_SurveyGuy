from django.contrib import admin
from .models import Survey, Question, QuestionOption, SurveyResponse, QuestionResponse, SurveyTemplate


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    """Admin for Survey model."""
    
    list_display = ['title', 'creator', 'status', 'survey_type', 'response_count', 
                   'is_active', 'created_at']
    list_filter = ['status', 'survey_type', 'is_public', 'created_at']
    search_fields = ['title', 'description', 'creator__email']
    readonly_fields = ['response_count', 'completion_rate', 'is_active', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'creator', 'survey_type')
        }),
        ('Settings', {
            'fields': ('status', 'is_public', 'allow_anonymous', 'require_login', 'max_responses')
        }),
        ('Timing', {
            'fields': ('start_date', 'end_date')
        }),
        ('Styling', {
            'fields': ('theme_color', 'logo')
        }),
        ('Statistics', {
            'fields': ('response_count', 'completion_rate', 'is_active'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    """Admin for Question model."""
    
    list_display = ['text', 'survey', 'question_type', 'is_required', 'order']
    list_filter = ['question_type', 'is_required', 'created_at']
    search_fields = ['text', 'survey__title']
    ordering = ['survey', 'order']
    
    fieldsets = (
        ('Question Details', {
            'fields': ('survey', 'text', 'question_type', 'is_required', 'order')
        }),
        ('Options & Settings', {
            'fields': ('options', 'settings', 'validation_rules'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
    """Admin for QuestionOption model."""
    
    list_display = ['text', 'question', 'value', 'order', 'is_correct']
    list_filter = ['is_correct', 'order']
    search_fields = ['text', 'question__text']
    ordering = ['question', 'order']


@admin.register(SurveyResponse)
class SurveyResponseAdmin(admin.ModelAdmin):
    """Admin for SurveyResponse model."""
    
    list_display = ['survey', 'respondent', 'is_complete', 'started_at', 'completed_at', 'completion_time']
    list_filter = ['is_complete', 'started_at', 'completed_at']
    search_fields = ['survey__title', 'respondent__email']
    readonly_fields = ['completion_time', 'started_at']
    ordering = ['-started_at']
    
    fieldsets = (
        ('Response Details', {
            'fields': ('survey', 'respondent', 'session_id', 'is_complete')
        }),
        ('Timing', {
            'fields': ('started_at', 'completed_at', 'time_spent', 'completion_time')
        }),
        ('Metadata', {
            'fields': ('ip_address', 'user_agent'),
            'classes': ('collapse',)
        }),
    )


@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    """Admin for QuestionResponse model."""
    
    list_display = ['survey_response', 'question', 'answer_preview', 'created_at']
    list_filter = ['created_at', 'question__question_type']
    search_fields = ['survey_response__survey__title', 'question__text']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    def answer_preview(self, obj):
        """Show a preview of the answer."""
        answer = obj.answer
        if isinstance(answer, str) and len(answer) > 50:
            return f"{answer[:50]}..."
        return str(answer)
    answer_preview.short_description = 'Answer Preview'


@admin.register(SurveyTemplate)
class SurveyTemplateAdmin(admin.ModelAdmin):
    """Admin for SurveyTemplate model."""
    
    list_display = ['name', 'category', 'created_by', 'usage_count', 'is_featured', 'created_at']
    list_filter = ['category', 'is_featured', 'created_at']
    search_fields = ['name', 'description', 'created_by__email']
    readonly_fields = ['usage_count', 'created_at', 'updated_at']
    ordering = ['-usage_count', '-created_at']
    
    fieldsets = (
        ('Template Information', {
            'fields': ('name', 'description', 'category', 'created_by')
        }),
        ('Template Data', {
            'fields': ('template_data',),
            'classes': ('collapse',)
        }),
        ('Usage', {
            'fields': ('usage_count', 'is_featured')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    ) 