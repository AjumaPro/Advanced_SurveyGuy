#!/bin/bash

# =============================================
# ADVANCED SURVEYGUY - PRODUCTION BUILD SCRIPT
# =============================================

echo "🚀 Starting production build process..."

# 1. Clean up demo data from database
echo "📊 Cleaning up demo data from database..."
echo "Please run the PRODUCTION_CLEANUP.sql script in your Supabase SQL editor"

# 2. Remove demo files
echo "🗑️  Removing demo files..."
rm -f client/src/data/sampleSurveys.js
rm -f client/src/data/sampleEvents.js
rm -f client/src/utils/sampleSurveySetup.js
rm -f client/src/components/SampleSurveyInitializer.js

# 3. Clean node_modules and reinstall
echo "📦 Cleaning and reinstalling dependencies..."
cd client
rm -rf node_modules
rm -f package-lock.json
npm install

# 4. Set production environment
echo "⚙️  Setting production environment..."
export NODE_ENV=production
export REACT_APP_PAYMENT_MODE=live

# 5. Build the application
echo "🔨 Building application for production..."
npm run build

# 6. Verify build
if [ -d "build" ]; then
    echo "✅ Production build completed successfully!"
    echo "📁 Build files are in the 'build' directory"
    echo "🌐 Ready for deployment!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "🎉 Production build process completed!"
echo ""
echo "Next steps:"
echo "1. Run PRODUCTION_CLEANUP.sql in Supabase"
echo "2. Update your environment variables for production"
echo "3. Deploy the 'build' directory to your hosting service"
echo "4. Configure your domain and SSL certificate"
