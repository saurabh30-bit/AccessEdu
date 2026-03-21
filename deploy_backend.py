#!/usr/bin/env python3
"""
Simple deployment script for AccessEdu backend
"""

import os
import subprocess
import sys

def check_requirements():
    """Check if all requirements are installed"""
    try:
        import google.genai
        import fastapi
        import uvicorn
        print("All requirements met")
        return True
    except ImportError as e:
        print(f"Missing requirement: {e}")
        return False

def test_backend():
    """Test the backend locally"""
    try:
        import requests
        response = requests.get("http://localhost:8001/api/test", timeout=5)
        if response.status_code == 200:
            print("Backend is working locally")
            return True
        else:
            print(f"Backend returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"Backend test failed: {e}")
        return False

def deploy_info():
    """Print deployment information"""
    print("\nDEPLOYMENT OPTIONS")
    print("=" * 50)
    print("\n1. RENDER (Recommended)")
    print("   - Go to https://render.com")
    print("   - Connect GitHub: saurabh30-bit/AccessEdu")
    print("   - Runtime: Python 3")
    print("   - Build: pip install -r requirements.txt")
    print("   - Start: python AccessEdu_Project.py")
    print("   - Env: GEMINI_API_KEY=your_key")
    
    print("\n2. RAILWAY")
    print("   - Go to https://railway.app")
    print("   - Connect GitHub repository")
    print("   - Deploy automatically")
    
    print("\n3. PYTHONANYWHERE")
    print("   - Go to https://pythonanywhere.com")
    print("   - Upload your files")
    print("   - Install requirements")
    print("   - Run the script")
    
    print("\n4. HEROKU")
    print("   - heroku create accessedu-backend")
    print("   - heroku config:set GEMINI_API_KEY=your_key")
    print("   - git push heroku main")

def main():
    print("AccessEdu Backend Deployment Helper")
    print("=" * 50)
    
    if not check_requirements():
        sys.exit(1)
    
    if not test_backend():
        print("Backend not running locally")
        print("   Start with: python AccessEdu_Project.py")
    
    deploy_info()
    
    print("\nENVIRONMENT VARIABLES NEEDED:")
    print("- GEMINI_API_KEY (required)")
    print("- PORT (default: 8000)")
    print("- HOST (default: 0.0.0.0)")
    
    print("\nBackend is ready for deployment!")
    print("See DEPLOYMENT.md for detailed instructions")

if __name__ == "__main__":
    main()
