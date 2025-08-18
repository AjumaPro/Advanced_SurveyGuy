from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return JsonResponse({
        'status': 'OK',
        'timestamp': timezone.now().isoformat(),
        'version': '1.0.0',
        'environment': 'django',
        'framework': 'Django 4.2.7'
    }) 