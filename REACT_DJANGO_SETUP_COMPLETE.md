# 🎉 React + Django Setup Complete!

## Overview
Your SurveyGuy application is now set up with:
- **React Frontend**: Running on `http://localhost:3002`
- **Django Backend**: Running on `http://localhost:8001`
- **API Communication**: React calls Django API endpoints
- **Authentication**: JWT-based authentication between React and Django

## 🚀 Quick Start

### 1. Start Django Backend
```bash
# Terminal 1
python manage.py runserver 8001
```

### 2. Start React Frontend
```bash
# Terminal 2
cd client
npm start
```

### 3. Access the Application
- **React Frontend**: http://localhost:3002
- **Django API**: http://localhost:8001/api/
- **Django Admin**: http://localhost:8001/admin/

## 🔧 How It Works

### Architecture
```
┌─────────────────┐    API Calls    ┌─────────────────┐
│   React App     │ ──────────────► │  Django API     │
│  localhost:3002 │                 │ localhost:8001  │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
   Frontend UI                          Backend Logic
   (Components)                         (Database, Auth)
```

### API Communication
- React makes API calls to `/api/*` endpoints
- These are proxied to Django at `http://localhost:8001/api/*`
- Django handles authentication, database operations, and business logic
- React handles UI, state management, and user interactions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/logout/` - User logout

### Surveys
- `GET /api/surveys/` - List surveys
- `POST /api/surveys/` - Create survey
- `GET /api/surveys/{id}/` - Get survey details
- `PUT /api/surveys/{id}/` - Update survey
- `DELETE /api/surveys/{id}/` - Delete survey

### Questions
- `POST /api/questions/add/` - Add question to survey
- `DELETE /api/questions/{id}/delete/` - Delete question

### Analytics
- `GET /api/analytics/` - Get analytics data
- `GET /api/analytics/surveys/{id}/` - Get survey analytics

## 🔐 Authentication Flow

### 1. User Login
```javascript
// React AuthContext
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { user, token } = response.data;
  
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setToken(token);
  setUser(user);
};
```

### 2. API Requests
```javascript
// Axios automatically adds token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Protected Routes
```javascript
// React Router with authentication
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" />;
};
```

## 🎯 Available Pages

### Public Pages
- **Landing Page**: http://localhost:3002/
- **Login**: http://localhost:3002/login
- **Register**: http://localhost:3002/register
- **Pricing**: http://localhost:3002/pricing

### Protected Pages (Require Login)
- **Dashboard**: http://localhost:3002/app/dashboard
- **Survey Builder**: http://localhost:3002/app/survey-builder
- **Surveys List**: http://localhost:3002/app/surveys
- **Survey Analytics**: http://localhost:3002/app/surveys/{id}/analytics
- **Template Library**: http://localhost:3002/app/templates
- **Event Management**: http://localhost:3002/app/events
- **User Profile**: http://localhost:3002/app/profile
- **Billing**: http://localhost:3002/app/billing
- **Subscriptions**: http://localhost:3002/app/subscriptions
- **Team Management**: http://localhost:3002/app/team

## 🛠️ Development Workflow

### 1. Frontend Development
```bash
cd client
npm start
```
- Edit React components in `client/src/`
- Hot reloading enabled
- Changes appear immediately in browser

### 2. Backend Development
```bash
python manage.py runserver 8001
```
- Edit Django views in `surveyguy/frontend_views.py`
- Edit API views in `accounts/api_views.py`
- Database changes require migrations

### 3. Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

## 🔍 Testing

### Test API Endpoints
```bash
# Health check
curl http://localhost:8001/api/health/

# Test authentication
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test React Frontend
- Open http://localhost:3002 in browser
- Try logging in/registering
- Navigate through different pages
- Test survey creation and management

## 📁 Project Structure

```
SurveyGuy/
├── surveyguy/              # Django backend
│   ├── settings.py         # Django configuration
│   ├── urls.py             # URL routing
│   └── frontend_views.py   # Frontend redirects
├── accounts/               # User management
│   ├── models.py           # User model
│   ├── api_views.py        # Authentication API
│   └── urls.py             # API URLs
├── surveys/                # Survey management
│   ├── models.py           # Survey models
│   ├── views.py            # Survey views
│   └── urls.py             # Survey URLs
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # React pages
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── utils/          # Utilities
│   ├── package.json        # Dependencies
│   └── setupProxy.js       # API proxy
└── requirements.txt        # Python dependencies
```

## 🚀 Deployment

### Development
- Both servers running locally
- Hot reloading enabled
- Debug mode active

### Production
```bash
# Build React app
cd client
npm run build

# Deploy Django with React build
python manage.py collectstatic
python manage.py runserver
```

## 🔧 Configuration Files

### Django Settings (`surveyguy/settings.py`)
- CORS configuration for React
- JWT authentication settings
- Database configuration
- Static files setup

### React Configuration (`client/src/utils/axios.js`)
- API base URL configuration
- Authentication headers
- CSRF token handling

### Proxy Configuration (`client/src/setupProxy.js`)
- API requests proxied to Django
- Development server setup

## 🎉 Success!

Your React + Django application is now fully functional:

✅ **React Frontend** - Modern UI with all features  
✅ **Django Backend** - Robust API with authentication  
✅ **Database Integration** - PostgreSQL with migrations  
✅ **Authentication** - JWT-based secure auth  
✅ **API Communication** - Seamless frontend-backend integration  
✅ **Development Environment** - Hot reloading and debugging  

**You can now start building amazing surveys with your React + Django application!** 🚀

## 📞 Support

If you encounter any issues:
1. Check both servers are running
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Review Django logs for backend issues

**Happy coding!** 🎉 