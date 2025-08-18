from django.urls import path
from . import views

urlpatterns = [
    # Templates
    path('', views.SurveyTemplateListView.as_view(), name='template_list'),
    path('<int:pk>/', views.SurveyTemplateDetailView.as_view(), name='template_detail'),
    path('<int:pk>/use/', views.use_template, name='use_template'),
    path('<int:pk>/rate/', views.rate_template, name='rate_template'),
    path('<int:pk>/share/', views.share_template, name='share_template'),
    
    # Categories
    path('categories/', views.TemplateCategoryListView.as_view(), name='category_list'),
    path('categories/<int:pk>/', views.TemplateCategoryDetailView.as_view(), name='category_detail'),
    
    # Collections
    path('collections/', views.TemplateCollectionListView.as_view(), name='collection_list'),
    path('collections/<int:pk>/', views.TemplateCollectionDetailView.as_view(), name='collection_detail'),
    
    # User templates
    path('my-templates/', views.my_templates, name='my_templates'),
    path('shared-with-me/', views.shared_templates, name='shared_templates'),
] 