from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta
import requests
import json

from .models import BillingHistory, PaymentMethod
from auth_app.models import PaymentIntent, PaymentSubscription
from .serializers import BillingHistorySerializer, PaymentMethodSerializer


class PaymentsViewSet(viewsets.ViewSet):
    """ViewSet for Payments"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """Get payment history for the authenticated user"""
        payments = BillingHistory.objects.filter(user=request.user).order_by('-billing_date')
        
        # Serialize payments
        payment_data = []
        for payment in payments:
            payment_data.append({
                'id': payment.id,
                'plan_id': payment.plan_id,
                'plan_name': payment.plan_name,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'status': payment.status,
                'payment_reference': payment.payment_reference,
                'payment_method': payment.payment_method,
                'description': payment.description,
                'billing_date': payment.billing_date.isoformat(),
                'due_date': payment.due_date.isoformat() if payment.due_date else None,
                'paid_date': payment.paid_date.isoformat() if payment.paid_date else None
            })
        
        return Response(payment_data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get payment summary for user"""
        user = request.user
        
        # Get payment statistics
        total_paid = BillingHistory.objects.filter(
            user=user, 
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        pending_amount = BillingHistory.objects.filter(
            user=user, 
            status='pending'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        recent_payments = BillingHistory.objects.filter(
            user=user,
            billing_date__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        total_transactions = BillingHistory.objects.filter(user=user).count()
        
        return Response({
            'total_paid': float(total_paid),
            'pending_amount': float(pending_amount),
            'recent_payments': recent_payments,
            'total_transactions': total_transactions
        })
    
    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        """Create a payment intent"""
        try:
            data = request.data
            plan_id = data.get('plan_id')
            plan_name = data.get('plan_name')
            amount = data.get('amount')
            currency = data.get('currency', 'GHS')
            
            # Create payment intent
            payment_intent = PaymentIntent.objects.create(
                user=request.user,
                plan_id=plan_id,
                plan_name=plan_name,
                amount=amount,
                currency=currency,
                reference=f"pay_{timezone.now().timestamp()}_{request.user.id}",
                status='pending'
            )
            
            return Response({
                'payment_intent_id': payment_intent.id,
                'reference': payment_intent.reference,
                'amount': float(payment_intent.amount),
                'currency': payment_intent.currency
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Failed to create payment intent',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify payment with Paystack"""
        try:
            reference = request.data.get('reference')
            
            # Verify with Paystack (mock implementation)
            # In production, this would call the actual Paystack API
            payment_verified = True  # Mock verification
            
            if payment_verified:
                # Update payment intent
                payment_intent = PaymentIntent.objects.get(
                    reference=reference,
                    user=request.user
                )
                payment_intent.status = 'completed'
                payment_intent.payment_transaction_id = f"txn_{reference}"
                payment_intent.save()
                
                # Create subscription
                PaymentSubscription.objects.create(
                    user=request.user,
                    plan_id=payment_intent.plan_id,
                    plan_name=payment_intent.plan_name,
                    amount=payment_intent.amount,
                    currency=payment_intent.currency,
                    interval='monthly',
                    status='active',
                    payment_transaction_id=payment_intent.payment_transaction_id
                )
                
                # Create billing history
                BillingHistory.objects.create(
                    user=request.user,
                    plan_id=payment_intent.plan_id,
                    plan_name=payment_intent.plan_name,
                    amount=payment_intent.amount,
                    currency=payment_intent.currency,
                    status='completed',
                    payment_reference=reference,
                    payment_method='paystack',
                    description=f"Payment for {payment_intent.plan_name}",
                    paid_date=timezone.now()
                )
                
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully'
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Payment verification failed'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': 'Failed to verify payment',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def currencies(self, request):
        """Get supported currencies"""
        currencies = {
            'GHS': {
                'symbol': 'GH¢',
                'name': 'Ghanaian Cedi',
                'exchangeRate': 1,
                'decimalPlaces': 2
            },
            'USD': {
                'symbol': '$',
                'name': 'US Dollar',
                'exchangeRate': 0.12,
                'decimalPlaces': 2
            },
            'EUR': {
                'symbol': '€',
                'name': 'Euro',
                'exchangeRate': 0.11,
                'decimalPlaces': 2
            },
            'GBP': {
                'symbol': '£',
                'name': 'British Pound',
                'exchangeRate': 0.095,
                'decimalPlaces': 2
            },
            'NGN': {
                'symbol': '₦',
                'name': 'Nigerian Naira',
                'exchangeRate': 150,
                'decimalPlaces': 2
            },
            'KES': {
                'symbol': 'KSh',
                'name': 'Kenyan Shilling',
                'exchangeRate': 18,
                'decimalPlaces': 2
            },
            'ZAR': {
                'symbol': 'R',
                'name': 'South African Rand',
                'exchangeRate': 2.2,
                'decimalPlaces': 2
            }
        }
        
        return Response(currencies)


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """ViewSet for PaymentMethod model"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter payment methods for current user"""
        return PaymentMethod.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        """Set the user and handle default payment method"""
        # If this is the first payment method, make it default
        if not self.get_queryset().exists():
            serializer.save(user=self.request.user, is_default=True)
        else:
            serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set a payment method as default"""
        payment_method = self.get_object()
        
        # Remove default from other payment methods
        self.get_queryset().update(is_default=False)
        
        # Set this one as default
        payment_method.is_default = True
        payment_method.save()
        
        serializer = self.get_serializer(payment_method)
        return Response(serializer.data)
