import type { LectureResult } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function toLectureResult(
  data: { title?: string; summary?: string[]; flashcards?: { term: string; definition: string }[] },
  mode: LectureResult['mode']
): LectureResult {
  const id = `lec_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  const dateISO = new Date().toISOString();
  const summaryBullets = data.summary ?? [];
  const flashcards = data.flashcards ?? [];
  const keyTerms = flashcards;

  return {
    id,
    mode,
    title: data.title ?? 'Untitled Lecture',
    date: dateISO,
    dateISO,
    summary: summaryBullets,
    summaryBullets,
    aiSummary: summaryBullets.join(' ') || 'AI-generated understanding summary.',
    keyTerms,
    flashcards,
  };
}

export async function processLive(transcript: string): Promise<LectureResult> {
  const res = await fetch(`${API_BASE}/api/process-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript: transcript.trim() }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  const data = await res.json();
  return toLectureResult(data, 'live-irl');
}

export async function processYoutube(youtubeUrl: string): Promise<LectureResult> {
  const res = await fetch(`${API_BASE}/api/process-youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ youtube_url: youtubeUrl.trim() }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `API error ${res.status}`);
  }
  const data = await res.json();
  return toLectureResult(data, 'youtube');
}

export async function saveLecture(lecture: LectureResult): Promise<{ ok: boolean; id?: string }> {
  const res = await fetch(`${API_BASE}/api/save-lecture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: lecture.title,
      summary: lecture.summaryBullets,
      flashcards: lecture.flashcards,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return { ok: true, id: data.id };
}

export async function getHistory(): Promise<{ id: string; title: string; date: string }[]> {
  const res = await fetch(`${API_BASE}/api/history`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((h: { id?: string; title?: string; date?: string }) => ({
        id: h.id ?? '',
        title: h.title ?? 'Untitled',
        date: h.date ?? new Date().toISOString().slice(0, 10),
      }))
    : [];
}
