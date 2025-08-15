from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Event, EventRegistration, EventTemplate
from .serializers import (
    EventSerializer, 
    EventRegistrationSerializer, 
    EventTemplateSerializer,
    EventCreateSerializer,
    EventRegistrationCreateSerializer
)


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for Event model"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter events based on user role"""
        if self.request.user.role in ['admin', 'super_admin']:
            return Event.objects.all()
        return Event.objects.filter(created_by=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return EventCreateSerializer
        return EventSerializer
    
    def perform_create(self, serializer):
        """Set the created_by field to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an event"""
        event = self.get_object()
        new_event = Event.objects.create(
            created_by=request.user,
            title=f"{event.title} (Copy)",
            description=event.description,
            date=event.date,
            time=event.time,
            location=event.location,
            capacity=event.capacity,
            price=event.price,
            template=event.template
        )
        serializer = self.get_serializer(new_event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get event statistics"""
        user = request.user
        queryset = self.get_queryset()
        
        total_events = queryset.count()
        upcoming_events = queryset.filter(date__gte=timezone.now().date()).count()
        past_events = queryset.filter(date__lt=timezone.now().date()).count()
        total_registrations = EventRegistration.objects.filter(event__in=queryset).count()
        
        # Monthly statistics
        current_month = timezone.now().month
        monthly_events = queryset.filter(created_date__month=current_month).count()
        
        return Response({
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'past_events': past_events,
            'total_registrations': total_registrations,
            'monthly_events': monthly_events
        })


class EventRegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for EventRegistration model"""
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter registrations based on user role"""
        if self.request.user.role in ['admin', 'super_admin']:
            return EventRegistration.objects.all()
        return EventRegistration.objects.filter(event__created_by=self.request.user)
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return EventRegistrationCreateSerializer
        return EventRegistrationSerializer
    
    @action(detail=False, methods=['get'])
    def by_event(self, request):
        """Get registrations for a specific event"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({'error': 'event_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        registrations = self.get_queryset().filter(event_id=event_id)
        serializer = self.get_serializer(registrations, many=True)
        return Response(serializer.data)


class EventTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for EventTemplate model"""
    queryset = EventTemplate.objects.filter(is_public=True)
    serializer_class = EventTemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return public templates or user's own templates"""
        return EventTemplate.objects.filter(
            Q(is_public=True) | Q(created_by=self.request.user)
        )
    
    def perform_create(self, serializer):
        """Set the created_by field to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate an event template"""
        template = self.get_object()
        new_template = EventTemplate.objects.create(
            created_by=request.user,
            name=f"{template.name} (Copy)",
            description=template.description,
            category=template.category,
            template_data=template.template_data
        )
        serializer = self.get_serializer(new_template)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
