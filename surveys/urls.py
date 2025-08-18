from django.urls import path
from . import views

urlpatterns = [
    # Survey management
    path('', views.SurveyListView.as_view(), name='survey_list'),
    path('<uuid:pk>/', views.SurveyDetailView.as_view(), name='survey_detail'),
    path('<uuid:pk>/with-questions/', views.SurveyWithQuestionsView.as_view(), name='survey_with_questions'),
    path('<uuid:survey_id>/publish/', views.publish_survey, name='publish_survey'),
    path('<uuid:survey_id>/duplicate/', views.duplicate_survey, name='duplicate_survey'),
    path('<uuid:survey_id>/stats/', views.survey_stats, name='survey_stats'),
    
    # Questions
    path('<uuid:survey_id>/questions/', views.QuestionListView.as_view(), name='question_list'),
    path('questions/<int:pk>/', views.QuestionDetailView.as_view(), name='question_detail'),
    path('questions/<int:question_id>/options/', views.QuestionOptionListView.as_view(), name='question_option_list'),
    
    # Survey responses
    path('<uuid:survey_id>/responses/', views.SurveyResponseListView.as_view(), name='survey_response_list'),
    path('<uuid:survey_id>/responses/<int:pk>/', views.SurveyResponseDetailView.as_view(), name='survey_response_detail'),
    path('responses/<int:response_id>/question-responses/', views.QuestionResponseListView.as_view(), name='question_response_list'),
    
    # Templates
    path('templates/', views.SurveyTemplateListView.as_view(), name='template_list'),
    path('templates/<int:pk>/', views.SurveyTemplateDetailView.as_view(), name='template_detail'),
    path('templates/<int:template_id>/use/', views.use_template, name='use_template'),
] 