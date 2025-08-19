# SurveyGuy Online Deployment Guide

## 🌐 Backend Access Options

### Option 1: Same Domain (Recommended)
```
https://surveyguy.com/           # React frontend
https://surveyguy.com/api/       # Django backend
```

### Option 2: Subdomain Approach
```
https://app.surveyguy.com/       # React frontend
https://api.surveyguy.com/       # Django backend
```

## 🚀 Deployment Platforms

### Railway (Recommended)
1. **Connect GitHub repo** to Railway
2. **Set environment variables**:
   ```
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.railway.app
   DATABASE_URL=your-postgres-url
   SECRET_KEY=your-secret-key
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

### Heroku
1. **Create two apps**: frontend and backend
2. **Set buildpacks** for Python and Node.js
3. **Configure environment variables**

### Vercel + Railway
- **Vercel**: Deploy React frontend
- **Railway**: Deploy Django backend

## ⚙️ Configuration Changes

### 1. Update Django Settings for Production

```python
# surveyguy/settings.py

# Production settings
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com",
]

# Security settings
SECURE_SSL_REDIRECT = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Database (use environment variable)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```

### 2. Update React Axios Configuration

```javascript
// client/src/utils/axios.js

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
```

### 3. Environment Variables

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-domain.com/api/
```

#### Backend (.env.production)
```
DEBUG=False
SECRET_KEY=your-secure-secret-key
ALLOWED_HOSTS=your-backend-domain.com
DATABASE_URL=your-database-url
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Update CORS settings for production domains
- [ ] Set DEBUG=False
- [ ] Generate secure SECRET_KEY
- [ ] Configure production database
- [ ] Update ALLOWED_HOSTS
- [ ] Test API endpoints locally

### Deployment
- [ ] Deploy Django backend
- [ ] Deploy React frontend
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates
- [ ] Test all functionality

### Post-Deployment
- [ ] Verify API endpoints work
- [ ] Test login functionality
- [ ] Check CORS configuration
- [ ] Monitor error logs
- [ ] Set up monitoring/analytics

## 🔧 Railway Deployment Steps

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

5. **Set environment variables**:
   ```bash
   railway variables set DEBUG=False
   railway variables set SECRET_KEY=your-secret-key
   railway variables set ALLOWED_HOSTS=your-app-name.railway.app
   ```

## 🌍 Domain Configuration

### Custom Domain Setup
1. **Purchase domain** (e.g., surveyguy.com)
2. **Configure DNS** to point to your deployment
3. **Set up SSL certificates** (automatic with Railway/Heroku)
4. **Update CORS settings** for your domain

### Subdomain Setup
```
app.surveyguy.com    → React frontend
api.surveyguy.com    → Django backend
```

## 🔒 Security Considerations

- **HTTPS only** in production
- **Secure SECRET_KEY**
- **Proper CORS configuration**
- **Database security**
- **Environment variable protection**
- **Regular security updates**

## 📊 Monitoring

- **Error tracking** (Sentry)
- **Performance monitoring**
- **Uptime monitoring**
- **Database monitoring**
- **API usage analytics**

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Check CORS_ALLOWED_ORIGINS
2. **Database connection**: Verify DATABASE_URL
3. **Static files**: Configure whitenoise properly
4. **Environment variables**: Ensure all required vars are set

### Debug Commands
```bash
# Check Railway logs
railway logs

# Check Django logs
railway run python manage.py check

# Test database connection
railway run python manage.py dbshell
``` 