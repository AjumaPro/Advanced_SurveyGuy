from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, AccountApproval, PaymentSubscription, PaymentIntent, AdminAuditLog, SubscriptionPackage


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_approved', 'super_admin', 'is_active', 'date_joined')
    list_filter = ('role', 'is_approved', 'super_admin', 'is_active', 'subscription_plan', 'subscription_status')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'role', 'super_admin', 'is_approved')}),
        ('Subscription', {'fields': ('subscription_plan', 'subscription_status')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role', 'is_approved'),
        }),
    )


@admin.register(AccountApproval)
class AccountApprovalAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'admin', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    ordering = ('-created_at',)


@admin.register(PaymentSubscription)
class PaymentSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_name', 'amount', 'currency', 'interval', 'status', 'created_at')
    list_filter = ('status', 'interval', 'currency', 'created_at')
    search_fields = ('user__email', 'plan_name')
    ordering = ('-created_at',)


@admin.register(PaymentIntent)
class PaymentIntentAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_name', 'amount', 'currency', 'reference', 'status', 'created_at')
    list_filter = ('status', 'currency', 'created_at')
    search_fields = ('user__email', 'reference', 'plan_name')
    ordering = ('-created_at',)


@admin.register(AdminAuditLog)
class AdminAuditLogAdmin(admin.ModelAdmin):
    list_display = ('admin', 'action', 'target_type', 'target_id', 'ip_address', 'created_at')
    list_filter = ('action', 'target_type', 'created_at')
    search_fields = ('admin__email', 'action', 'target_type')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)


@admin.register(SubscriptionPackage)
class SubscriptionPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'currency', 'interval', 'max_surveys', 'max_responses_per_survey', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'interval', 'currency')
    search_fields = ('name', 'description')
    ordering = ('sort_order', 'price')
