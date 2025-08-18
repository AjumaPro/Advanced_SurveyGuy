#!/usr/bin/env python3
"""
Django Setup Script for SurveyGuy Conversion
This script helps set up the Django project after conversion.
"""

import os
import sys
import subprocess
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False


def create_directories():
    """Create necessary directories."""
    directories = [
        'static',
        'media',
        'templates',
        'logs',
        'staticfiles',
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"📁 Created directory: {directory}")


def setup_environment():
    """Set up environment variables."""
    env_content = """# Django Settings
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_NAME=surveyguy_db
DB_USER=surveyguy_user
DB_PASSWORD=surveyguy_password
DB_HOST=localhost
DB_PORT=5432

# Email Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key-change-this
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    print("📝 Created .env file")


def main():
    """Main setup function."""
    print("🚀 SurveyGuy Django Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("❌ Error: manage.py not found. Please run this script from the project root.")
        sys.exit(1)
    
    # Create directories
    print("\n📁 Creating directories...")
    create_directories()
    
    # Set up environment
    print("\n🔧 Setting up environment...")
    setup_environment()
    
    # Install dependencies
    print("\n📦 Installing dependencies...")
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("❌ Failed to install dependencies. Please check requirements.txt")
        sys.exit(1)
    
    # Run migrations
    print("\n🗄️ Setting up database...")
    if not run_command("python manage.py makemigrations", "Creating migrations"):
        print("❌ Failed to create migrations")
        sys.exit(1)
    
    if not run_command("python manage.py migrate", "Running migrations"):
        print("❌ Failed to run migrations")
        sys.exit(1)
    
    # Create superuser
    print("\n👤 Creating superuser...")
    print("Please create a superuser account:")
    run_command("python manage.py createsuperuser", "Creating superuser")
    
    # Collect static files
    print("\n📁 Collecting static files...")
    run_command("python manage.py collectstatic --noinput", "Collecting static files")
    
    print("\n🎉 Django setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Update your database settings in .env")
    print("2. Run: python manage.py runserver")
    print("3. Access admin at: http://localhost:8000/admin")
    print("4. Test the API endpoints")


if __name__ == "__main__":
    main() 