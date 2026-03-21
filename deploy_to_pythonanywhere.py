#!/usr/bin/env python3
"""
Deploy AccessEdu backend to PythonAnywhere
"""

import os
import subprocess
import sys

def create_pythonanywhere_deploy():
    """Create deployment files for PythonAnywhere"""
    
    # Create requirements file for PythonAnywhere
    requirements = """fastapi>=0.109.0
uvicorn[standard]>=0.27.0
pydantic>=2.5.0
google-genai>=1.0.0
python-multipart>=0.0.6
youtube-transcript-api>=0.6.0
python-dotenv>=1.0.0
"""
    
    with open('requirements_pythonanywhere.txt', 'w') as f:
        f.write(requirements)
    
    # Create startup script
    startup_script = """#!/bin/bash
cd /home/yourusername/accessedu
source venv/bin/activate
pip install -r requirements_pythonanywhere.txt
python AccessEdu_Project.py
"""
    
    with open('start.sh', 'w') as f:
        f.write(startup_script)
    
    print("PythonAnywhere deployment files created:")
    print("- requirements_pythonanywhere.txt")
    print("- start.sh")
    print()
    print("Next steps:")
    print("1. Sign up at https://pythonanywhere.com")
    print("2. Upload your files to PythonAnywhere")
    print("3. Create a virtual environment")
    print("4. Install requirements")
    print("5. Set GEMINI_API_KEY environment variable")
    print("6. Run the startup script")

if __name__ == "__main__":
    create_pythonanywhere_deploy()
