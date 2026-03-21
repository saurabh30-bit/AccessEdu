#!/usr/bin/env python3
"""
Direct deployment to PythonAnywhere
"""

import subprocess
import sys

def deploy_backend():
    """Deploy backend to PythonAnywhere"""
    
    print("DEPLOYING ACCESSDU BACKEND TO PYTHONANYWHERE")
    print("=" * 60)
    
    # Create a simplified version for PythonAnywhere
    simplified_backend = """import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="AccessEdu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AccessEdu API", "docs": "/docs"}

@app.get("/api/test")
def test_endpoint():
    return {"status": "ok", "message": "Backend is reachable"}

@app.get("/api/history")
def get_history():
    return [
        {"id": "1", "title": "Introduction to Machine Learning", "date": "2025-03-18"},
        {"id": "2", "title": "Neural Networks Fundamentals", "date": "2025-03-17"},
    ]

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
"""
    
    with open('simple_backend.py', 'w') as f:
        f.write(simplified_backend)
    
    print("Created simplified backend for PythonAnywhere")
    print("\nDEPLOYMENT INSTRUCTIONS:")
    print("1. Go to https://www.pythonanywhere.com")
    print("2. Create a free account")
    print("3. Go to Files > Upload a file")
    print("4. Upload: simple_backend.py")
    print("5. Go to Bash console")
    print("6. Run these commands:")
    print("   pip install fastapi uvicorn")
    print("   python simple_backend.py")
    print("7. Your API will be live!")
    print("\nYour backend URL will be:")
    print("   http://yourusername.pythonanywhere.com:8000")
    print("   API docs: http://yourusername.pythonanywhere.com:8000/docs")

if __name__ == "__main__":
    deploy_backend()
