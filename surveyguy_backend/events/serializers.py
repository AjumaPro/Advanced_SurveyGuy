from rest_framework import serializers
from .models import Event, EventRegistration, EventTemplate


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model"""
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    registration_count = serializers.SerializerMethodField()
    available_spots = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'date', 'time', 'location',
            'capacity', 'price', 'template', 'registrations', 'status',
            'created_date', 'updated_date', 'created_by', 'created_by_email',
            'registration_count', 'available_spots'
        ]
        read_only_fields = ['created_by', 'created_date', 'updated_date']
    
    def get_registration_count(self, obj):
        return obj.registrations.count()
    
    def get_available_spots(self, obj):
        return obj.capacity - obj.registrations


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating events"""
    
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'date', 'time', 'location',
            'capacity', 'price', 'template'
        ]


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for EventRegistration model"""
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'event_title', 'name', 'email', 'phone',
            'attendees', 'company', 'position', 'experience', 'goals',
            'plus_one', 'dietary', 'custom', 'template', 'registration_date'
        ]
        read_only_fields = ['registration_date']


class EventRegistrationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating event registrations"""
    
    class Meta:
        model = EventRegistration
        fields = [
            'event', 'name', 'email', 'phone', 'attendees', 'company',
            'position', 'experience', 'goals', 'plus_one', 'dietary',
            'custom', 'template'
        ]


class EventTemplateSerializer(serializers.ModelSerializer):
    """Serializer for EventTemplate model"""
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = EventTemplate
        fields = [
            'id', 'name', 'description', 'category', 'template_data',
            'is_public', 'created_at', 'updated_at', 'created_by',
            'created_by_email'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at'] 