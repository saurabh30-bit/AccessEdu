# Deployment Guide

This document provides instructions for deploying AccessEdu to various platforms.

## 🚀 Deployment Options

### 1. Vercel (Recommended for Frontend + Backend)

**Frontend (Next.js):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
vercel --prod
```

**Backend (Python API):**
```bash
# Deploy backend to Vercel
vercel --prod
```

**Environment Variables needed:**
- `GEMINI_API_KEY`: Your Google Gemini API key

### 2. Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_gemini_api_key

# Deploy
git push heroku main
```

### 3. Docker

```bash
# Build Docker image
docker build -t accessedu .

# Run container
docker run -p 8000:8000 -e GEMINI_API_KEY=your_gemini_api_key accessedu
```

### 4. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway deploy
```

### 5. Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `PORT` | Port for the backend server (default: 8000) | No |
| `HOST` | Host for the backend server (default: 0.0.0.0) | No |

## 🔧 Configuration Files

- `Dockerfile`: Docker configuration
- `Procfile`: Heroku process configuration
- `vercel.json`: Vercel deployment configuration
- `app.json`: Heroku app configuration
- `runtime.txt`: Python version specification

## 🌐 Frontend Configuration

Update `NEXT_PUBLIC_API_URL` in your frontend environment to point to your deployed backend:

```bash
# For production
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

## ✅ Pre-deployment Checklist

1. [ ] Set up `GEMINI_API_KEY` environment variable
2. [ ] Update frontend API URL for production
3. [ ] Test all API endpoints
4. [ ] Verify YouTube transcript fetching
5. [ ] Test AI summarization functionality
6. [ ] Check CORS configuration

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure the backend port is properly configured
2. **CORS errors**: Check that CORS middleware is properly configured
3. **API key errors**: Verify `GEMINI_API_KEY` is set correctly
4. **Build failures**: Check that all dependencies are installed

### Health Check

Your backend should respond to:
```
GET /api/test
```

With status: `{"status": "ok", "message": "Backend is reachable"}`
