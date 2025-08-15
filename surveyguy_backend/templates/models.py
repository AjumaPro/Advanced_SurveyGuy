from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Template(models.Model):
    """Model for survey and event templates"""
    
    TYPE_CHOICES = [
        ('survey', 'Survey'),
        ('event', 'Event'),
    ]
    
    CATEGORY_CHOICES = [
        # Survey categories
        ('customer-feedback', 'Customer Feedback'),
        ('employee', 'Employee'),
        ('academic', 'Academic'),
        ('health', 'Health'),
        ('event', 'Event'),
        ('community', 'Community'),
        ('market-research', 'Market Research'),
        ('product-feedback', 'Product Feedback'),
        ('service-evaluation', 'Service Evaluation'),
        ('user-experience', 'User Experience'),
        ('advanced-survey', 'Advanced Survey'),
        # Event categories
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
        ('meetup', 'Meetup'),
        ('training', 'Training'),
        ('custom', 'Custom'),
    ]
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_general_templates')
    template_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    template_data = models.JSONField()
    questions = models.JSONField(default=list)
    estimated_time = models.CharField(max_length=50, blank=True)
    response_count = models.IntegerField(default=0)
    target_audience = models.TextField(blank=True)
    use_cases = models.JSONField(default=list)
    insights = models.JSONField(default=list)
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'templates'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.type})"
