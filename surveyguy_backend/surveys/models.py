from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
import json

User = get_user_model()


class Survey(models.Model):
    """Model for surveys"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
        ('deleted', 'Deleted'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='surveys')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    theme = models.JSONField(default=dict)
    settings = models.JSONField(default=dict)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_responses = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'surveys'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def question_count(self):
        return self.questions.count()
    
    @property
    def response_count(self):
        return self.responses.count()


class Question(models.Model):
    """Model for survey questions"""
    
    TYPE_CHOICES = [
        ('text', 'Text'),
        ('multiple_choice', 'Multiple Choice'),
        ('emoji_scale', 'Emoji Scale'),
        ('rating_scale', 'Rating Scale'),
        ('yes_no', 'Yes/No'),
        ('dropdown', 'Dropdown'),
        ('ranking', 'Ranking'),
        ('matrix', 'Matrix'),
    ]
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='questions')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.TextField()
    description = models.TextField(blank=True)
    required = models.BooleanField(default=False)
    options = models.JSONField(default=list)
    settings = models.JSONField(default=dict)
    validation = models.JSONField(default=dict)
    order_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'questions'
        ordering = ['order_index', 'created_at']
    
    def __str__(self):
        return f"{self.survey.title} - {self.title[:50]}"


class Response(models.Model):
    """Model for survey responses"""
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='responses')
    answer = models.JSONField()
    respondent_id = models.CharField(max_length=255, blank=True)
    session_id = models.CharField(max_length=255, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='responses', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'responses'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Response to {self.question.title} by {self.respondent_id or 'Anonymous'}"


class SurveyTemplate(models.Model):
    """Model for survey templates"""
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_templates')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    subcategory = models.CharField(max_length=100, blank=True)
    template_data = models.JSONField()
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'survey_templates'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class SurveyCategory(models.Model):
    """Model for survey categories"""
    
    category_key = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, blank=True)
    color = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'survey_categories'
        verbose_name_plural = 'Survey categories'
    
    def __str__(self):
        return self.name


class SurveySubcategory(models.Model):
    """Model for survey subcategories"""
    
    category_key = models.ForeignKey(SurveyCategory, on_delete=models.CASCADE, to_field='category_key')
    subcategory_key = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, blank=True)
    template_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'survey_subcategories'
        verbose_name_plural = 'Survey subcategories'
        unique_together = ['category_key', 'subcategory_key']
    
    def __str__(self):
        return f"{self.category_key.name} - {self.name}"


class Image(models.Model):
    """Model for uploaded images"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='images')
    filename = models.CharField(max_length=255)
    original_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100)
    size = models.IntegerField()
    url = models.URLField(max_length=500)
    firebase_path = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'images'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.original_name


class Subscription(models.Model):
    """Model for email subscriptions"""
    
    email = models.EmailField(unique=True)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    plan_id = models.CharField(max_length=50, default='free')
    status = models.CharField(max_length=50, default='active')
    subscribed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subscriptions'
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return self.email


class SubscriptionPreference(models.Model):
    """Model for subscription preferences"""
    
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name='preferences')
    email_notifications = models.BooleanField(default=True)
    survey_updates = models.BooleanField(default=True)
    new_surveys = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'subscription_preferences'
        verbose_name_plural = 'Subscription preferences'
    
    def __str__(self):
        return f"Preferences for {self.subscription.email}"


class PendingPayment(models.Model):
    """Model for pending payments"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pending_payments')
    payment_intent = models.ForeignKey('auth_app.PaymentIntent', on_delete=models.CASCADE, related_name='pending_payments')
    plan_id = models.CharField(max_length=50)
    plan_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    reference = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pending_payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.reference}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at


class PaymentApproval(models.Model):
    """Model for payment approvals"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    payment_intent = models.OneToOneField('auth_app.PaymentIntent', on_delete=models.CASCADE, related_name='payment_approval')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_approvals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GHS')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment_approvals_given')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payment_approvals'
    
    def __str__(self):
        return f"Payment approval for {self.user.email} - {self.status}"


class AdminManagement(models.Model):
    """Model for admin management"""
    
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_management')
    super_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='managed_admins')
    action = models.CharField(max_length=50)
    permissions = models.JSONField(default=list)
    department = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=50, default='active')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_management'
    
    def __str__(self):
        return f"{self.super_admin.email} manages {self.admin.email}"
