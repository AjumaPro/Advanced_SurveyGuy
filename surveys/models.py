from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Survey(models.Model):
    """Survey model for storing survey information."""
    
    SURVEY_STATUS = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )
    
    SURVEY_TYPES = (
        ('general', 'General Survey'),
        ('event', 'Event Survey'),
        ('feedback', 'Feedback Survey'),
        ('research', 'Research Survey'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='surveys')
    status = models.CharField(max_length=20, choices=SURVEY_STATUS, default='draft')
    survey_type = models.CharField(max_length=20, choices=SURVEY_TYPES, default='general')
    
    # Settings
    is_public = models.BooleanField(default=False)
    allow_anonymous = models.BooleanField(default=True)
    require_login = models.BooleanField(default=False)
    max_responses = models.PositiveIntegerField(blank=True, null=True)
    
    # Timing
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    
    # Styling
    theme_color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    logo = models.ImageField(upload_to='survey_logos/', blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def is_active(self):
        """Check if survey is currently active."""
        now = timezone.now()
        if self.status != 'published':
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        return True
    
    @property
    def response_count(self):
        """Get total number of responses."""
        return self.responses.count()
    
    @property
    def completion_rate(self):
        """Calculate completion rate."""
        if self.max_responses:
            return (self.response_count / self.max_responses) * 100
        return 0


class Question(models.Model):
    """Question model for survey questions."""
    
    QUESTION_TYPES = (
        ('multiple_choice', 'Multiple Choice'),
        ('checkbox', 'Checkbox'),
        ('text', 'Text'),
        ('textarea', 'Long Text'),
        ('rating', 'Rating'),
        ('emoji_scale', 'Emoji Scale'),
        ('likert', 'Likert Scale'),
        ('file_upload', 'File Upload'),
        ('date', 'Date'),
        ('email', 'Email'),
        ('phone', 'Phone Number'),
    )
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    is_required = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    
    # Options for multiple choice/checkbox questions
    options = models.JSONField(default=list, blank=True)
    
    # Settings for different question types
    settings = models.JSONField(default=dict, blank=True)
    
    # Validation
    validation_rules = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.survey.title} - {self.text[:50]}"


class QuestionOption(models.Model):
    """Options for multiple choice and checkbox questions."""
    
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_options')
    text = models.CharField(max_length=200)
    value = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='question_options/', blank=True, null=True)
    is_correct = models.BooleanField(default=False)  # For quiz-like surveys
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.question.text[:30]} - {self.text}"


class SurveyResponse(models.Model):
    """Model for storing survey responses."""
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses')
    respondent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                 null=True, blank=True, related_name='survey_responses')
    
    # Anonymous response tracking
    session_id = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    # Response data
    is_complete = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    time_spent = models.PositiveIntegerField(default=0)  # in seconds
    
    class Meta:
        ordering = ['-started_at']
    
    def __str__(self):
        respondent_name = self.respondent.email if self.respondent else 'Anonymous'
        return f"{self.survey.title} - {respondent_name}"
    
    @property
    def completion_time(self):
        """Calculate completion time in seconds."""
        if self.completed_at and self.started_at:
            return (self.completed_at - self.started_at).total_seconds()
        return 0


class QuestionResponse(models.Model):
    """Model for storing individual question responses."""
    
    survey_response = models.ForeignKey(SurveyResponse, on_delete=models.CASCADE, related_name='question_responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    
    # Response data (stored as JSON to handle different question types)
    answer = models.JSONField()
    
    # File uploads
    file_upload = models.FileField(upload_to='response_files/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['survey_response', 'question']
    
    def __str__(self):
        return f"{self.survey_response} - {self.question.text[:30]}"


class SurveyTemplate(models.Model):
    """Template for creating surveys."""
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    
    # Template data
    template_data = models.JSONField()  # Contains survey structure and questions
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                                 null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-usage_count', '-created_at']
    
    def __str__(self):
        return self.name 