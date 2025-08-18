from django.db import models
from django.conf import settings
from django.utils import timezone


class SurveyTemplate(models.Model):
    """Model for survey templates."""
    
    TEMPLATE_CATEGORIES = (
        ('customer_feedback', 'Customer Feedback'),
        ('employee_satisfaction', 'Employee Satisfaction'),
        ('event_feedback', 'Event Feedback'),
        ('product_research', 'Product Research'),
        ('market_research', 'Market Research'),
        ('academic', 'Academic'),
        ('healthcare', 'Healthcare'),
        ('general', 'General'),
    )
    
    TEMPLATE_TYPES = (
        ('public', 'Public'),
        ('private', 'Private'),
        ('shared', 'Shared'),
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=TEMPLATE_CATEGORIES, default='general')
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES, default='public')
    
    # Template data
    template_data = models.JSONField()  # Contains survey structure and questions
    
    # Creator and sharing
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_templates')
    shared_with = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='shared_templates', blank=True)
    
    # Usage tracking
    usage_count = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    rating_count = models.PositiveIntegerField(default=0)
    
    # Status
    is_featured = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Metadata
    tags = models.JSONField(default=list, blank=True)
    estimated_time = models.PositiveIntegerField(default=5)  # in minutes
    language = models.CharField(max_length=10, default='en')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-usage_count', '-rating', '-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        """Calculate average rating."""
        if self.rating_count > 0:
            return self.rating / self.rating_count
        return 0


class TemplateRating(models.Model):
    """Model for template ratings."""
    
    template = models.ForeignKey(SurveyTemplate, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='template_ratings')
    
    rating = models.PositiveIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['template', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.template.name} - {self.user.email} - {self.rating} stars"
    
    def save(self, *args, **kwargs):
        # Update template rating statistics
        super().save(*args, **kwargs)
        self.update_template_rating()
    
    def update_template_rating(self):
        """Update template rating statistics."""
        ratings = self.template.ratings.all()
        if ratings.exists():
            total_rating = sum(r.rating for r in ratings)
            self.template.rating = total_rating
            self.template.rating_count = ratings.count()
            self.template.save()


class TemplateCategory(models.Model):
    """Model for template categories."""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    
    # Statistics
    template_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Template Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class TemplateCollection(models.Model):
    """Model for template collections."""
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='template_collections')
    
    # Collection details
    is_public = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Templates in collection
    templates = models.ManyToManyField(SurveyTemplate, related_name='collections', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class TemplateUsage(models.Model):
    """Model for tracking template usage."""
    
    template = models.ForeignKey(SurveyTemplate, on_delete=models.CASCADE, related_name='usage_records')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='template_usage')
    
    # Usage details
    survey_created = models.ForeignKey('surveys.Survey', on_delete=models.CASCADE, related_name='template_usage')
    used_at = models.DateTimeField(auto_now_add=True)
    
    # Feedback
    was_helpful = models.BooleanField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-used_at']
    
    def __str__(self):
        return f"{self.template.name} used by {self.user.email}"
    
    def save(self, *args, **kwargs):
        # Update template usage count
        super().save(*args, **kwargs)
        self.template.usage_count = self.template.usage_records.count()
        self.template.save() 