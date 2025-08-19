#!/bin/bash

echo "🚀 SurveyGuy Railway Deployment Script"
echo "======================================"

# Check if Railway CLI is available
if ! command -v npx railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing locally..."
    npm install @railway/cli --save-dev
fi

echo "📋 Checking current setup..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: manage.py not found. Please run this script from the project root."
    exit 1
fi

if [ ! -f "railway.json" ]; then
    echo "❌ Error: railway.json not found."
    exit 1
fi

echo "✅ Project structure looks good!"

# Check if user is logged in to Railway
echo "🔐 Checking Railway login status..."
if ! npx railway whoami &> /dev/null; then
    echo "⚠️  Not logged in to Railway. Please log in:"
    echo "   npx railway login"
    echo ""
    echo "After logging in, run this script again."
    exit 1
fi

echo "✅ Logged in to Railway!"

# Initialize Railway project if not already done
if [ ! -f ".railway" ]; then
    echo "🚀 Initializing Railway project..."
    npx railway init
else
    echo "✅ Railway project already initialized"
fi

echo ""
echo "🎯 Ready to deploy!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Run: npx railway up"
echo "2. Set environment variables:"
echo "   npx railway variables set DEBUG=False"
echo "   npx railway variables set SECRET_KEY=your-secret-key"
echo "   npx railway variables set ALLOWED_HOSTS=your-app-name.railway.app"
echo ""
echo "3. Get your deployment URL:"
echo "   npx railway domain"
echo ""
echo "4. Update your frontend to use the new backend URL"
echo ""
echo "Would you like to proceed with deployment? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🚀 Deploying to Railway..."
    npx railway up
else
    echo "⏸️  Deployment cancelled. Run 'npx railway up' when ready."
fi 