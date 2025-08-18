from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, EventRegistration, EventSurvey, EventNotification, EventCategory
from .serializers import (
    EventSerializer, EventCreateSerializer, EventUpdateSerializer,
    EventRegistrationSerializer, EventRegistrationCreateSerializer,
    EventSurveySerializer, EventNotificationSerializer,
    EventCategorySerializer, EventPublishSerializer, EventDuplicateSerializer
)


class EventListView(generics.ListCreateAPIView):
    """List and create events."""
    
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'event_type', 'is_public', 'is_virtual']
    search_fields = ['title', 'description', 'venue', 'city']
    ordering_fields = ['start_date', 'created_at', 'title']
    ordering = ['-start_date']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            # Show user's own events and public events
            return Event.objects.filter(
                Q(organizer=user) | Q(is_public=True)
            ).distinct()
        else:
            # Show only public events for anonymous users
            return Event.objects.filter(is_public=True)
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete events."""
    
    serializer_class = EventSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Event.objects.filter(
                Q(organizer=user) | Q(is_public=True)
            ).distinct()
        else:
            return Event.objects.filter(is_public=True)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EventUpdateSerializer
        return EventSerializer


class EventRegistrationListView(generics.ListCreateAPIView):
    """List and create event registrations."""
    
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        
        # Only show registrations to event organizer or the registrant
        if event.organizer == self.request.user:
            return EventRegistration.objects.filter(event=event)
        else:
            return EventRegistration.objects.filter(
                event=event, 
                attendee=self.request.user
            )
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        
        # Check if event allows registration
        if not event.allow_registration:
            raise serializers.ValidationError("This event does not allow registration")
        
        # Check if event is full
        if event.is_full:
            raise serializers.ValidationError("This event is at full capacity")
        
        # Check if registration deadline has passed
        if event.registration_deadline and timezone.now() > event.registration_deadline:
            raise serializers.ValidationError("Registration deadline has passed")
        
        serializer.save(event=event, attendee=self.request.user)


class EventRegistrationDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update event registrations."""
    
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        
        if event.organizer == self.request.user:
            return EventRegistration.objects.filter(event=event)
        else:
            return EventRegistration.objects.filter(
                event=event, 
                attendee=self.request.user
            )


class EventSurveyListView(generics.ListCreateAPIView):
    """List and create event surveys."""
    
    serializer_class = EventSurveySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id, organizer=self.request.user)
        return EventSurvey.objects.filter(event=event)
    
    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id, organizer=self.request.user)
        serializer.save(event=event)


class EventCategoryListView(generics.ListCreateAPIView):
    """List and create event categories."""
    
    serializer_class = EventCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EventCategory.objects.all()


class EventCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete event categories."""
    
    serializer_class = EventCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = EventCategory.objects.all()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def publish_event(request, event_id):
    """Publish an event."""
    event = get_object_or_404(Event, id=event_id, organizer=request.user)
    serializer = EventPublishSerializer(data=request.data, context={'event': event})
    
    if serializer.is_valid():
        status_value = serializer.validated_data['status']
        event.status = status_value
        
        if status_value == 'published':
            event.published_at = timezone.now()
        
        event.save()
        return Response(EventSerializer(event).data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def duplicate_event(request, event_id):
    """Duplicate an event."""
    event = get_object_or_404(Event, id=event_id, organizer=request.user)
    serializer = EventDuplicateSerializer(data=request.data)
    
    if serializer.is_valid():
        new_title = serializer.validated_data['new_title']
        include_registrations = serializer.validated_data['include_registrations']
        
        # Create new event
        new_event = Event.objects.create(
            title=new_title,
            description=event.description,
            organizer=request.user,
            event_type=event.event_type,
            venue=event.venue,
            address=event.address,
            city=event.city,
            country=event.country,
            is_virtual=event.is_virtual,
            virtual_meeting_url=event.virtual_meeting_url,
            start_date=event.start_date,
            end_date=event.end_date,
            registration_deadline=event.registration_deadline,
            max_attendees=event.max_attendees,
            is_free=event.is_free,
            ticket_price=event.ticket_price,
            currency=event.currency,
            allow_registration=event.allow_registration,
            require_approval=event.require_approval,
            is_public=event.is_public,
            banner_image=event.banner_image,
            logo=event.logo,
            status='draft'
        )
        
        # Copy event surveys
        for event_survey in event.surveys.all():
            EventSurvey.objects.create(
                event=new_event,
                survey=event_survey.survey,
                is_pre_event=event_survey.is_pre_event,
                is_post_event=event_survey.is_post_event,
                send_reminder=event_survey.send_reminder,
                reminder_days_before=event_survey.reminder_days_before,
                available_from=event_survey.available_from,
                available_until=event_survey.available_until
            )
        
        # Copy registrations if requested
        if include_registrations:
            for registration in event.registrations.all():
                EventRegistration.objects.create(
                    event=new_event,
                    attendee=registration.attendee,
                    status=registration.status,
                    dietary_restrictions=registration.dietary_restrictions,
                    special_requirements=registration.special_requirements,
                    emergency_contact=registration.emergency_contact,
                    payment_status=registration.payment_status,
                    payment_amount=registration.payment_amount,
                    notes=registration.notes
                )
        
        return Response(EventSerializer(new_event).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def event_stats(request, event_id):
    """Get event statistics."""
    event = get_object_or_404(Event, id=event_id, organizer=request.user)
    
    registrations = event.registrations.all()
    confirmed_registrations = registrations.filter(status='confirmed')
    
    stats = {
        'total_registrations': registrations.count(),
        'confirmed_registrations': confirmed_registrations.count(),
        'pending_registrations': registrations.filter(status='pending').count(),
        'cancelled_registrations': registrations.filter(status='cancelled').count(),
        'waitlist_registrations': registrations.filter(status='waitlist').count(),
        'capacity_utilization': (confirmed_registrations.count() / event.max_attendees * 100) if event.max_attendees else 0,
        'is_full': event.is_full,
        'days_until_event': (event.start_date - timezone.now()).days if event.start_date > timezone.now() else 0,
        'registration_trends': {
            'last_7_days': registrations.filter(
                registration_date__gte=timezone.now() - timezone.timedelta(days=7)
            ).count(),
            'last_30_days': registrations.filter(
                registration_date__gte=timezone.now() - timezone.timedelta(days=30)
            ).count(),
        }
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_events(request):
    """Get events organized by the current user."""
    events = Event.objects.filter(organizer=request.user).order_by('-created_at')
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_registrations(request):
    """Get events the current user is registered for."""
    registrations = EventRegistration.objects.filter(attendee=request.user).order_by('-registration_date')
    serializer = EventRegistrationSerializer(registrations, many=True)
    return Response(serializer.data) 