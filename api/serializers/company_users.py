"""
Serializers for Company User Management
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import UserProfile


class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users"""
    role = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    created_by_company_user_id = serializers.SerializerMethodField()
    created_by_company_user_name = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'is_active',
            'date_joined',
            'last_login',
            'role',
            'company_name',
            'phone_number',
            'bio',
            'location',
            'created_by_company_user_id',
            'created_by_company_user_name',
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']
    
    def get_full_name(self, obj):
        """Get full name from first_name and last_name"""
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return obj.username
    
    def get_role(self, obj):
        """Get role from profile"""
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.role
        return None
    
    def get_company_name(self, obj):
        """Get company name from profile"""
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.company_name
        return None
    
    def get_phone_number(self, obj):
        """Get phone number from profile"""
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.phone_number
        return None
    
    def get_bio(self, obj):
        """Get bio from profile"""
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.bio
        return None
    
    def get_location(self, obj):
        """Get location from profile"""
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.location
        return None
    
    def get_created_by_company_user_id(self, obj):
        """Get created by company user ID"""
        if hasattr(obj, 'profile') and obj.profile and obj.profile.created_by_company_user:
            return obj.profile.created_by_company_user.id
        return None
    
    def get_created_by_company_user_name(self, obj):
        """Get created by company user name"""
        if hasattr(obj, 'profile') and obj.profile and obj.profile.created_by_company_user:
            return obj.profile.created_by_company_user.full_name
        return None


class CompanyUserManagementSerializer(serializers.Serializer):
    """Serializer for creating/updating users"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False, min_length=6)
    username = serializers.CharField(required=False)
    fullName = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, required=False, default='team_member')
    phoneNumber = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    
    def validate_email(self, value):
        """Validate email is unique"""
        # Check if updating existing user
        if self.instance:
            if User.objects.filter(email=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Email already exists")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists")
        return value

