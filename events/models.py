from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Event(models.Model):
    """Event model for managing events."""
    
    EVENT_STATUS = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    EVENT_TYPES = (
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('meetup', 'Meetup'),
        ('webinar', 'Webinar'),
        ('other', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    
    # Event details
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='other')
    status = models.CharField(max_length=20, choices=EVENT_STATUS, default='draft')
    
    # Location
    venue = models.CharField(max_length=200, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    is_virtual = models.BooleanField(default=False)
    virtual_meeting_url = models.URLField(blank=True, null=True)
    
    # Timing
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    registration_deadline = models.DateTimeField(blank=True, null=True)
    
    # Capacity and pricing
    max_attendees = models.PositiveIntegerField(blank=True, null=True)
    is_free = models.BooleanField(default=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    
    # Settings
    allow_registration = models.BooleanField(default=True)
    require_approval = models.BooleanField(default=False)
    is_public = models.BooleanField(default=True)
    
    # Media
    banner_image = models.ImageField(upload_to='event_banners/', blank=True, null=True)
    logo = models.ImageField(upload_to='event_logos/', blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title
    
    @property
    def is_active(self):
        """Check if event is currently active."""
        now = timezone.now()
        return (self.status == 'published' and 
                self.start_date <= now <= self.end_date)
    
    @property
    def is_upcoming(self):
        """Check if event is upcoming."""
        now = timezone.now()
        return (self.status == 'published' and 
                self.start_date > now)
    
    @property
    def is_past(self):
        """Check if event is past."""
        now = timezone.now()
        return self.end_date < now
    
    @property
    def registration_count(self):
        """Get number of registrations."""
        return self.registrations.filter(status='confirmed').count()
    
    @property
    def is_full(self):
        """Check if event is at full capacity."""
        if not self.max_attendees:
            return False
        return self.registration_count >= self.max_attendees


class EventRegistration(models.Model):
    """Model for event registrations."""
    
    REGISTRATION_STATUS = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('waitlist', 'Waitlist'),
    )
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    attendee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_registrations')
    
    # Registration details
    status = models.CharField(max_length=20, choices=REGISTRATION_STATUS, default='pending')
    registration_date = models.DateTimeField(auto_now_add=True)
    confirmed_date = models.DateTimeField(blank=True, null=True)
    
    # Additional information
    dietary_restrictions = models.TextField(blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=200, blank=True, null=True)
    
    # Payment information
    payment_status = models.CharField(max_length=20, default='pending')
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_date = models.DateTimeField(blank=True, null=True)
    
    # Notes
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        unique_together = ['event', 'attendee']
        ordering = ['-registration_date']
    
    def __str__(self):
        return f"{self.attendee.email} - {self.event.title}"
    
    def save(self, *args, **kwargs):
        # Auto-confirm if event doesn't require approval
        if self.status == 'pending' and not self.event.require_approval:
            self.status = 'confirmed'
            self.confirmed_date = timezone.now()
        super().save(*args, **kwargs)


class EventSurvey(models.Model):
    """Model for linking surveys to events."""
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='surveys')
    survey = models.ForeignKey('surveys.Survey', on_delete=models.CASCADE, related_name='events')
    
    # Survey settings
    is_pre_event = models.BooleanField(default=False)
    is_post_event = models.BooleanField(default=False)
    send_reminder = models.BooleanField(default=True)
    reminder_days_before = models.PositiveIntegerField(default=1)
    
    # Timing
    available_from = models.DateTimeField(blank=True, null=True)
    available_until = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'survey']
    
    def __str__(self):
        survey_type = "Pre-event" if self.is_pre_event else "Post-event"
        return f"{self.event.title} - {survey_type} Survey"


class EventNotification(models.Model):
    """Model for event notifications."""
    
    NOTIFICATION_TYPES = (
        ('registration', 'Registration'),
        ('reminder', 'Reminder'),
        ('update', 'Update'),
        ('cancellation', 'Cancellation'),
    )
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='notifications')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_notifications')
    
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} - {self.recipient.email}"


class EventCategory(models.Model):
    """Model for event categories."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    icon = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Event Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name 