from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'surveys', views.SurveyViewSet, basename='survey')
router.register(r'questions', views.QuestionViewSet, basename='question')
router.register(r'responses', views.ResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
] 