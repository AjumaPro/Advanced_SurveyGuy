from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import login, logout, authenticate
from django.db.models import Count, Q
from datetime import datetime, timedelta
import os

from accounts.models import User, UserActivity
from surveys.models import Survey, SurveyResponse
from events.models import Event
from analytics.models import SurveyAnalytics, DashboardMetrics


def landing_page(request):
    """Redirect to React frontend landing page."""
    return redirect('http://localhost:3002/')


def login_view(request):
    """Redirect to React frontend login page."""
    return redirect('http://localhost:3002/login')


def register_view(request):
    """Redirect to React frontend register page."""
    return redirect('http://localhost:3002/register')


def logout_view(request):
    """Handle logout and redirect to React frontend."""
    if request.user.is_authenticated:
        # Log activity
        UserActivity.objects.create(
            user=request.user,
            activity_type='logout',
            description=f'User logged out from {request.META.get("REMOTE_ADDR", "unknown")}'
        )
        logout(request)
    
    return redirect('http://localhost:3002/')


def dashboard_view(request):
    """Redirect to React frontend dashboard."""
    return redirect('http://localhost:3002/app/dashboard')


def survey_builder_view(request, survey_id=None):
    """Redirect to React frontend survey builder."""
    if survey_id:
        return redirect(f'http://localhost:3002/app/survey-builder/{survey_id}')
    return redirect('http://localhost:3002/app/survey-builder')


def surveys_list_view(request):
    """Redirect to React frontend surveys list."""
    return redirect('http://localhost:3002/app/surveys')


def survey_detail_view(request, survey_id):
    """Redirect to React frontend survey detail."""
    return redirect(f'http://localhost:3002/app/surveys/{survey_id}')


def survey_analytics_view(request, survey_id):
    """Redirect to React frontend survey analytics."""
    return redirect(f'http://localhost:3002/app/surveys/{survey_id}/analytics')


def template_library_view(request):
    """Redirect to React frontend template library."""
    return redirect('http://localhost:3002/app/templates')


def event_management_view(request):
    """Redirect to React frontend event management."""
    return redirect('http://localhost:3002/app/events')


def profile_view(request):
    """Redirect to React frontend profile."""
    return redirect('http://localhost:3002/app/profile')


def billing_view(request):
    """Redirect to React frontend billing."""
    return redirect('http://localhost:3002/app/billing')


def survey_preview_view(request, survey_id):
    """Redirect to React frontend survey preview."""
    return redirect(f'http://localhost:3002/app/surveys/{survey_id}/preview')


def survey_response_view(request, survey_id):
    """Redirect to React frontend survey response."""
    return redirect(f'http://localhost:3002/app/surveys/{survey_id}/response')


def pricing_view(request):
    """Redirect to React frontend pricing page."""
    return redirect('http://localhost:3002/pricing')


def subscriptions_view(request):
    """Redirect to React frontend subscriptions."""
    return redirect('http://localhost:3002/app/subscriptions')


def team_view(request):
    """Redirect to React frontend team management."""
    return redirect('http://localhost:3002/app/team')


# API endpoints for AJAX requests
@csrf_exempt
@require_http_methods(["POST"])
def add_question_api(request):
    """API endpoint to add a question to a survey."""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    try:
        survey_id = request.POST.get('survey_id')
        question_text = request.POST.get('text')
        question_type = request.POST.get('question_type')
        is_required = request.POST.get('is_required') == 'on'
        options = request.POST.getlist('options[]')
        
        survey = get_object_or_404(Survey, id=survey_id, creator=request.user)
        
        from surveys.models import Question
        question = Question.objects.create(
            survey=survey,
            text=question_text,
            question_type=question_type,
            is_required=is_required,
            order=survey.questions.count() + 1
        )
        
        # Add options if it's a multiple choice or checkbox question
        if options and question_type in ['multiple_choice', 'checkbox']:
            from surveys.models import QuestionOption
            for i, option_text in enumerate(options):
                if option_text.strip():
                    QuestionOption.objects.create(
                        question=question,
                        text=option_text.strip(),
                        order=i + 1
                    )
        
        return JsonResponse({
            'success': True,
            'question_id': question.id,
            'message': 'Question added successfully'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_question_api(request, question_id):
    """API endpoint to delete a question."""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    
    try:
        from surveys.models import Question
        question = get_object_or_404(Question, id=question_id, survey__creator=request.user)
        question.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Question deleted successfully'
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)