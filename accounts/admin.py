from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile, UserActivity, PasswordReset


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model."""
    
    list_display = ['email', 'username', 'first_name', 'last_name', 'user_type', 
                   'is_approved', 'is_active', 'created_at']
    list_filter = ['user_type', 'is_approved', 'is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'last_name', 'phone', 
                                     'company', 'position', 'profile_picture')}),
        ('Permissions', {'fields': ('user_type', 'is_approved', 'is_active', 'is_staff', 
                                   'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin for UserProfile model."""
    
    list_display = ['user', 'location', 'date_of_birth']
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    list_filter = ['date_of_birth']


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """Admin for UserActivity model."""
    
    list_display = ['user', 'activity_type', 'ip_address', 'created_at']
    list_filter = ['activity_type', 'created_at']
    search_fields = ['user__email', 'description']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(PasswordReset)
class PasswordResetAdmin(admin.ModelAdmin):
    """Admin for PasswordReset model."""
    
    list_display = ['user', 'is_used', 'is_expired', 'created_at', 'expires_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email']
    readonly_fields = ['created_at']
    ordering = ['-created_at'] 