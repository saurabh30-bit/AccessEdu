import os
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
