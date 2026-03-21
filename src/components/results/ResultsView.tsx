'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GradientBorderCard } from '@/components/ui/gradient-border-card';
import { Skeleton } from '@/components/ui/skeleton';
import Typewriter from '@/components/animations/Typewriter';
import { addLectureToHistory, getLastLecture } from '@/lib/storage';
import { saveLecture } from '@/lib/api';
import type { Flashcard as FlashcardT, LectureResult } from '@/lib/types';

function Flashcard({
  card,
}: {
  card: FlashcardT;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="group h-[180px] w-full rounded-3xl text-left"
      aria-label={`Flashcard: ${card.term}`}
    >
      <div
        className="relative h-full w-full [transform-style:preserve-3d] transition-shadow duration-300 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_30px_120px_-60px_rgba(99,102,241,0.45)]"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative h-full w-full transition-transform duration-600"
          style={{
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
              Term
            </div>
            <div className="mt-2 text-base font-bold text-white">
              {card.term}
            </div>
            <div className="mt-3 text-xs text-slate-300/80">
              Click to flip
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-5 backdrop-blur-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
              Definition
            </div>
            <div className="mt-2 text-sm font-semibold leading-relaxed text-white/95">
              {card.definition}
            </div>
            <div className="mt-4 text-xs text-slate-200/80">
              Click to flip back
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ResultsView() {
  const router = useRouter();
  const [lecture, setLecture] = useState<LectureResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const l = getLastLecture();
    setLecture(l);
  }, []);

  const formattedDate = useMemo(() => {
    if (!lecture) return '';
    try {
      return new Date(lecture.dateISO).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return lecture.dateISO;
    }
  }, [lecture]);

  async function handleSave() {
    if (!lecture || isSaving) return;
    setIsSaving(true);
    try {
      try {
        await saveLecture(lecture);
      } catch {
        /* backend may be down, still save locally */
      }
      addLectureToHistory(lecture);
      setSaved(true);
    } finally {
      setIsSaving(false);
      window.setTimeout(() => setSaved(false), 1600);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200/90 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-indigo-200" />
            Results
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {lecture ? lecture.title : 'Generating…'}
          </h2>
          <div className="mt-2 text-sm text-slate-300/75">
            {lecture ? formattedDate : 'Please start from Dashboard or Live Lecture.'}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button onClick={handleSave} disabled={!lecture || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : saved ? (
              'Saved'
            ) : (
              'Save lecture'
            )}
          </Button>
        </div>
      </div>

      {/* Summary + flashcards */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GradientBorderCard>
            <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                3-point understanding recap
              </div>
              <div className="mt-4 space-y-3">
                {!lecture ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  lecture.summaryBullets.slice(0, 3).map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-200" />
                      <div className="text-sm font-semibold leading-relaxed text-white/95">
                        {b}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </GradientBorderCard>

          <div className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  AI Summary (typing)
                </div>
                <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  {!lecture ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (
                    <Typewriter
                      key={lecture.id}
                      text={lecture.aiSummary}
                      speedMs={12}
                      startDelayMs={220}
                      className="text-sm leading-relaxed text-slate-100/90"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                    Flashcards
                  </div>
                  <div className="mt-2 text-lg font-bold text-white">
                    Flip to memorize + apply
                  </div>
                </div>
                <div className="text-xs text-slate-300/75">
                  {lecture ? `${lecture.flashcards.length} cards` : ''}
                </div>
              </div>

              {!lecture ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Skeleton className="h-[180px]" />
                  <Skeleton className="h-[180px]" />
                  <Skeleton className="h-[180px]" />
                  <Skeleton className="h-[180px]" />
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {lecture.flashcards.map((c) => (
                    <Flashcard key={c.term} card={c} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

