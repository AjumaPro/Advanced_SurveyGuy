# AI Environment Setup Guide

## Required Environment Variables for AI Features

Add these variables to your `.env.local` file:

```bash
# ==================
# OPENAI AI SERVICES
# ==================
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4

# ==================
# SENTIMENT ANALYSIS (Browser-based)
# ==================
# Sentiment analysis works automatically in the browser
# No additional configuration needed

# ==================
# APPLICATION SETTINGS
# ==================
REACT_APP_ENABLE_AI_FEATURES=true
REACT_APP_AI_FALLBACK_MODE=true
```

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add to `.env.local`

### Sentiment Analysis (Browser-based)
- No setup required - works automatically in the browser
- Uses the `sentiment` library for client-side analysis
- No API keys or external services needed

## Features Enabled

With these keys configured:
- ✅ Real AI question generation using OpenAI GPT-4
- ✅ Sentiment analysis using browser-based processing
- ✅ AI-powered survey optimization
- ✅ Response clustering and insights
- ✅ Professional report enhancement

## Fallback Mode

If AI services are unavailable, the system will:
- Use template-based question generation
- Provide basic sentiment analysis (always available)
- Show traditional optimization suggestions
- Maintain full functionality without OpenAI features
