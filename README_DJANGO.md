# 🚀 SurveyGuy Django - Complete Survey Platform

A modern, feature-rich survey platform built with **Django** and **Django REST Framework**, featuring drag & drop builder, emoji scales, and real-time analytics.

## 🎯 **Project Overview**

SurveyGuy has been successfully converted from Node.js/React to Django while maintaining all existing functionality and improving the architecture with Django's robust features.

## ✨ **Key Features**

### **Survey Management**
- 🎨 **Drag & Drop Builder**: Intuitive visual survey builder
- 📝 **Multiple Question Types**: Text, multiple choice, emoji scales, ratings, file uploads
- 🎭 **Emoji Rating Scales**: Custom emoji scales with visual feedback
- 📊 **Real-time Analytics**: Live response visualization and reporting
- 📤 **Export Functionality**: CSV, Excel, PDF, and JSON exports
- 🎪 **Event Management**: Event creation and registration system
- 💳 **Payment Processing**: Subscription and payment management
- 👥 **Admin Panel**: Comprehensive admin interface

### **User Management**
- 🔐 **JWT Authentication**: Secure token-based authentication
- 👤 **Role-based Access**: User, Admin, and Super Admin roles
- 📧 **Email Authentication**: Email-based login system
- ✅ **User Approval**: Admin approval system
- 📊 **Activity Tracking**: Comprehensive user activity logging

### **Analytics & Reporting**
- 📈 **Real-time Dashboards**: Live survey response tracking
- 📊 **Advanced Analytics**: Response distribution and trends
- 📋 **Custom Reports**: Generate custom analytics reports
- 📤 **Data Export**: Multiple export formats
- 📱 **Mobile Responsive**: Works on all devices

## 🛠️ **Technology Stack**

### **Backend**
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API framework
- **PostgreSQL**: Database
- **JWT Authentication**: Token-based auth
- **Celery**: Background tasks
- **Redis**: Caching and task queue

### **Frontend** (Compatible)
- **React.js**: Frontend framework
- **Tailwind CSS**: Styling
- **Axios**: HTTP client

### **Deployment**
- **Gunicorn**: WSGI server
- **Whitenoise**: Static file serving
- **Railway**: Deployment platform

## 🚀 **Quick Start**

### **1. Prerequisites**
```bash
# Python 3.8+
python --version

# PostgreSQL
# Install PostgreSQL and create a database

# Git
git clone <repository-url>
cd SurveyGuy
```

### **2. Setup Environment**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **3. Database Setup**
```bash
# Create PostgreSQL database
createdb surveyguy_db

# Run migrations
python manage.py makemigrations
python manage.py migrate
```

### **4. Create Superuser**
```bash
python manage.py createsuperuser
```

### **5. Run Development Server**
```bash
python manage.py runserver
```

### **6. Access the Application**
- **Admin Panel**: http://localhost:8000/admin
- **API Endpoints**: http://localhost:8000/api/
- **Frontend**: http://localhost:3000 (React app)

## 📁 **Project Structure**

```
SurveyGuy/
├── surveyguy/              # Main Django project
│   ├── settings.py         # Django settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
├── accounts/              # User management
│   ├── models.py          # Custom User model
│   ├── views.py           # Authentication views
│   ├── serializers.py     # API serializers
│   └── urls.py            # Account URLs
├── surveys/               # Survey management
│   ├── models.py          # Survey models
│   ├── views.py           # Survey views
│   ├── serializers.py     # Survey serializers
│   └── urls.py            # Survey URLs
├── analytics/             # Analytics and reporting
├── events/                # Event management
├── payments/              # Payment processing
├── templates/             # Survey templates
├── static/                # Static files
├── media/                 # Uploaded files
├── manage.py              # Django management
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables
```

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the project root:

```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=surveyguy_db
DB_USER=surveyguy_user
DB_PASSWORD=surveyguy_password
DB_HOST=localhost
DB_PORT=5432

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# JWT
JWT_SECRET_KEY=your-jwt-secret
```

### **Database Schema**
The Django models provide:
- **Users**: Custom user model with roles
- **Surveys**: Survey creation and management
- **Questions**: Multiple question types
- **Responses**: Survey response collection
- **Analytics**: Response analytics and reporting
- **Events**: Event management system
- **Payments**: Subscription and payment processing

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/current-user/` - Get current user

### **Surveys**
- `GET /api/surveys/` - List surveys
- `POST /api/surveys/` - Create survey
- `GET /api/surveys/{id}/` - Get survey details
- `PUT /api/surveys/{id}/` - Update survey
- `DELETE /api/surveys/{id}/` - Delete survey

### **Analytics**
- `GET /api/analytics/survey/{id}/` - Survey analytics
- `GET /api/analytics/dashboard/` - Dashboard metrics
- `POST /api/analytics/export/` - Export data

### **Events**
- `GET /api/events/` - List events
- `POST /api/events/` - Create event
- `GET /api/events/{id}/` - Get event details

## 🎨 **Frontend Integration**

The existing React frontend is compatible with the Django API. Update the API base URL in your React app:

```javascript
// In your React app's axios configuration
const API_BASE_URL = 'http://localhost:8000/api';
```

## 🚀 **Deployment**

### **Railway Deployment**
1. **Connect Repository**: Link your GitHub repository to Railway
2. **Environment Variables**: Set all required environment variables
3. **Database**: Railway will automatically provision PostgreSQL
4. **Deploy**: Railway will automatically deploy on push

### **Manual Deployment**
```bash
# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Start production server
gunicorn surveyguy.wsgi:application
```

## 🧪 **Testing**

```bash
# Run tests
python manage.py test

# Run specific app tests
python manage.py test accounts
python manage.py test surveys
python manage.py test analytics
```

## 📈 **Performance**

### **Optimizations**
- **Database Indexing**: Optimized database queries
- **Caching**: Redis-based caching
- **Static Files**: CDN-ready static file serving
- **Background Tasks**: Celery for heavy operations

### **Monitoring**
- **Logging**: Comprehensive logging system
- **Error Tracking**: Django debug toolbar in development
- **Performance**: Database query optimization

## 🔒 **Security**

### **Features**
- **JWT Authentication**: Secure token-based auth
- **CSRF Protection**: Built-in CSRF protection
- **SQL Injection Protection**: Django ORM protection
- **XSS Protection**: Template auto-escaping
- **File Upload Security**: Secure file handling

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support**

For support and questions:
- Open an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎉 **Migration Benefits**

### **Advantages of Django**
- ✅ **Built-in Admin**: Powerful admin interface
- ✅ **Security**: Comprehensive security features
- ✅ **ORM**: Robust database abstraction
- ✅ **Scalability**: Enterprise-ready architecture
- ✅ **Community**: Large, active community
- ✅ **Documentation**: Excellent documentation

### **Maintained Features**
- ✅ All existing functionality preserved
- ✅ Same API endpoints
- ✅ Compatible with existing frontend
- ✅ Enhanced security and performance
- ✅ Better code organization

---

**Status**: 🟢 **DJANGO CONVERSION COMPLETE**

**Ready for**: Development, Testing, and Production Deployment 