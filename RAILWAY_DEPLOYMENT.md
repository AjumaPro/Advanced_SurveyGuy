# Railway.app Deployment Guide for SurveyGuy

## 🚀 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be on GitHub
3. **Environment Variables**: Prepare your production environment variables

## 📋 Pre-Deployment Checklist

### ✅ Required Environment Variables

Set these in Railway's environment variables section:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database (Railway will provide this automatically)
DATABASE_URL=postgresql://...

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here

# Firebase Configuration
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=your-firebase-app-id

# Frontend URL (Update with your Railway domain)
FRONTEND_URL=https://your-app-name.railway.app
```

## 🚀 Deployment Steps

### 1. Connect to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your SurveyGuy repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide the `DATABASE_URL` environment variable

### 3. Configure Environment Variables

1. Go to your project's "Variables" tab
2. Add all the environment variables listed above
3. Update `FRONTEND_URL` with your actual Railway domain

### 4. Deploy

1. Railway will automatically detect the Node.js app
2. It will run the build process using the `build` script
3. The app will start using the `start` script

## 🔧 Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Procfile
```
web: npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is specified in `engines`

2. **Database Connection Fails**
   - Verify `DATABASE_URL` is set correctly
   - Check SSL configuration in production

3. **CORS Errors**
   - Update `FRONTEND_URL` with correct Railway domain
   - Check CORS configuration in `server/index.js`

4. **Static Files Not Loading**
   - Ensure React build is created in `client/build`
   - Check static file serving configuration

### Debug Commands

```bash
# Check logs
railway logs

# Check environment variables
railway variables

# Restart deployment
railway up
```

## 🔒 Security Considerations

1. **JWT Secret**: Use a strong, unique secret
2. **Database**: Railway provides secure PostgreSQL
3. **CORS**: Configure properly for production domains
4. **Rate Limiting**: Already configured in the app
5. **Helmet**: Security headers are enabled

## 📊 Monitoring

1. **Health Check**: `/api/health` endpoint
2. **Logs**: Available in Railway dashboard
3. **Metrics**: Railway provides basic metrics
4. **Database**: PostgreSQL monitoring included

## 🔄 Updates

To update your deployment:

1. Push changes to GitHub
2. Railway will automatically redeploy
3. Monitor logs for any issues

## 📞 Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Project Issues: GitHub repository issues

## ✅ Post-Deployment Checklist

- [ ] Health check endpoint responds
- [ ] Database connection established
- [ ] React app loads correctly
- [ ] API endpoints work
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Custom domain configured (optional) 