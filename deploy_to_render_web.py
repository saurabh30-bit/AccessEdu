#!/usr/bin/env python3
"""
Deploy AccessEdu Backend to Render.com via web interface
"""

import webbrowser
import time

def deploy_to_render():
    """Open Render.com for deployment"""
    
    print("Opening Render.com for backend deployment...")
    print("Follow these steps:")
    print("1. Sign up/login to Render.com")
    print("2. Click 'New' > 'Web Service'")
    print("3. Connect GitHub: saurabh30-bit/AccessEdu")
    print("4. Use these settings:")
    print("   - Name: accessedu-backend")
    print("   - Runtime: Python")
    print("   - Build Command: pip install -r requirements.txt")
    print("   - Start Command: python AccessEdu_Project.py")
    print("   - Instance Type: Free")
    print("5. Add Environment Variable:")
    print("   - GEMINI_API_KEY: your_gemini_api_key")
    print("6. Click 'Create Web Service'")
    print("7. Wait for deployment (2-3 minutes)")
    print("8. Your API will be live!")
    
    # Open Render.com
    time.sleep(2)
    webbrowser.open("https://render.com")
    
    print("\nDeployment instructions opened in browser!")
    print("Your backend will be deployed at: https://accessedu-backend.onrender.com")

if __name__ == "__main__":
    deploy_to_render()
