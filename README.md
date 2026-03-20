# AccessEdu

> Real-time lecture transcription and AI-powered summarization for accessible education

AccessEdu records live lectures, transcribes speech in real time, and uses AI to generate concise summaries, key bullet points, and flashcards with complex terms defined—making learning more accessible for everyone.

---

## ✨ Features

- **Live IRL Recording** — Speak into your mic; transcription appears in real time using the Web Speech API
- **AI Summarization** — One-click summarization with key points and terminology flashcards (powered by Gemini 1.5 Flash)
- **YouTube Integration** — Paste a YouTube URL; fetch transcripts and process with AI (backend)
- **History Dashboard** — Browse past lectures and saved summaries
- **Save Lectures** — Persist results for later review

---

## 🛠 Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide React |
| Backend  | FastAPI, Python 3.10+ |
| AI       | Google Gemini 1.5 Flash |
| APIs     | Web Speech API, YouTube Transcript API |

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/saurabh30-bit/AccessEdu.git
cd AccessEdu
```

### 2. Set up the backend

```bash
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate   # On Windows: .\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
# Windows (PowerShell):
$env:GEMINI_API_KEY = "your-api-key-here"

# macOS/Linux:
export GEMINI_API_KEY="your-api-key-here"

# Run the backend
python main.py
```

The API runs at **http://localhost:8000** · [API Docs](http://localhost:8000/docs)

### 3. Set up the frontend

In a new terminal:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

> **Note:** Use Chrome or Edge for the best speech recognition experience. Firefox has limited support.

---

## ⚙️ Environment Variables

Create `.env.local` (frontend) or set env vars before running:

| Variable               | Description                    | Default              |
|------------------------|--------------------------------|----------------------|
| `GEMINI_API_KEY`       | Google AI Studio API key       | Required for AI      |
| `NEXT_PUBLIC_API_URL`  | Backend API base URL           | `http://localhost:8000` |

See `.env.example` for a template.

---

## 📡 API Endpoints

| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| POST   | `/api/process-live`        | Process raw transcript → summary + flashcards |
| POST   | `/api/process-youtube`     | Fetch YouTube transcript → process with AI    |
| POST   | `/api/summarize-lecture`   | Legacy: transcript → summary + keywords       |
| POST   | `/api/save-lecture`        | Save a lecture result (mock)                  |
| GET    | `/api/history`             | List past lectures (mock)                     |

---

## 📁 Project Structure

```
AccessEdu/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx              # Main dashboard
│   └── history/
│       └── page.tsx          # History view
├── types/
│   └── speech.d.ts           # Web Speech API types
├── main.py                   # FastAPI backend
├── requirements.txt
├── package.json
└── README.md
```

---

## 📄 License

MIT

---

Built with ❤️ for accessible education.
