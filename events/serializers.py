from rest_framework import serializers
from .models import Event, EventRegistration, EventSurvey, EventNotification, EventCategory


class EventCategorySerializer(serializers.ModelSerializer):
    """Serializer for event categories."""
    
    class Meta:
        model = EventCategory
        fields = ['id', 'name', 'description', 'color', 'icon', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events."""
    
    organizer = serializers.StringRelatedField()
    registration_count = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'organizer', 'event_type', 'status',
                 'venue', 'address', 'city', 'country', 'is_virtual', 'virtual_meeting_url',
                 'start_date', 'end_date', 'registration_deadline', 'max_attendees',
                 'is_free', 'ticket_price', 'currency', 'allow_registration',
                 'require_approval', 'is_public', 'banner_image', 'logo',
                 'registration_count', 'is_active', 'is_upcoming', 'is_past', 'is_full',
                 'created_at', 'updated_at', 'published_at']
        read_only_fields = ['id', 'organizer', 'registration_count', 'is_active',
                           'is_upcoming', 'is_past', 'is_full', 'created_at', 
                           'updated_at', 'published_at']


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'event_type', 'venue', 'address', 'city',
                 'country', 'is_virtual', 'virtual_meeting_url', 'start_date', 'end_date',
                 'registration_deadline', 'max_attendees', 'is_free', 'ticket_price',
                 'currency', 'allow_registration', 'require_approval', 'is_public',
                 'banner_image', 'logo']


class EventUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating events."""
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'event_type', 'status', 'venue', 'address',
                 'city', 'country', 'is_virtual', 'virtual_meeting_url', 'start_date',
                 'end_date', 'registration_deadline', 'max_attendees', 'is_free',
                 'ticket_price', 'currency', 'allow_registration', 'require_approval',
                 'is_public', 'banner_image', 'logo']


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for event registrations."""
    
    event = EventSerializer(read_only=True)
    attendee = serializers.StringRelatedField()
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'attendee', 'status', 'registration_date',
                 'confirmed_date', 'dietary_restrictions', 'special_requirements',
                 'emergency_contact', 'payment_status', 'payment_amount',
                 'payment_date', 'notes']
        read_only_fields = ['id', 'event', 'attendee', 'registration_date',
                           'confirmed_date', 'payment_date']


class EventRegistrationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating event registrations."""
    
    class Meta:
        model = EventRegistration
        fields = ['event', 'dietary_restrictions', 'special_requirements',
                 'emergency_contact', 'notes']


class EventSurveySerializer(serializers.ModelSerializer):
    """Serializer for event surveys."""
    
    event = EventSerializer(read_only=True)
    survey = serializers.StringRelatedField()
    
    class Meta:
        model = EventSurvey
        fields = ['id', 'event', 'survey', 'is_pre_event', 'is_post_event',
                 'send_reminder', 'reminder_days_before', 'available_from',
                 'available_until', 'created_at']
        read_only_fields = ['id', 'created_at']


class EventNotificationSerializer(serializers.ModelSerializer):
    """Serializer for event notifications."""
    
    event = EventSerializer(read_only=True)
    recipient = serializers.StringRelatedField()
    
    class Meta:
        model = EventNotification
        fields = ['id', 'event', 'recipient', 'notification_type', 'subject',
                 'message', 'is_sent', 'sent_at', 'created_at']
        read_only_fields = ['id', 'event', 'recipient', 'is_sent', 'sent_at', 'created_at']


class EventPublishSerializer(serializers.Serializer):
    """Serializer for publishing events."""
    
    status = serializers.ChoiceField(choices=Event.EVENT_STATUS)
    
    def validate_status(self, value):
        if value == 'published':
            event = self.context['event']
            if not event.start_date or not event.end_date:
                raise serializers.ValidationError("Event must have start and end dates to be published")
        return value


class EventDuplicateSerializer(serializers.Serializer):
    """Serializer for duplicating events."""
    
    new_title = serializers.CharField(max_length=200)
    include_registrations = serializers.BooleanField(default=False) 