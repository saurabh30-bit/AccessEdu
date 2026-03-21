'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic,
  MicOff,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GradientBorderCard } from '@/components/ui/gradient-border-card';
import { Skeleton } from '@/components/ui/skeleton';
import Typewriter from '@/components/animations/Typewriter';
import {
  generateResultsFromLive,
  getTranscriptTokens,
  startLiveRecording,
} from '@/lib/mockApi';
import { DEFAULT_KEY_TERMS } from '@/lib/mockData';
import { setLastLecture } from '@/lib/storage';
import type { LectureResult } from '@/lib/types';

function formatTranscriptLine(line: string) {
  return line.replace(/\s+/g, ' ').trim();
}

const Win = typeof window !== 'undefined' ? (window as Window & { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }) : null;
const SpeechRecognitionAPI = Win?.SpeechRecognition || Win?.webkitSpeechRecognition;

export default function LiveLecture() {
  const router = useRouter();
  const params = useSearchParams();

  const mode = (params.get('mode') ?? 'live-irl') as LectureResult['mode'];
  const autostart = params.get('autostart') === '1';
  const useRealMic = mode === 'live-irl' && !!SpeechRecognitionAPI;

  const tokens = useMemo(() => getTranscriptTokens(mode), [mode]);

  const aiChunks = useMemo(() => {
    const base = [
      'Listening to the lecture… extracting structure in real time.',
      'Updating assumptions and highlighting transitions.',
      'Mapping definitions to examples as they appear.',
      'Preparing key terms + flashcards you can study immediately.',
    ];
    if (mode === 'online') {
      return [
        'Connected to the session—aligning the narrative flow.',
        'Tracking "therefore / however / key idea" moments.',
        'Turning explanations into a crisp, understanding-first summary.',
        'Generating flashcards for quick recall and transfer thinking.',
      ];
    }
    return base;
  }, [mode]);

  const [isRecording, setIsRecording] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [aiTarget, setAiTarget] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const tokenIndexRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRestartingRef = useRef(false);

  const startRealMic = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setMicError('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        }
      }
      if (final) {
        const line = formatTranscriptLine(final);
        if (line) setTranscriptLines((prev) => [...prev, line]);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'no-speech' && !isRestartingRef.current) return;
      if (e.error === 'aborted') return;
    };

    recognition.onend = () => {
      if (isRestartingRef.current || !recognitionRef.current) return;
      try {
        recognition.start();
      } catch {
        /* ignore */
      }
    };

    recognitionRef.current = recognition;
    isRestartingRef.current = false;
    try {
      recognition.start();
      setIsRecording(true);
      setMicError(null);
    } catch {
      setMicError('Failed to start microphone.');
    }
  }, []);

  const stopRealMic = useCallback(() => {
    isRestartingRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      isRestartingRef.current = true;
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  async function start() {
    setIsGenerating(false);
    setMicError(null);
    if (useRealMic) {
      startRealMic();
      setTranscriptLines([]);
      setAiTarget(aiChunks[0] ?? '');
      return;
    }
    tokenIndexRef.current = 0;
    setTranscriptLines([]);
    setAiTarget(aiChunks[0] ?? '');
    setIsRecording(true);
    await startLiveRecording();
  }

  function stop() {
    if (useRealMic) {
      stopRealMic();
      return;
    }
    setIsRecording(false);
  }

  useEffect(() => {
    if (!autostart) return;
    if (isRecording) return;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart, mode]);

  useEffect(() => {
    if (!isRecording || useRealMic) return;

    const interval = window.setInterval(() => {
      const i = tokenIndexRef.current;
      if (i >= tokens.length) {
        window.clearInterval(interval);
        setIsRecording(false);
        return;
      }

      const nextLine = formatTranscriptLine(tokens[i]);
      tokenIndexRef.current = i + 1;

      setTranscriptLines((prev) => [...prev, nextLine]);

      const progress = i / Math.max(1, tokens.length - 1);
      const chunkIdx = Math.min(
        aiChunks.length - 1,
        Math.floor(progress * aiChunks.length)
      );
      if (aiChunks[chunkIdx]) setAiTarget(aiChunks[chunkIdx]);
    }, 980);

    return () => window.clearInterval(interval);
  }, [isRecording, tokens, aiChunks, useRealMic]);

  useEffect(() => {
    if (useRealMic && isRecording) {
      const idx = Math.min(
        Math.floor((transcriptLines.length / Math.max(transcriptLines.length, 1)) * aiChunks.length),
        aiChunks.length - 1
      );
      if (aiChunks[idx]) setAiTarget(aiChunks[idx]);
    }
  }, [useRealMic, isRecording, transcriptLines.length, aiChunks]);

  const transcriptText = transcriptLines.join(' ');
  const canGenerate = (useRealMic ? transcriptText.trim().length > 30 : transcriptLines.length > 2) && !isGenerating;

  async function handleGenerate() {
    if (!canGenerate) return;
    setIsGenerating(true);
    try {
      const lecture = await generateResultsFromLive(mode, transcriptText, {
        title:
          mode === 'online'
            ? 'Online Lecture'
            : 'Live IRL Lecture',
      });
      setLastLecture(lecture);
      router.push('/results');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
            Live Lecture
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {mode === 'online'
              ? 'Online Lecture Mode'
              : 'Live IRL Lecture Mode'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {isRecording ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-100">
              <span className="h-2 w-2 rounded-full bg-indigo-300 animate-ping" />
              Recording + Equalizing
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200/90">
              <Sparkles className="h-4 w-4 text-purple-200" />
              Ready
            </span>
          )}

          <Button
            variant={isRecording ? 'secondary' : 'default'}
            onClick={() => (isRecording ? stop() : start())}
            disabled={isGenerating}
          >
            {isRecording ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {micError && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {micError}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <CardTitle>Real-time Transcript</CardTitle>
                <div className="flex items-center gap-2">
                  <div
                    className={[
                      'grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10',
                      isRecording ? 'animate-recording-pulse' : '',
                    ].join(' ')}
                  >
                    <Mic className="h-5 w-5 text-indigo-200" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  {isRecording
                    ? (useRealMic ? 'Listening to your microphone…' : 'Streaming…')
                    : 'Click start to equalize'}
                </div>
                <div className="text-xs text-slate-300/70">
                  {transcriptLines.length} segments
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur-xl">
                <div
                  className="max-h-[340px] space-y-3 overflow-auto pr-2"
                  aria-label="Transcript streaming box"
                >
                  {transcriptLines.length === 0 ? (
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    transcriptLines.map((line, idx) => (
                      <p
                        key={`${idx}_${line.slice(0, 8)}`}
                        className="text-sm leading-relaxed text-slate-100/90"
                      >
                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-xl bg-white/5 text-[10px] font-bold text-slate-300/80">
                          {idx + 1}
                        </span>
                        {line}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-300/70">
                  {isRecording
                    ? useRealMic
                      ? 'Speak clearly. When done, click Stop then Generate Results.'
                      : 'AI summary updates alongside the transcript.'
                    : 'Start again to stream a new session.'}
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      Generate Results
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <GradientBorderCard className="h-full">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                    AI Summary
                  </div>
                  <div className="mt-2 text-base font-semibold text-white">
                    Understanding-first narration
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200/90">
                  {isRecording ? 'Live' : 'Idle'}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                {isGenerating ? (
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-[92%]" />
                    <Skeleton className="h-7 w-[80%]" />
                  </div>
                ) : (
                  <Typewriter
                    text={aiTarget}
                    speedMs={14}
                    startDelayMs={120}
                    className="text-sm leading-relaxed text-slate-100/90"
                  />
                )}
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  Key Terms & Definitions
                </div>
                <div className="mt-3 space-y-3">
                  {DEFAULT_KEY_TERMS.slice(0, 4).map((t) => (
                    <div
                      key={t.term}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/8"
                    >
                      <div className="text-sm font-semibold text-white">
                        {t.term}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-slate-300/80">
                        {t.definition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-200/70">
                  Tip
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-100/90">
                  {useRealMic
                    ? 'Speak naturally. When done, click Stop, then Generate Results.'
                    : 'Stop after the core explanation lands, then generate results for flashcards and revision.'}
                </div>
              </div>
            </div>
          </GradientBorderCard>
        </div>
      </div>
    </div>
  );
}
