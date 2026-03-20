import json
import logging
import os
import re
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from youtube_transcript_api import YouTubeTranscriptApi

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
print("AccessEdu API starting up...")

app = FastAPI(title="AccessEdu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
if GEMINI_KEY == "YOUR_GEMINI_API_KEY":
    logger.warning("GEMINI_API_KEY not set. Set it in env for AI features.")
genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel(
    "gemini-1.5-flash",
    generation_config=genai.GenerationConfig(response_mime_type="application/json"),
)

# --- Pydantic Models ---


class LiveTranscriptRequest(BaseModel):
    transcript: str = Field(..., description="Raw live transcript text")


class YouTubeRequest(BaseModel):
    youtube_url: str = Field(..., description="YouTube video URL")


class Flashcard(BaseModel):
    term: str = Field(..., description="Key term or concept")
    definition: str = Field(..., description="Definition or explanation")


class LectureResult(BaseModel):
    title: str = Field(..., description="Lecture title")
    summary: list[str] = Field(..., description="3-bullet summary")
    flashcards: list[Flashcard] = Field(..., description="Key terminology flashcards")


# --- Helpers ---


def _extract_video_id(url: str) -> Optional[str]:
    patterns = [
        r"(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})",
        r"(?:youtu\.be/)([a-zA-Z0-9_-]{11})",
        r"(?:youtube\.com/embed/)([a-zA-Z0-9_-]{11})",
        r"(?:youtube\.com/v/)([a-zA-Z0-9_-]{11})",
    ]
    for pattern in patterns:
        m = re.search(pattern, url)
        if m:
            return m.group(1)
    return None


def _fetch_transcript(video_id: str) -> str:
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    return " ".join(t["text"] for t in transcript_list).strip()


MAX_TRANSCRIPT_CHARS = 100_000


def _parse_gemini_json(text: str) -> dict:
    raw = text.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```\s*$", "", raw)
    return json.loads(raw)


def _call_gemini(transcript: str) -> dict:
    print(f"Calling Gemini with transcript of length {len(transcript)}...")
    try:
        truncated = transcript[:MAX_TRANSCRIPT_CHARS]
        if len(transcript) > MAX_TRANSCRIPT_CHARS:
            truncated += "\n\n[Transcript truncated for length...]"
        prompt = """You are an expert college professor. Analyze the following lecture transcript.

Produce a JSON object with this exact structure:
{
  "title": "A concise 5-10 word title for the lecture",
  "summary": ["First key point in one sentence.", "Second key point in one sentence.", "Third key point in one sentence."],
  "flashcards": [
    {"term": "Term1", "definition": "Clear definition."},
    {"term": "Term2", "definition": "Clear definition."}
  ]
}

Rules:
- Exactly 3 strings in "summary".
- Include 5-10 flashcards for important terms, concepts, or definitions.
- Output only valid JSON, no markdown or extra text.

Transcript:
"""
        response = model.generate_content(prompt + truncated)
        print("Gemini response received.")
        return _parse_gemini_json(response.text)
    except Exception as e:
        print(f"---!!! GEMINI API CALL FAILED: {e} !!!---")
        # Fallback to mock data
        return {
            "title": "Mock Lecture: Introduction to AI",
            "summary": [
                "AI is a broad field of study focused on creating intelligent systems.",
                "Machine Learning is a subset of AI that focuses on data-driven learning.",
                "Neural Networks are a key technology in modern AI applications."
            ],
            "flashcards": [
                {"term": "Artificial Intelligence", "definition": "The simulation of human intelligence by machines."},
                {"term": "Machine Learning", "definition": "A type of AI that allows software to become more accurate in predicting outcomes."},
                {"term": "Neural Network", "definition": "A series of algorithms that endeavors to recognize underlying relationships in a set of data."}
            ]
        }


# --- Routes ---


@app.get("/api/test")
def test_endpoint():
    return {"status": "ok", "message": "Backend is reachable"}


@app.post("/api/process-live", response_model=LectureResult)
def process_live(req: LiveTranscriptRequest):
    print("--- Received /api/process-live request ---")
    if not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Empty transcript")
    try:
        data = _call_gemini(req.transcript.strip())
        return LectureResult(
            title=data.get("title", "Untitled Lecture"),
            summary=data.get("summary", [])[:3],
            flashcards=[
                Flashcard(term=f["term"], definition=f["definition"])
                for f in data.get("flashcards", [])
                if isinstance(f, dict) and "term" in f and "definition" in f
            ],
        )
    except Exception as e:
        logger.exception("process_live failed")
        raise HTTPException(status_code=500, detail=str(e))


class SummarizeRequest(BaseModel):
    transcript: str = Field(..., description="Raw transcript")
    subject: str = Field(default="general", description="Subject context")


@app.post("/api/summarize-lecture")
def summarize_lecture(req: SummarizeRequest):
    """Legacy endpoint: returns summary + keywords for frontend compatibility."""
    if not req.transcript.strip():
        raise HTTPException(status_code=400, detail="Empty transcript")
    try:
        data = _call_gemini(req.transcript.strip())
        flashcards = data.get("flashcards", [])
        keywords = {}
        for f in flashcards:
            if isinstance(f, dict) and "term" in f and "definition" in f:
                keywords[f["term"]] = f["definition"]
        return {
            "title": data.get("title", "Untitled Lecture"),
            "summary": data.get("summary", [])[:3],
            "keywords": keywords,
        }
    except Exception as e:
        logger.exception("summarize_lecture failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/process-youtube", response_model=LectureResult)
def process_youtube(req: YouTubeRequest):
    video_id = _extract_video_id(req.youtube_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")
    try:
        transcript = _fetch_transcript(video_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transcript unavailable: {e}")
    if not transcript:
        raise HTTPException(status_code=400, detail="No transcript for this video")
    try:
        data = _call_gemini(transcript)
        return LectureResult(
            title=data.get("title", "Untitled Lecture"),
            summary=data.get("summary", [])[:3],
            flashcards=[
            Flashcard(term=f["term"], definition=f["definition"])
            for f in data.get("flashcards", [])
            if isinstance(f, dict) and "term" in f and "definition" in f
        ],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/save-lecture")
def save_lecture(lecture: LectureResult):
    # Mock Supabase save
    safe_id = re.sub(r"[^a-z0-9-]", "", lecture.title[:20].lower().replace(" ", "-"))
    return {"status": "saved", "id": f"lecture-{safe_id or 'untitled'}"}


@app.get("/api/history")
def get_history():
    return [
        {"id": "1", "title": "Introduction to Machine Learning", "date": "2025-03-18"},
        {"id": "2", "title": "Neural Networks Fundamentals", "date": "2025-03-17"},
        {"id": "3", "title": "Data Structures and Algorithms", "date": "2025-03-16"},
    ]


@app.get("/")
def root():
    return {"message": "AccessEdu API", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
