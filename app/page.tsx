'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Loader2, Sparkles, Trash2, Save, History } from 'lucide-react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type KeywordsResponse = Record<string, string>

interface SummarizeResponse {
  title?: string
  summary?: string[]
  keywords?: KeywordsResponse
}

export default function AccessEduDashboard() {
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [lectureTitle, setLectureTitle] = useState<string | null>(null)
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [complexTerms, setComplexTerms] = useState<KeywordsResponse>({})
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isRestartingRef = useRef(false)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (transcript) scrollToBottom()
  }, [transcript, scrollToBottom])

  const startRecording = useCallback(() => {
    if (typeof window === 'undefined') return
    const Win = window as Window & { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }
    const SpeechRecognitionAPI = Win.SpeechRecognition || Win.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in your browser. Use Chrome or Edge.')
      return
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) finalTranscript += transcriptPart
      }
      if (finalTranscript) {
        setTranscript((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript).trim())
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' && !isRestartingRef.current) return
      if (event.error === 'aborted') return
    }

    recognition.onend = () => {
      if (isRestartingRef.current || !recognitionRef.current) return
      try {
        recognition.start()
      } catch {
        /* ignore restart errors */
      }
    }

    recognitionRef.current = recognition
    isRestartingRef.current = false
    try {
      recognition.start()
      setIsRecording(true)
      setError(null)
    } catch {
      setError('Failed to start microphone.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    isRestartingRef.current = true
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }, [])

  useEffect(() => {
    return () => {
      isRestartingRef.current = true
      if (recognitionRef.current) recognitionRef.current.abort()
    }
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setLectureTitle(null)
    setKeyPoints([])
    setComplexTerms({})
    setError(null)
    setSaveStatus(null)
  }, [])

  async function handleSummarize() {
    if (!transcript.trim()) {
      setError('No transcript to summarize.')
      return
    }

    setIsSummarizing(true)
    setError(null)
    setSaveStatus(null)

    try {
      const res = await fetch(`${API_BASE}/api/summarize-lecture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, subject: 'general' }),
      })

      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(errBody || `HTTP ${res.status}`)
      }

      const data: SummarizeResponse = await res.json()
      setLectureTitle(data.title ?? null)
      setKeyPoints(Array.isArray(data.summary) ? data.summary : [])
      setComplexTerms(typeof data.keywords === 'object' && data.keywords ? data.keywords : {})
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setError(`Request failed: ${msg}`)
      setKeyPoints([])
      setComplexTerms({})
    } finally {
      setIsSummarizing(false)
    }
  }

  async function handleSave() {
    if (!lectureTitle && !keyPoints.length) {
      setError('Summarize first before saving.')
      return
    }
    setSaveStatus('saving')
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/save-lecture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lectureTitle || 'Untitled Lecture',
          summary: keyPoints,
          flashcards: Object.entries(complexTerms).map(([term, definition]) => ({ term, definition })),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setSaveStatus(data.id ? `Saved as ${data.id}` : 'Saved')
    } catch (e) {
      setSaveStatus(null)
      setError(`Save failed: ${e instanceof Error ? e.message : 'Unknown error'}`)
    }
  }

  const keywordEntries = Object.entries(complexTerms)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-800 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">AccessEdu</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm"
          >
            <History className="w-4 h-4" />
            History
          </Link>
          <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-zinc-800 text-zinc-500'
          }`}
          role="status"
          aria-live="polite"
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`}
          />
          Recording
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 p-4 sm:p-6 overflow-hidden min-h-0">
        <section className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-200">Live Transcript</h2>
            <button
              onClick={clearTranscript}
              disabled={isRecording}
              className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              aria-label="Clear transcript"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
          <div
            className="flex-1 min-h-[180px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto focus-within:ring-2 focus-within:ring-amber-500/50"
            tabIndex={0}
          >
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {transcript || (
                <span className="text-zinc-500 italic">Transcript will appear here as you speak...</span>
              )}
            </p>
            <div ref={transcriptEndRef} />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => (isRecording ? stopRecording() : startRecording())}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500'
              }`}
              aria-pressed={isRecording}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" aria-hidden />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" aria-hidden />
                  Start Recording
                </>
              )}
            </button>
          </div>
        </section>

        <section className="w-full lg:w-[400px] flex-shrink-0 flex flex-col border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden min-h-0">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" aria-hidden />
            <h2 className="text-lg font-semibold text-zinc-200">AI Brain</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleSummarize}
                disabled={isSummarizing || !transcript.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                    AI is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" aria-hidden />
                    Summarize Lecture
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={isSummarizing || (!lectureTitle && !keyPoints.length)}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                <Save className="w-4 h-4" aria-hidden />
                Save
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3" role="alert">
                {error}
              </p>
            )}
            {saveStatus && (
              <p className="text-sm text-emerald-400 bg-emerald-500/10 rounded-lg p-3" role="status">
                {saveStatus === 'saving' ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Saving...
                  </span>
                ) : (
                  saveStatus
                )}
              </p>
            )}

            {lectureTitle && (
              <div>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Title</h3>
                <p className="text-zinc-200 font-medium">{lectureTitle}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Key Bullet Points
              </h3>
              <ul className="space-y-1.5">
                {keyPoints.length ? (
                  keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-zinc-300 text-sm">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 text-sm italic">No points yet</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Complex Terms Defined
              </h3>
              <div className="space-y-2">
                {keywordEntries.length ? (
                  keywordEntries.map(([term, definition]) => (
                    <div
                      key={term}
                      className="rounded-lg bg-zinc-800/50 p-3 border border-zinc-700/50"
                    >
                      <p className="font-medium text-amber-400/90 text-sm">{term}</p>
                      <p className="text-zinc-400 text-sm mt-0.5">{definition}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm italic">No terms defined yet</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
