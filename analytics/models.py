from django.db import models
from django.conf import settings
from django.utils import timezone
from surveys.models import Survey, SurveyResponse, QuestionResponse
import json


class SurveyAnalytics(models.Model):
    """Analytics data for surveys."""
    
    survey = models.OneToOneField(Survey, on_delete=models.CASCADE, related_name='analytics')
    
    # Response metrics
    total_responses = models.PositiveIntegerField(default=0)
    completed_responses = models.PositiveIntegerField(default=0)
    abandoned_responses = models.PositiveIntegerField(default=0)
    
    # Time metrics
    average_completion_time = models.FloatField(default=0)  # in seconds
    median_completion_time = models.FloatField(default=0)
    
    # Engagement metrics
    unique_visitors = models.PositiveIntegerField(default=0)
    return_visitors = models.PositiveIntegerField(default=0)
    
    # Device metrics
    desktop_responses = models.PositiveIntegerField(default=0)
    mobile_responses = models.PositiveIntegerField(default=0)
    tablet_responses = models.PositiveIntegerField(default=0)
    
    # Last updated
    last_calculated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytics for {self.survey.title}"
    
    def calculate_metrics(self):
        """Calculate all analytics metrics."""
        responses = self.survey.responses.all()
        
        # Basic counts
        self.total_responses = responses.count()
        self.completed_responses = responses.filter(is_complete=True).count()
        self.abandoned_responses = self.total_responses - self.completed_responses
        
        # Time calculations
        completion_times = [r.completion_time for r in responses.filter(is_complete=True) if r.completion_time > 0]
        if completion_times:
            self.average_completion_time = sum(completion_times) / len(completion_times)
            completion_times.sort()
            self.median_completion_time = completion_times[len(completion_times) // 2]
        
        # Device calculations (simplified)
        self.desktop_responses = responses.count()  # Placeholder
        self.mobile_responses = 0  # Placeholder
        self.tablet_responses = 0  # Placeholder
        
        self.save()


class QuestionAnalytics(models.Model):
    """Analytics data for individual questions."""
    
    question = models.OneToOneField('surveys.Question', on_delete=models.CASCADE, related_name='analytics')
    
    # Response counts
    total_responses = models.PositiveIntegerField(default=0)
    skipped_responses = models.PositiveIntegerField(default=0)
    
    # For multiple choice questions
    option_counts = models.JSONField(default=dict)
    
    # For rating questions
    average_rating = models.FloatField(default=0)
    rating_distribution = models.JSONField(default=dict)
    
    # For text questions
    average_text_length = models.FloatField(default=0)
    common_words = models.JSONField(default=list)
    
    # Last updated
    last_calculated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Analytics for {self.question.text[:50]}"
    
    def calculate_metrics(self):
        """Calculate analytics for this question."""
        responses = QuestionResponse.objects.filter(question=self.question)
        self.total_responses = responses.count()
        
        if self.question.question_type in ['multiple_choice', 'checkbox']:
            self._calculate_choice_metrics(responses)
        elif self.question.question_type in ['rating', 'emoji_scale', 'likert']:
            self._calculate_rating_metrics(responses)
        elif self.question.question_type in ['text', 'textarea']:
            self._calculate_text_metrics(responses)
        
        self.save()
    
    def _calculate_choice_metrics(self, responses):
        """Calculate metrics for choice-based questions."""
        option_counts = {}
        for response in responses:
            answer = response.answer
            if isinstance(answer, list):
                for option in answer:
                    option_counts[option] = option_counts.get(option, 0) + 1
            else:
                option_counts[answer] = option_counts.get(answer, 0) + 1
        
        self.option_counts = option_counts
    
    def _calculate_rating_metrics(self, responses):
        """Calculate metrics for rating questions."""
        ratings = []
        for response in responses:
            rating = response.answer
            if isinstance(rating, (int, float)):
                ratings.append(rating)
        
        if ratings:
            self.average_rating = sum(ratings) / len(ratings)
            
            # Calculate distribution
            distribution = {}
            for rating in ratings:
                distribution[str(rating)] = distribution.get(str(rating), 0) + 1
            self.rating_distribution = distribution
    
    def _calculate_text_metrics(self, responses):
        """Calculate metrics for text questions."""
        text_lengths = []
        all_words = []
        
        for response in responses:
            text = response.answer
            if isinstance(text, str):
                text_lengths.append(len(text))
                words = text.lower().split()
                all_words.extend(words)
        
        if text_lengths:
            self.average_text_length = sum(text_lengths) / len(text_lengths)
        
        # Calculate common words (simplified)
        word_counts = {}
        for word in all_words:
            if len(word) > 3:  # Skip short words
                word_counts[word] = word_counts.get(word, 0) + 1
        
        # Get top 10 words
        sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        self.common_words = [word for word, count in sorted_words[:10]]


class ResponseExport(models.Model):
    """Model for tracking survey response exports."""
    
    EXPORT_FORMATS = (
        ('csv', 'CSV'),
        ('xlsx', 'Excel'),
        ('pdf', 'PDF'),
        ('json', 'JSON'),
    )
    
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name='exports')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    export_format = models.CharField(max_length=10, choices=EXPORT_FORMATS)
    file_path = models.CharField(max_length=500, blank=True, null=True)
    
    # Export settings
    include_metadata = models.BooleanField(default=True)
    anonymize_responses = models.BooleanField(default=False)
    date_range_start = models.DateTimeField(blank=True, null=True)
    date_range_end = models.DateTimeField(blank=True, null=True)
    
    # Status
    is_completed = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.survey.title} - {self.export_format} export"


