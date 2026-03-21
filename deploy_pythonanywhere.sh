#!/bin/bash
# PythonAnywhere Deployment Script for AccessEdu Backend

echo "Starting AccessEdu Backend Deployment..."

# Create virtual environment
python3 -m venv accessedu-env
source accessedu-env/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic google-genai python-multipart youtube-transcript-api python-dotenv

# Set environment variables
export PORT=8000
export HOST=0.0.0.0
# Set your Gemini API key here:
# export GEMINI_API_KEY=your_actual_gemini_api_key

# Run the application
python AccessEdu_Project.py

echo "Deployment complete!"
echo "Your API will be available at: http://yourusername.pythonanywhere.com:8000"
echo "API docs at: http://yourusername.pythonanywhere.com:8000/docs"
