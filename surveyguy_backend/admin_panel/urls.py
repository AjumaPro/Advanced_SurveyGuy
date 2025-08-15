from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin', views.AdminViewSet, basename='admin')
router.register(r'dashboard', views.AdminDashboardViewSet, basename='admindashboard')
router.register(r'accounts', views.AdminAccountViewSet, basename='adminaccount')
router.register(r'packages', views.AdminPackageViewSet, basename='adminpackage')
router.register(r'payments', views.AdminPaymentViewSet, basename='adminpayment')

urlpatterns = [
    path('', include(router.urls)),
] 