class DashboardMetrics(models.Model):
    """Dashboard metrics for users."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dashboard_metrics')
    
    # Survey metrics
    total_surveys = models.PositiveIntegerField(default=0)
    active_surveys = models.PositiveIntegerField(default=0)
    total_responses = models.PositiveIntegerField(default=0)
    
    # Response metrics
    responses_today = models.PositiveIntegerField(default=0)
    responses_this_week = models.PositiveIntegerField(default=0)
    responses_this_month = models.PositiveIntegerField(default=0)
    
    # Engagement metrics
    average_completion_rate = models.FloatField(default=0)
    average_response_time = models.FloatField(default=0)
    
    # Last updated
    last_calculated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user']
    
    def __str__(self):
        return f"Dashboard metrics for {self.user.email}"
    
    def calculate_metrics(self):
        """Calculate dashboard metrics for the user."""
        surveys = self.user.surveys.all()
        
        self.total_surveys = surveys.count()
        self.active_surveys = surveys.filter(status='published').count()
        
        # Calculate total responses
        total_responses = 0
        for survey in surveys:
            total_responses += survey.responses.count()
        self.total_responses = total_responses
        
        # Calculate time-based responses
        now = timezone.now()
        today = now.date()
        week_ago = now - timezone.timedelta(days=7)
        month_ago = now - timezone.timedelta(days=30)
        
        self.responses_today = self._count_responses_in_period(surveys, today, today)
        self.responses_this_week = self._count_responses_in_period(surveys, week_ago, now)
        self.responses_this_month = self._count_responses_in_period(surveys, month_ago, now)
        
        # Calculate averages
        completion_rates = []
        response_times = []
        
        for survey in surveys:
            if survey.responses.count() > 0:
                completion_rate = (survey.responses.filter(is_complete=True).count() / survey.responses.count()) * 100
                completion_rates.append(completion_rate)
                
                avg_time = survey.responses.filter(is_complete=True).aggregate(
                    avg_time=models.Avg('time_spent')
                )['avg_time'] or 0
                response_times.append(avg_time)
        
        if completion_rates:
            self.average_completion_rate = sum(completion_rates) / len(completion_rates)
        
        if response_times:
            self.average_response_time = sum(response_times) / len(response_times)
        
        self.save()
    
    def _count_responses_in_period(self, surveys, start_date, end_date):
        """Count responses in a given time period."""
        count = 0
        for survey in surveys:
            count += survey.responses.filter(
                started_at__gte=start_date,
                started_at__lte=end_date
            ).count()
        return count 