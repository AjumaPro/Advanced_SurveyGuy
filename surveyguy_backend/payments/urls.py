from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'payments', views.PaymentsViewSet, basename='payments')
router.register(r'payment-methods', views.PaymentMethodViewSet, basename='paymentmethod')

urlpatterns = [
    path('', include(router.urls)),
] 