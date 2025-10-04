#!/bin/bash

# Paystack Setup Script for SurveyGuy
echo "🔧 Setting up Paystack Payment Integration..."

# Create .env.local file in client directory
ENV_FILE="client/.env.local"

echo "📝 Creating environment file: $ENV_FILE"

# Create the environment file with Paystack configuration
cat > "$ENV_FILE" << 'EOF'
# Paystack Configuration for SurveyGuy
# Get your API keys from: https://dashboard.paystack.com/#/settings/developers

# Paystack Test Keys (REPLACE WITH YOUR ACTUAL KEYS)
REACT_APP_PAYSTACK_PUBLIC_KEY_TEST=pk_test_xxxxx
REACT_APP_PAYSTACK_PUBLIC_KEY_LIVE=pk_live_xxxxx
REACT_APP_PAYMENT_MODE=test

# Supabase Configuration (already configured)
REACT_APP_SUPABASE_URL=https://waasqqbklnhfrbzfuvzn.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXNxcWJrbG5oZnJiemZ1dnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjQ5ODcsImV4cCI6MjA3MzgwMDk4N30.W0CHR_5kQi6JL7p5qJ2hrHkqme0QWEsxSS4zIlzqv7Q

# Application Configuration
NODE_ENV=development
REACT_APP_VERSION=1.0.0

# Features
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_ENABLE_EVENTS=true

# Contact Information
REACT_APP_SUPPORT_PHONE=+233249739599
REACT_APP_TECHNICAL_PHONE=+233506985503
REACT_APP_LOCATION="Accra, Ghana"
EOF

echo "✅ Environment file created successfully!"
echo ""
echo "🚨 IMPORTANT: You need to replace the Paystack keys with your actual keys:"
echo "   1. Go to: https://dashboard.paystack.com/#/settings/developers"
echo "   2. Get your test public key (pk_test_...)"
echo "   3. Replace 'pk_test_xxxxx' in $ENV_FILE with your actual key"
echo ""
echo "📋 Test Cards for Ghana:"
echo "   Success: 4084084084084081"
echo "   Insufficient Funds: 4084084084084085"
echo "   Declined: 4084084084084082"
echo ""
echo "💰 Test Amounts:"
echo "   Pro Monthly: ₵600"
echo "   Pro Yearly: ₵6,000"
echo "   Enterprise Monthly: ₵1,800"
echo "   Enterprise Yearly: ₵18,000"
echo ""
echo "🔄 Next steps:"
echo "   1. Edit $ENV_FILE with your Paystack keys"
echo "   2. Restart your development server: npm start"
echo "   3. Test payment at: http://localhost:3000/app/subscriptions"
echo ""
echo "📚 For complete setup guide, see: PAYSTACK_SETUP_COMPLETE.md"
