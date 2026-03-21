#!/usr/bin/env python3
"""
Manual deployment to PythonAnywhere
"""

import os
import subprocess

def create_deployment_package():
    """Create a deployment package for PythonAnywhere"""
    
    # Create a simple deployment script
    deploy_script = """#!/bin/bash
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
"""
    
    with open('deploy_pythonanywhere.sh', 'w') as f:
        f.write(deploy_script)
    
    print("PythonAnywhere deployment package created!")
    print("\nTo deploy:")
    print("1. Go to https://www.pythonanywhere.com")
    print("2. Sign up for a free account")
    print("3. Go to Files > Upload a file")
    print("4. Upload these files:")
    print("   - AccessEdu_Project.py")
    print("   - requirements.txt")
    print("   - deploy_pythonanywhere.sh")
    print("5. Go to Bash console")
    print("6. Run: bash deploy_pythonanywhere.sh")
    print("7. Set your GEMINI_API_KEY environment variable")
    print("8. Your API will be live!")

if __name__ == "__main__":
    create_deployment_package()
