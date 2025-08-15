# SurveyGuy - Comprehensive Survey Platform

A modern, feature-rich survey platform with drag & drop builder, emoji scales, and real-time analytics.

## 🚀 Core Features

### Survey Builder
- **Drag & Drop Interface**: Intuitive visual builder
- **Form-Based Creation**: Alternative text-based builder
- **Multiple Question Types**:
  - Multiple choice
  - Emoji rating scales
  - Likert scale (1-10)
  - Text feedback
  - Image upload
  - Custom visual scales (smileys, thumbs, stars, hearts)

### Question Design
- Custom image attachments for question options
- Multiple layouts (horizontal/vertical)
- Uploadable custom icons per option
- Visual scales with custom emojis/images

### User Interface
- **Frontend**: React.js with modern UI components
- **Styling**: Tailwind CSS for beautiful, responsive design
- **Interactive Elements**: Smooth animations and transitions

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL for reliable data storage
- **File Storage**: Firebase for emoji scales and custom assets
- **Authentication**: JWT-based authentication system
- **Analytics**: Comprehensive analytics and reporting
- **Event Management**: Event creation and registration system
- **Admin Panel**: Full admin management system

### Analytics Dashboard
- Real-time response visualization
- Distribution charts (e.g., 30% gave 9/10)
- Satisfaction index calculations
- Export functionality (CSV/PDF)
- Advanced analytics with user activity tracking
- Dashboard metrics and performance insights

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SurveyGuy
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   npm run setup-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
SurveyGuy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── data/          # Static data and templates
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── surveys.js     # Survey management
│   │   ├── analytics.js   # Analytics and reporting
│   │   ├── events.js      # Event management
│   │   ├── admin.js       # Admin panel
│   │   └── payments.js    # Payment processing
│   ├── middleware/        # Express middleware
│   ├── database/          # Database setup and connection
│   └── uploads/           # File uploads
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎨 Emoji Scale Implementation

The platform includes custom emoji scales with:
- Visual feedback on selection
- Smooth animations
- Custom image support
- Responsive design

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT token secret
- `FIREBASE_CONFIG`: Firebase configuration
- `PORT`: Server port (default: 5000)
- `PAYSTACK_SECRET_KEY`: Payment processing
- `FRONTEND_URL`: Frontend URL for CORS

### Database Schema
- Users table for authentication and roles
- Surveys table for survey metadata
- Questions table for survey questions
- Responses table for user responses
- Analytics tables for tracking and metrics
- Events table for event management
- Payment tables for subscription management
- Admin tables for user management

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set up production environment**
   - Configure production database
   - Set up Firebase production project
   - Configure environment variables

3. **Deploy to your preferred platform**
   - Heroku
   - Vercel
   - AWS
   - DigitalOcean

## 📊 Features Roadmap

### Core Features ✅
- [x] Survey Builder (Drag & Drop)
- [x] Multiple Question Types
- [x] Emoji Rating Scales
- [x] Real-time Analytics
- [x] Export Functionality
- [x] Authentication System
- [x] Survey Templates
- [x] Event Management
- [x] Admin Panel
- [x] Payment Processing
- [x] Advanced Analytics

### Optional Features 🔄
- [ ] Response Anonymization
- [ ] Scheduling & Reminders
- [ ] Embedding Support
- [ ] Multi-language Support
- [ ] Advanced Reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions, please open an issue in the repository. 