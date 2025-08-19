# Environment Variables Setup

## Frontend Environment Variables

### Development (.env.development)
Create `client/.env.development`:
```
REACT_APP_API_URL=http://localhost:8001/api/
```

### Production (.env.production)
Create `client/.env.production`:
```
REACT_APP_API_URL=https://your-backend-domain.com/api/
```

## Backend Environment Variables

### Development (.env)
Create `.env` in the root directory:
```
DEBUG=True
SECRET_KEY=django-insecure-change-this-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=surveyguy_db
DB_USER=surveyguy_user
DB_PASSWORD=surveyguy_password
DB_HOST=localhost
DB_PORT=5432
```

### Production (.env.production)
Create `.env.production` in the root directory:
```
DEBUG=False
SECRET_KEY=your-secure-production-secret-key
ALLOWED_HOSTS=your-backend-domain.com
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_HOST=your_production_db_host
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Railway Environment Variables

When deploying to Railway, set these environment variables:

```
DEBUG=False
SECRET_KEY=your-secure-secret-key
ALLOWED_HOSTS=your-app-name.railway.app
DATABASE_URL=your-postgres-url
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## How to Set Environment Variables

### Local Development
1. Create the `.env` files as shown above
2. Restart your development servers

### Railway Deployment
```bash
railway variables set DEBUG=False
railway variables set SECRET_KEY=your-secret-key
railway variables set ALLOWED_HOSTS=your-app-name.railway.app
```

### Heroku Deployment
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
``` 