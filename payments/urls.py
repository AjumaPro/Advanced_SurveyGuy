from django.urls import path
from . import views

urlpatterns = [
    # Subscription plans
    path('plans/', views.SubscriptionPlanListView.as_view(), name='plan_list'),
    path('plans/<int:pk>/', views.SubscriptionPlanDetailView.as_view(), name='plan_detail'),
    
    # Subscriptions
    path('subscriptions/', views.SubscriptionListView.as_view(), name='subscription_list'),
    path('subscriptions/<int:pk>/', views.SubscriptionDetailView.as_view(), name='subscription_detail'),
    path('subscriptions/<int:pk>/cancel/', views.cancel_subscription, name='cancel_subscription'),
    
    # Payments
    path('payments/', views.PaymentListView.as_view(), name='payment_list'),
    path('payments/<uuid:pk>/', views.PaymentDetailView.as_view(), name='payment_detail'),
    
    # Invoices
    path('invoices/', views.InvoiceListView.as_view(), name='invoice_list'),
    path('invoices/<uuid:pk>/', views.InvoiceDetailView.as_view(), name='invoice_detail'),
    
    # Payment methods
    path('payment-methods/', views.PaymentMethodListView.as_view(), name='payment_method_list'),
    path('payment-methods/<int:pk>/', views.PaymentMethodDetailView.as_view(), name='payment_method_detail'),
    
    # Webhooks
    path('webhooks/stripe/', views.stripe_webhook, name='stripe_webhook'),
] 