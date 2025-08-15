from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Event(models.Model):
    """Model for events"""
    
    TEMPLATE_CHOICES = [
        ('standard', 'Standard'),
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
        ('meetup', 'Meetup'),
        ('training', 'Training'),
        ('custom', 'Custom'),
    ]
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    capacity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    template = models.CharField(max_length=20, choices=TEMPLATE_CHOICES, default='standard')
    status = models.CharField(max_length=20, default='active')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['-created_date']
    
    def __str__(self):
        return self.title
    
    @property
    def registration_count(self):
        return self.event_registrations.count()
    
    @property
    def available_spots(self):
        return self.capacity - self.event_registrations.count()


class EventRegistration(models.Model):
    """Model for event registrations"""
    
    EXPERIENCE_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_registrations')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    attendees = models.IntegerField(default=1)
    company = models.CharField(max_length=255, blank=True)
    position = models.CharField(max_length=255, blank=True)
    experience = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, blank=True)
    goals = models.TextField(blank=True)
    plus_one = models.BooleanField(default=False)
    dietary = models.CharField(max_length=100, blank=True)
    custom = models.TextField(blank=True)
    template = models.CharField(max_length=50, default='standard')
    registration_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'event_registrations'
        ordering = ['-registration_date']
    
    def __str__(self):
        return f"{self.name} - {self.event.title}"


class EventTemplate(models.Model):
    """Model for event templates"""
    
    CATEGORY_CHOICES = [
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
        ('meetup', 'Meetup'),
        ('training', 'Training'),
        ('custom', 'Custom'),
    ]
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_event_templates')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    template_data = models.JSONField()
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'event_templates'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
