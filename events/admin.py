from django.contrib import admin
from .models import Event, EventRegistration, EventSurvey, EventNotification, EventCategory


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin for Event model."""
    
    list_display = ['title', 'organizer', 'event_type', 'status', 'start_date', 
                   'end_date', 'registration_count', 'is_active', 'is_full']
    list_filter = ['status', 'event_type', 'is_public', 'is_virtual', 'is_free', 'created_at']
    search_fields = ['title', 'description', 'organizer__email', 'venue', 'city']
    readonly_fields = ['registration_count', 'is_active', 'is_upcoming', 'is_past', 
                      'is_full', 'created_at', 'updated_at']
    ordering = ['-start_date']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'organizer', 'event_type', 'status')
        }),
        ('Location', {
            'fields': ('venue', 'address', 'city', 'country', 'is_virtual', 'virtual_meeting_url')
        }),
        ('Timing', {
            'fields': ('start_date', 'end_date', 'registration_deadline')
        }),
        ('Capacity & Pricing', {
            'fields': ('max_attendees', 'is_free', 'ticket_price', 'currency')
        }),
        ('Settings', {
            'fields': ('allow_registration', 'require_approval', 'is_public')
        }),
        ('Media', {
            'fields': ('banner_image', 'logo')
        }),
        ('Statistics', {
            'fields': ('registration_count', 'is_active', 'is_upcoming', 'is_past', 'is_full'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    """Admin for EventRegistration model."""
    
    list_display = ['event', 'attendee', 'status', 'registration_date', 'payment_status']
    list_filter = ['status', 'payment_status', 'registration_date']
    search_fields = ['event__title', 'attendee__email']
    readonly_fields = ['registration_date', 'confirmed_date']
    ordering = ['-registration_date']
    
    fieldsets = (
        ('Registration Details', {
            'fields': ('event', 'attendee', 'status', 'registration_date', 'confirmed_date')
        }),
        ('Additional Information', {
            'fields': ('dietary_restrictions', 'special_requirements', 'emergency_contact', 'notes')
        }),
        ('Payment', {
            'fields': ('payment_status', 'payment_amount', 'payment_date')
        }),
    )


@admin.register(EventSurvey)
class EventSurveyAdmin(admin.ModelAdmin):
    """Admin for EventSurvey model."""
    
    list_display = ['event', 'survey', 'is_pre_event', 'is_post_event', 'send_reminder']
    list_filter = ['is_pre_event', 'is_post_event', 'send_reminder', 'created_at']
    search_fields = ['event__title', 'survey__title']
    ordering = ['event', '-created_at']


@admin.register(EventNotification)
class EventNotificationAdmin(admin.ModelAdmin):
    """Admin for EventNotification model."""
    
    list_display = ['event', 'recipient', 'notification_type', 'is_sent', 'created_at']
    list_filter = ['notification_type', 'is_sent', 'created_at']
    search_fields = ['event__title', 'recipient__email', 'subject']
    readonly_fields = ['created_at', 'sent_at']
    ordering = ['-created_at']


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    """Admin for EventCategory model."""
    
    list_display = ['name', 'color', 'icon', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name'] 