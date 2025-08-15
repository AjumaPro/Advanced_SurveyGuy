from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from django.contrib.auth import get_user_model

from .models import AdminDashboard, AdminAccount, AdminPackage, AdminPayment
from .serializers import (
    AdminDashboardSerializer, 
    AdminAccountSerializer, 
    AdminPackageSerializer,
    AdminPaymentSerializer
)
from auth_app.models import CustomUser, AccountApproval, PaymentSubscription, AdminAuditLog

User = get_user_model()


class AdminViewSet(viewsets.ViewSet):
    """ViewSet for Admin functionality"""
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get admin overview"""
        # Get overall statistics
        stats = User.objects.aggregate(
            total_users=Count('id'),
            admin_users=Count('id', filter=Q(role='admin')),
            super_admin_users=Count('id', filter=Q(role='super_admin'))
        )
        
        # Get recent activity
        recent_activity = User.objects.values(
            'email', 'created_at'
        ).order_by('-created_at')[:10]
        
        # Add activity type
        for activity in recent_activity:
            activity['type'] = 'user_registered'
            activity['title'] = activity['email']
            activity['time'] = activity['created_at']
        
        return Response({
            'stats': stats,
            'recentActivity': list(recent_activity)
        })
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get admin dashboard stats"""
        # Get pending approvals count
        pending_accounts = AccountApproval.objects.filter(status='pending').count()
        pending_payments = PaymentSubscription.objects.filter(status='pending').count()
        
        # Get total users count
        total_users = User.objects.count()
        
        # Get total revenue
        total_revenue = PaymentSubscription.objects.filter(
            status='active'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Get recent admin actions
        recent_actions = AdminAuditLog.objects.select_related('admin').values(
            'action', 'target_type', 'target_id', 'details', 'created_at',
            'admin__email'
        ).order_by('-created_at')[:10]
        
        return Response({
            'stats': {
                'pendingAccounts': pending_accounts,
                'pendingPayments': pending_payments,
                'totalUsers': total_users,
                'totalRevenue': float(total_revenue)
            },
            'recentActions': list(recent_actions)
        })
    
    @action(detail=False, methods=['get'])
    def users(self, request):
        """Get all users for admin management"""
        users = User.objects.values(
            'id', 'email', 'first_name', 'last_name', 'role', 
            'subscription_plan', 'subscription_status', 'is_approved',
            'created_at', 'last_login'
        ).order_by('-created_at')
        
        return Response(list(users))
    
    @action(detail=True, methods=['post'])
    def approve_user(self, request, pk=None):
        """Approve a user account"""
        try:
            user = User.objects.get(id=pk)
            user.is_approved = True
            user.approved_by = request.user
            user.approved_at = timezone.now()
            user.save()
            
            # Update account approval record
            AccountApproval.objects.filter(user=user).update(
                status='approved',
                admin=request.user,
                approved_at=timezone.now()
            )
            
            # Log admin action
            AdminAuditLog.objects.create(
                admin=request.user,
                action='approve_user',
                target_type='user',
                target_id=user.id,
                details={'user_email': user.email}
            )
            
            return Response({
                'success': True,
                'message': f'User {user.email} approved successfully'
            })
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': 'Failed to approve user',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def reject_user(self, request, pk=None):
        """Reject a user account"""
        try:
            user = User.objects.get(id=pk)
            rejection_reason = request.data.get('reason', '')
            
            user.is_approved = False
            user.save()
            
            # Update account approval record
            AccountApproval.objects.filter(user=user).update(
                status='rejected',
                admin=request.user,
                rejection_reason=rejection_reason
            )
            
            # Log admin action
            AdminAuditLog.objects.create(
                admin=request.user,
                action='reject_user',
                target_type='user',
                target_id=user.id,
                details={
                    'user_email': user.email,
                    'reason': rejection_reason
                }
            )
            
            return Response({
                'success': True,
                'message': f'User {user.email} rejected'
            })
            
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': 'Failed to reject user',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        """Get pending account approvals"""
        pending_approvals = AccountApproval.objects.filter(
            status='pending'
        ).select_related('user').values(
            'id', 'user__email', 'user__first_name', 'user__last_name',
            'user__created_at', 'created_at'
        ).order_by('-created_at')
        
        return Response(list(pending_approvals))
    
    @action(detail=False, methods=['get'])
    def audit_log(self, request):
        """Get admin audit log"""
        audit_logs = AdminAuditLog.objects.select_related('admin').values(
            'id', 'admin__email', 'action', 'target_type', 'target_id',
            'details', 'ip_address', 'user_agent', 'created_at'
        ).order_by('-created_at')
        
        return Response(list(audit_logs))


class AdminDashboardViewSet(viewsets.ModelViewSet):
    """ViewSet for AdminDashboard model"""
    queryset = AdminDashboard.objects.all()
    serializer_class = AdminDashboardSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get admin dashboard statistics"""
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        pending_approvals = User.objects.filter(is_approved=False).count()
        
        # Survey statistics
        from surveys.models import Survey
        total_surveys = Survey.objects.count()
        published_surveys = Survey.objects.filter(status='published').count()
        
        # Event statistics
        from events.models import Event
        total_events = Event.objects.count()
        upcoming_events = Event.objects.filter(date__gte=timezone.now().date()).count()
        
        # Revenue statistics
        total_revenue = PaymentSubscription.objects.filter(
            status='active'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        active_subscriptions = PaymentSubscription.objects.filter(
            status='active'
        ).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'pending_approvals': pending_approvals,
            'total_surveys': total_surveys,
            'published_surveys': published_surveys,
            'total_events': total_events,
            'upcoming_events': upcoming_events,
            'total_revenue': float(total_revenue),
            'active_subscriptions': active_subscriptions
        })


class AdminAccountViewSet(viewsets.ModelViewSet):
    """ViewSet for AdminAccount model"""
    queryset = AdminAccount.objects.all()
    serializer_class = AdminAccountSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an admin account"""
        admin_account = self.get_object()
        admin_account.status = 'active'
        admin_account.save()
        
        # Also approve the user
        user = admin_account.user
        user.is_approved = True
        user.approved_by = request.user
        user.approved_at = timezone.now()
        user.save()
        
        serializer = self.get_serializer(admin_account)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend an admin account"""
        admin_account = self.get_object()
        admin_account.status = 'suspended'
        admin_account.save()
        
        serializer = self.get_serializer(admin_account)
        return Response(serializer.data)


class AdminPackageViewSet(viewsets.ModelViewSet):
    """ViewSet for AdminPackage model"""
    queryset = AdminPackage.objects.all()
    serializer_class = AdminPackageSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        """Set the created_by field to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a package"""
        package = self.get_object()
        package.status = 'active'
        package.save()
        
        serializer = self.get_serializer(package)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a package"""
        package = self.get_object()
        package.status = 'inactive'
        package.save()
        
        serializer = self.get_serializer(package)
        return Response(serializer.data)


class AdminPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for AdminPayment model"""
    queryset = AdminPayment.objects.all()
    serializer_class = AdminPaymentSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get payment summary for admin"""
        total_payments = self.get_queryset().count()
        completed_payments = self.get_queryset().filter(status='completed').count()
        pending_payments = self.get_queryset().filter(status='pending').count()
        
        total_revenue = self.get_queryset().filter(
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        return Response({
            'total_payments': total_payments,
            'completed_payments': completed_payments,
            'pending_payments': pending_payments,
            'total_revenue': float(total_revenue)
        })
