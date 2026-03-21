#!/bin/bash

echo "🚀 AccessEdu Deployment Script"
echo "=============================="

# Frontend deployment to Vercel
echo "📦 Deploying frontend to Vercel..."
vercel --prod --yes

echo ""
echo "🐍 Backend Options:"
echo "1. Deploy to Render (Recommended for Python)"
echo "2. Deploy to Railway"
echo "3. Deploy with Docker"
echo "4. Deploy to Heroku"

read -p "Choose backend deployment option (1-4): " choice

case $choice in
    1)
        echo "🎨 Deploying to Render..."
        echo "1. Go to https://render.com"
        echo "2. Connect your GitHub repository"
        echo "3. Create new Web Service"
        echo "4. Use these settings:"
        echo "   - Runtime: Python"
        echo "   - Build Command: pip install -r requirements.txt"
        echo "   - Start Command: python AccessEdu_Project.py"
        echo "   - Environment Variables: GEMINI_API_KEY=your_key"
        ;;
    2)
        echo "🚂 Deploying to Railway..."
        railway login
        railway deploy
        ;;
    3)
        echo "🐳 Deploying with Docker..."
        docker build -t accessedu .
        echo "Run with: docker run -p 8000:8000 -e GEMINI_API_KEY=your_key accessedu"
        ;;
    4)
        echo "🌿 Deploying to Heroku..."
        heroku create accessedu-backend
        heroku config:set GEMINI_API_KEY=your_gemini_api_key
        git push heroku main
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo "📝 Don't forget to:"
echo "   - Set GEMINI_API_KEY environment variable"
echo "   - Update NEXT_PUBLIC_API_URL in frontend"
echo "   - Test the deployed application"
