# SurveyGuy Django Backend

This is the Django backend for the SurveyGuy application, migrated from Node.js/Express.

## Features

- **Authentication**: JWT-based authentication with custom user model
- **Survey Management**: Create, read, update, delete surveys and questions
- **Response Collection**: Collect and store survey responses
- **Analytics**: Survey and question-level analytics
- **Templates**: Pre-built survey templates
- **Admin Panel**: Django admin interface
- **API**: RESTful API with Django REST Framework

## Setup

### Prerequisites

- Python 3.8+
- PostgreSQL
- pip

### Installation

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd surveyguy_backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `surveyguy_backend` directory:
   ```bash
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=surveyguy_db
   DB_USER=surveyguy_user
   DB_PASSWORD=surveyguy_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your-jwt-secret-here
   ADMIN_REGISTRATION_KEY=your-admin-key-here
   SUPER_ADMIN_REGISTRATION_KEY=your-super-admin-key-here
   ```

4. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Get current user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

### Surveys
- `GET /api/surveys/` - List surveys
- `POST /api/surveys/create/` - Create survey
- `GET /api/surveys/{id}/` - Get survey details
- `PUT /api/surveys/{id}/update/` - Update survey
- `DELETE /api/surveys/{id}/delete/` - Delete survey
- `POST /api/surveys/{id}/publish/` - Publish survey

### Questions
- `GET /api/surveys/{survey_id}/questions/` - List questions
- `POST /api/surveys/{survey_id}/questions/create/` - Create question
- `GET /api/surveys/{survey_id}/questions/{id}/` - Get question details
- `PUT /api/surveys/{survey_id}/questions/{id}/update/` - Update question
- `DELETE /api/surveys/{survey_id}/questions/{id}/delete/` - Delete question

### Responses
- `GET /api/surveys/{survey_id}/responses/` - List responses
- `POST /api/surveys/{survey_id}/responses/create/` - Submit response
- `GET /api/surveys/{survey_id}/responses/{id}/` - Get response details

### Templates
- `GET /api/surveys/templates/` - List templates (authenticated)
- `GET /api/surveys/public/templates/` - List templates (public)
- `GET /api/surveys/templates/categories/` - List template categories
- `GET /api/surveys/public/templates/categories/` - List template categories (public)
- `GET /api/surveys/templates/{id}/` - Get template details
- `POST /api/surveys/templates/{id}/create/` - Create survey from template

### Analytics
- `GET /api/analytics/dashboard/` - Dashboard metrics
- `GET /api/analytics/surveys/{id}/analytics/` - Survey analytics
- `GET /api/analytics/questions/{id}/analytics/` - Question analytics
- `POST /api/analytics/export/` - Export data

### Health Check
- `GET /api/health/` - Health check endpoint

## Database Schema

The Django models correspond to the existing PostgreSQL database schema:

- **CustomUser**: Extended user model with roles and subscriptions
- **Survey**: Survey information and metadata
- **Question**: Survey questions with various types
- **Response**: Survey responses
- **SurveyTemplate**: Pre-built survey templates
- **SurveyAnalytics**: Survey-level analytics
- **QuestionAnalytics**: Question-level analytics
- **PaymentSubscription**: User subscription information
- **PaymentIntent**: Payment processing

## Security Features

- JWT authentication with refresh tokens
- Password validation and hashing
- CORS configuration
- Rate limiting
- Admin approval system
- Secure admin registration keys

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Applying Migrations
```bash
python manage.py migrate
```

### Django Admin
Access the Django admin interface at `http://localhost:8000/admin/`

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in settings
2. Configure proper database settings
3. Set up static file serving
4. Configure proper CORS settings
5. Set up SSL/TLS
6. Configure proper logging
7. Set up monitoring and error tracking

## Migration from Node.js

This Django backend maintains API compatibility with the existing Node.js backend:

- Same endpoint structure
- Same request/response formats
- Same authentication flow
- Same database schema

The frontend should work without changes, just update the API base URL to point to the Django backend. 