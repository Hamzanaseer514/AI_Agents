"""
Script to create a Django superuser non-interactively.
Usage: python create_admin.py
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_manager_ai.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import UserProfile

User = get_user_model()

def create_admin():
    username = input("Enter username: ")
    email = input("Enter email (optional, press Enter to skip): ")
    password = input("Enter password: ")
    password_confirm = input("Confirm password: ")
    
    if password != password_confirm:
        print("Error: Passwords don't match!")
        return
    
    if User.objects.filter(username=username).exists():
        print(f"Error: User '{username}' already exists!")
        return
    
    # Create superuser
    user = User.objects.create_superuser(
        username=username,
        email=email if email else '',
        password=password
    )
    
    # Ensure user has a profile
    profile, created = UserProfile.objects.get_or_create(user=user)
    if created:
        print(f"Created user profile for {username}")
    
    print(f"\n✓ Superuser '{username}' created successfully!")
    print(f"You can now login at: http://localhost:8000/admin/")

if __name__ == '__main__':
    create_admin()

