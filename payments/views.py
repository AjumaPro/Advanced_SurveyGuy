from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import SubscriptionPlan, Subscription, Payment, Invoice, PaymentMethod
from .serializers import (
    SubscriptionPlanSerializer, SubscriptionSerializer, SubscriptionCreateSerializer,
    PaymentSerializer, PaymentCreateSerializer, InvoiceSerializer,
    PaymentMethodSerializer, PaymentMethodCreateSerializer, SubscriptionCancelSerializer
)


class SubscriptionPlanListView(generics.ListAPIView):
    """List available subscription plans."""
    
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['plan_type', 'billing_cycle', 'is_active', 'is_featured']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True)


class SubscriptionPlanDetailView(generics.RetrieveAPIView):
    """Get subscription plan details."""
    
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]
    queryset = SubscriptionPlan.objects.filter(is_active=True)


class SubscriptionListView(generics.ListCreateAPIView):
    """List and create user subscriptions."""
    
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'plan__plan_type']
    ordering_fields = ['created_at', 'end_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SubscriptionCreateSerializer
        return SubscriptionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SubscriptionDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve and update subscription details."""
    
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_subscription(request, subscription_id):
    """Cancel a subscription."""
    subscription = get_object_or_404(Subscription, id=subscription_id, user=request.user)
    serializer = SubscriptionCancelSerializer(data=request.data)
    
    if serializer.is_valid():
        immediate = serializer.validated_data.get('immediate', False)
        reason = serializer.validated_data.get('reason', '')
        
        if immediate:
            subscription.status = 'cancelled'
        else:
            subscription.auto_renew = False
        
        subscription.save()
        
        return Response({
            'message': 'Subscription cancelled successfully',
            'subscription': SubscriptionSerializer(subscription).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentListView(generics.ListCreateAPIView):
    """List and create payments."""
    
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'provider']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PaymentCreateSerializer
        return PaymentSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentDetailView(generics.RetrieveAPIView):
    """Get payment details."""
    
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class InvoiceListView(generics.ListAPIView):
    """List user invoices."""
    
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'currency']
    ordering_fields = ['issue_date', 'due_date', 'total_amount']
    ordering = ['-issue_date']
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


class InvoiceDetailView(generics.RetrieveAPIView):
    """Get invoice details."""
    
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)


class PaymentMethodListView(generics.ListCreateAPIView):
    """List and create payment methods."""
    
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['payment_type', 'is_active', 'is_default']
    ordering_fields = ['created_at']
    ordering = ['-is_default', '-created_at']
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PaymentMethodCreateSerializer
        return PaymentMethodSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete payment methods."""
    
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def stripe_webhook(request):
    """Handle Stripe webhooks."""
    # This would contain Stripe webhook handling logic
    # For now, return a placeholder response
    return Response({'status': 'webhook received'}, status=status.HTTP_200_OK) 