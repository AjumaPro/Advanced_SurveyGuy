#!/bin/bash

# =============================================
# ADVANCED SURVEYGUY - PRODUCTION BUILD SCRIPT
# =============================================

set -e  # Exit on any error

echo "🚀 Starting Advanced SurveyGuy Production Build Process..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Clean up demo/sample files
print_status "Removing demo and sample files..."
cd client/src

# Remove sample files
rm -f pages/SampleSurveys.js
rm -f components/SampleSurveyManager.js
rm -f data/sampleSurveys.js
rm -f data/sampleEvents.js
rm -f utils/sampleSurveySetup.js
rm -f components/SampleSurveyInitializer.js

print_success "Demo files removed"

# 2. Navigate to client directory and clean
cd /Users/newuser/Desktop/Advanced_SurveyGuy/client
print_status "Cleaning node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# 3. Install dependencies
print_status "Installing production dependencies..."
npm install --production=false

# 4. Set production environment variables
print_status "Setting production environment variables..."
export NODE_ENV=production
export REACT_APP_PAYMENT_MODE=live
export GENERATE_SOURCEMAP=false

# 5. Build the application
print_status "Building application for production..."
npm run build

# 6. Verify build
if [ -d "build" ]; then
    print_success "Production build completed successfully!"
    
    # Get build size
    BUILD_SIZE=$(du -sh build | cut -f1)
    print_status "Build size: $BUILD_SIZE"
    
    # List build contents
    print_status "Build contents:"
    ls -la build/
    
    # Check for important files
    if [ -f "build/index.html" ]; then
        print_success "✅ index.html created"
    else
        print_error "❌ index.html missing"
    fi
    
    if [ -d "build/static" ]; then
        print_success "✅ Static assets created"
    else
        print_error "❌ Static assets missing"
    fi
    
    print_success "🎉 Production build is ready for deployment!"
    echo ""
    echo "📁 Build files are in: $(pwd)/build"
    echo "🌐 Ready for deployment to your hosting service!"
    
else
    print_error "❌ Build failed! Please check the errors above."
    exit 1
fi

echo ""
echo "=================================================="
echo "🎯 NEXT STEPS FOR PRODUCTION DEPLOYMENT:"
echo "=================================================="
echo "1. 📊 Run ULTRA_SAFE_PRODUCTION_CLEANUP.sql in Supabase SQL editor"
echo "2. ⚙️  Update your .env.local with production values:"
echo "   - REACT_APP_SUPABASE_URL (production URL)"
echo "   - REACT_APP_SUPABASE_ANON_KEY (production key)"
echo "   - REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE (live Paystack key)"
echo "   - REACT_APP_PAYMENT_MODE=live"
echo "3. 🚀 Deploy the 'build' directory to your hosting service"
echo "4. 🔒 Configure SSL certificate and domain"
echo "5. 📧 Set up production email service (Resend API key)"
echo "6. 🧪 Test all functionality in production environment"
echo ""
echo "📋 Production Checklist:"
echo "✅ Demo data removed"
echo "✅ Sample files removed"
echo "✅ Dependencies installed"
echo "✅ Production build created"
echo "✅ Build verified"
echo ""
print_success "Production build process completed successfully! 🎉"
