from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class SurveyAnalytics(models.Model):
    """Model for survey analytics"""
    
    survey = models.OneToOneField('surveys.Survey', on_delete=models.CASCADE, related_name='analytics')
    total_views = models.IntegerField(default=0)
    total_responses = models.IntegerField(default=0)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_completion_time = models.IntegerField(default=0)  # in seconds
    bounce_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'survey_analytics'
        verbose_name_plural = 'Survey analytics'
    
    def __str__(self):
        return f"Analytics for {self.survey.title}"


class QuestionAnalytics(models.Model):
    """Model for question-level analytics"""
    
    question = models.OneToOneField('surveys.Question', on_delete=models.CASCADE, related_name='analytics')
    total_responses = models.IntegerField(default=0)
    skip_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_time_spent = models.IntegerField(default=0)  # in seconds
    response_distribution = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'question_analytics'
        verbose_name_plural = 'Question analytics'
    
    def __str__(self):
        return f"Analytics for {self.question.title}"


class UserActivity(models.Model):
    """Model for tracking user activity"""
    
    ACTIVITY_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('survey_created', 'Survey Created'),
        ('survey_edited', 'Survey Edited'),
        ('survey_published', 'Survey Published'),
        ('survey_deleted', 'Survey Deleted'),
        ('response_submitted', 'Response Submitted'),
        ('template_used', 'Template Used'),
        ('payment_made', 'Payment Made'),
        ('subscription_changed', 'Subscription Changed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activities'
        verbose_name_plural = 'User activities'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.activity_type}"


class SurveySession(models.Model):
    """Model for tracking survey sessions"""
    
    session_id = models.CharField(max_length=255, unique=True)
    survey = models.ForeignKey('surveys.Survey', on_delete=models.CASCADE, related_name='sessions')
    respondent_id = models.CharField(max_length=255, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    time_spent = models.IntegerField(default=0)  # in seconds
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        db_table = 'survey_sessions'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"Session {self.session_id} for {self.survey.title}"
    
    def complete_session(self):
        self.is_completed = True
        self.completed_at = timezone.now()
        if self.started_at:
            self.time_spent = int((self.completed_at - self.started_at).total_seconds())
        self.save()


class ResponseAnalytics(models.Model):
    """Model for response-level analytics"""
    
    response = models.OneToOneField('surveys.Response', on_delete=models.CASCADE, related_name='analytics')
    time_spent = models.IntegerField(default=0)  # in seconds
    is_complete = models.BooleanField(default=True)
    quality_score = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'response_analytics'
        verbose_name_plural = 'Response analytics'
    
    def __str__(self):
        return f"Analytics for response {self.response.id}"


class DashboardMetrics(models.Model):
    """Model for dashboard metrics"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboard_metrics')
    total_surveys = models.IntegerField(default=0)
    total_responses = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    active_subscriptions = models.IntegerField(default=0)
    monthly_growth = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_metrics'
        verbose_name_plural = 'Dashboard metrics'
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Metrics for {self.user.email} on {self.date}"


class ExportLog(models.Model):
    """Model for tracking data exports"""
    
    EXPORT_TYPES = [
        ('survey_responses', 'Survey Responses'),
        ('survey_analytics', 'Survey Analytics'),
        ('user_data', 'User Data'),
        ('payment_data', 'Payment Data'),
    ]
    
    FORMAT_CHOICES = [
        ('csv', 'CSV'),
        ('excel', 'Excel'),
        ('json', 'JSON'),
        ('pdf', 'PDF'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='export_logs')
    export_type = models.CharField(max_length=50, choices=EXPORT_TYPES)
    format = models.CharField(max_length=10, choices=FORMAT_CHOICES)
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.IntegerField(default=0)  # in bytes
    filters = models.JSONField(default=dict)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'export_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Export {self.export_type} for {self.user.email}"
