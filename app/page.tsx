'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react'


type KeywordsResponse = Record<string, string>

interface SummarizeResponse {
  summary?: string[]
  keywords?: KeywordsResponse
}

export default function AccessEduDashboard() {
  const [transcript, setTranscript] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [complexTerms, setComplexTerms] = useState<KeywordsResponse>({})
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isRestartingRef = useRef(false)

  const startRecording = useCallback(() => {
    if (typeof window === 'undefined') return
    const Win = window as Window & { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }
    const SpeechRecognitionAPI = Win.SpeechRecognition || Win.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      console.error('SpeechRecognition not supported in this browser')
      setError('Speech recognition is not supported in your browser.')
      return
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart
        } else {
          interimTranscript += transcriptPart
        }
      }
      if (finalTranscript) {
        console.log('[SpeechRecognition] Final:', finalTranscript)
        setTranscript((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript).trim())
      }
      if (interimTranscript) {
        console.log('[SpeechRecognition] Interim:', interimTranscript)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('[SpeechRecognition] Error:', event.error, event.message)
      if (event.error === 'no-speech' && !isRestartingRef.current) {
        console.log('[SpeechRecognition] No speech detected, continuing to listen...')
        return
      }
      if (event.error === 'aborted') return
    }

    recognition.onend = () => {
      console.log('[SpeechRecognition] Ended')
      if (isRestartingRef.current || !recognitionRef.current) return
      try {
        recognition.start()
        console.log('[SpeechRecognition] Restarted after end')
      } catch (e) {
        console.log('[SpeechRecognition] Restart failed:', e)
      }
    }

    recognitionRef.current = recognition
    isRestartingRef.current = false
    try {
      recognition.start()
      console.log('[SpeechRecognition] Started')
      setIsRecording(true)
      setError(null)
    } catch (e) {
      console.error('[SpeechRecognition] Start failed:', e)
    }
  }, [])

  const stopRecording = useCallback(() => {
    isRestartingRef.current = true
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      console.log('[SpeechRecognition] Stopped')
    }
    setIsRecording(false)
  }, [])

  useEffect(() => {
    return () => {
      isRestartingRef.current = true
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  async function handleSummarize() {
    if (!transcript.trim()) {
      setError('No transcript to summarize.')
      return
    }

    setIsSummarizing(true)
    setError(null)

    try {
      console.log('[API] Sending summarize request...')
      const res = await fetch('http://localhost:8000/api/summarize-lecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, subject: 'general' }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data: SummarizeResponse = await res.json()
      console.log('[API] Response:', data)

      setKeyPoints(Array.isArray(data.summary) ? data.summary : [])
      setComplexTerms(typeof data.keywords === 'object' && data.keywords ? data.keywords : {})
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      console.error('[API] Error:', e)
      setError(`Network or CORS error: ${msg}`)
      setKeyPoints([])
      setComplexTerms({})
    } finally {
      setIsSummarizing(false)
    }
  }

  const keywordEntries = Object.entries(complexTerms)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">AccessEdu</h1>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isRecording
                ? 'bg-red-500/20 text-red-400 animate-pulse'
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`}
            />
            Recording
          </span>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left column – Live Feed */}
        <section className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-zinc-200">Live Transcript</h2>
          </div>
          <div className="flex-1 min-h-[200px] rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 overflow-y-auto">
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {transcript || (
                <span className="text-zinc-500 italic">Transcript will appear here...</span>
              )}
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => (isRecording ? stopRecording() : startRecording())}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Start Recording
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right column – AI Brain */}
        <section className="w-[400px] flex-shrink-0 flex flex-col border border-zinc-800 rounded-xl bg-zinc-900/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-zinc-200">AI Brain</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <button
              onClick={handleSummarize}
              disabled={isSummarizing || !transcript.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Summarize Lecture
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg p-3">{error}</p>
            )}

            <div>
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Key Bullet Points
              </h3>
              <ul className="space-y-1.5">
                {keyPoints.length ? (
                  keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-2 text-zinc-300 text-sm">
                      <span className="text-amber-400">•</span>
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
