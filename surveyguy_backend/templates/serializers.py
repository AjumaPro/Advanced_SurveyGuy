from rest_framework import serializers
from .models import Template


class TemplateSerializer(serializers.ModelSerializer):
    """Serializer for Template model"""
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Template
        fields = [
            'id', 'template_id', 'name', 'category', 'description', 'icon',
            'type', 'template_data', 'questions', 'estimated_time',
            'response_count', 'target_audience', 'use_cases', 'insights',
            'is_public', 'is_featured', 'created_at', 'updated_at',
            'created_by', 'created_by_email'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']


class TemplateCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating templates"""
    
    class Meta:
        model = Template
        fields = [
            'template_id', 'name', 'category', 'description', 'icon',
            'type', 'template_data', 'questions', 'estimated_time',
            'target_audience', 'use_cases', 'insights', 'is_public',
            'is_featured'
        ] 