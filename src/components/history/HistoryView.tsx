'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientBorderCard } from '@/components/ui/gradient-border-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getHistoryLectures,
  getLectureResultById,
  setLastLecture,
} from '@/lib/storage';
import { getHistory } from '@/lib/api';
import type { HistoryLecture, LectureResult } from '@/lib/types';
import { buildMockResult } from '@/lib/mockData';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}

function HistoryCard({
  lecture,
  onView,
  loading,
}: {
  lecture: HistoryLecture;
  onView: () => void;
  loading?: boolean;
}) {
  return (
    <GradientBorderCard className="h-full">
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-10 w-[60%]" />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-300/60">
                  <Clock className="h-3.5 w-3.5" />
                  {lecture.mode === 'live-irl'
                    ? 'Live IRL'
                    : lecture.mode === 'online'
                    ? 'Online'
                    : 'YouTube'}
                </div>
                <div className="mt-3 truncate text-base font-bold text-white">
                  {lecture.title}
                </div>
                <div className="mt-1 text-sm text-slate-300/80">
                  {formatDate(lecture.dateISO)}
                </div>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                <Sparkles className="h-4 w-4 text-indigo-200" />
              </div>
            </div>

            <div className="mt-5">
              <Button onClick={onView} className="w-full justify-center">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </div>
          </>
        )}
      </div>
    </GradientBorderCard>
  );
}

export default function HistoryView() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryLecture[] | null>(null);

  const seedHistory = useMemo<HistoryLecture[]>(
    () => [
      {
        id: 'seed_1',
        title: 'Understanding Physics Through Metaphors',
        dateISO: '2026-03-16T10:10:00.000Z',
        mode: 'live-irl',
      },
      {
        id: 'seed_2',
        title: 'Online Study Session: Core Mechanism Builder',
        dateISO: '2026-03-11T10:10:00.000Z',
        mode: 'online',
      },
      {
        id: 'seed_3',
        title: 'YouTube Breakdown: Assumption Check Mastery',
        dateISO: '2026-03-05T10:10:00.000Z',
        mode: 'youtube',
      },
      {
        id: 'seed_4',
        title: 'Live IRL Lecture: Example Mapping Sprint',
        dateISO: '2026-02-27T10:10:00.000Z',
        mode: 'live-irl',
      },
      {
        id: 'seed_5',
        title: 'Online: Transfer Thinking Drills',
        dateISO: '2026-02-21T10:10:00.000Z',
        mode: 'online',
      },
      {
        id: 'seed_6',
        title: 'YouTube: Common Pitfall Fixes',
        dateISO: '2026-02-15T10:10:00.000Z',
        mode: 'youtube',
      },
    ],
    []
  );

  useEffect(() => {
    const local = getHistoryLectures();
    getHistory().then((apiItems) => {
      const fromApi: HistoryLecture[] = apiItems.map((a) => ({
        id: a.id,
        title: a.title,
        dateISO: a.date,
        mode: 'live-irl' as const,
      }));
      const merged = [...fromApi, ...local.filter((l) => !fromApi.some((a) => a.id === l.id))].slice(0, 24);
      setHistory(merged.length ? merged : seedHistory);
    }).catch(() => {
      setHistory(local.length ? local : seedHistory);
    });
  }, [seedHistory]);

  async function handleView(lecture: HistoryLecture) {
    // If this lecture was saved for real, load its full result.
    const saved = getLectureResultById(lecture.id);
    const full: LectureResult = saved
      ? saved
      : buildMockResult({
          mode: lecture.mode,
          title: lecture.title,
          dateISO: lecture.dateISO,
        });
    setLastLecture(full);
    router.push('/results');
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200/90 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-indigo-200" />
            History
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your recent understanding sessions
          </h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Tap any card to review results, flip flashcards, and study quickly.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history === null ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full">
                <HistoryCard
                  lecture={seedHistory[0]}
                  loading
                />
              </div>
            ))}
          </>
        ) : (
          history.map((h) => (
            <HistoryCard key={h.id} lecture={h} onView={() => handleView(h)} />
          ))
        )}
      </div>
    </div>
  );
}

