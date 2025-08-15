from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Template
from .serializers import TemplateSerializer, TemplateCreateSerializer


class TemplateViewSet(viewsets.ModelViewSet):
    """ViewSet for Template model"""
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter templates based on type and visibility"""
        template_type = self.request.query_params.get('type', None)
        category = self.request.query_params.get('category', None)
        
        queryset = Template.objects.filter(
            Q(is_public=True) | Q(created_by=self.request.user)
        )
        
        if template_type:
            queryset = queryset.filter(type=template_type)
        
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'create':
            return TemplateCreateSerializer
        return TemplateSerializer
    
    def perform_create(self, serializer):
        """Set the created_by field to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplicate a template"""
        template = self.get_object()
        new_template = Template.objects.create(
            created_by=request.user,
            template_id=f"{template.template_id}_copy_{timezone.now().timestamp()}",
            name=f"{template.name} (Copy)",
            category=template.category,
            description=template.description,
            icon=template.icon,
            type=template.type,
            template_data=template.template_data,
            questions=template.questions,
            estimated_time=template.estimated_time,
            target_audience=template.target_audience,
            use_cases=template.use_cases,
            insights=template.insights,
            is_public=False
        )
        serializer = self.get_serializer(new_template)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def events(self, request):
        """Get event templates specifically"""
        event_templates = self.get_queryset().filter(type='event')
        serializer = self.get_serializer(event_templates, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def surveys(self, request):
        """Get survey templates specifically"""
        survey_templates = self.get_queryset().filter(type='survey')
        serializer = self.get_serializer(survey_templates, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get available template categories"""
        categories = Template.objects.values_list('category', flat=True).distinct()
        return Response(list(categories))
