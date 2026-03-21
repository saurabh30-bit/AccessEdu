#!/usr/bin/env python3
"""
Glitch deployment helper for AccessEdu Backend
"""

import os
import json

def create_glitch_package():
    """Create package.json for Glitch"""
    
    package_json = {
        "name": "accessedu-backend",
        "version": "1.0.0",
        "description": "AccessEdu Backend API",
        "main": "AccessEdu_Project.py",
        "scripts": {
            "start": "python AccessEdu_Project.py"
        },
        "dependencies": {
            "express": "^4.18.0"
        },
        "engines": {
            "node": "16.x"
        }
    }
    
    with open('package.json', 'w') as f:
        json.dump(package_json, f, indent=2)
    
    # Create .env file template
    env_template = """# Environment Variables for AccessEdu Backend
PORT=8000
HOST=0.0.0.0
GEMINI_API_KEY=your_gemini_api_key_here
"""
    
    with open('.env', 'w') as f:
        f.write(env_template)
    
    print("Glitch deployment files created!")
    print("\nTo deploy to Glitch:")
    print("1. Go to https://glitch.com")
    print("2. Click 'New Project' > 'Import from GitHub'")
    print("3. Enter: saurabh30-bit/AccessEdu")
    print("4. Set your GEMINI_API_KEY in .env")
    print("5. Your API will be live at: https://your-project-name.glitch.me")

if __name__ == "__main__":
    create_glitch_package()
