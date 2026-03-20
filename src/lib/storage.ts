import type { HistoryLecture, LectureResult } from '@/lib/types';

const LAST_KEY = 'accessedu:lastLecture';
const HISTORY_KEY = 'accessedu:history';
const LECTURE_RESULT_KEY_PREFIX = 'accessedu:lecture:';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function setLastLecture(lecture: LectureResult) {
  writeJson(LAST_KEY, lecture);
}

export function getLastLecture(): LectureResult | null {
  if (typeof window === 'undefined') return null;
  return readJson<LectureResult | null>(LAST_KEY, null);
}

export function getHistoryLectures(): HistoryLecture[] {
  return readJson<HistoryLecture[]>(HISTORY_KEY, []);
}

export function addLectureToHistory(lecture: LectureResult): HistoryLecture[] {
  const existing = getHistoryLectures();
  // Also persist full results so "View Details" can load the same lecture later.
  writeJson(LECTURE_RESULT_KEY_PREFIX + lecture.id, lecture);
  const next: HistoryLecture = {
    id: lecture.id,
    title: lecture.title,
    dateISO: lecture.dateISO,
    mode: lecture.mode,
  };
  // Dedupe by lecture id
  const deduped = existing.filter((x) => x.id !== next.id);
  const merged = [next, ...deduped].slice(0, 24);
  writeJson(HISTORY_KEY, merged);
  return merged;
}

export function getLectureResultById(
  id: string
): LectureResult | null {
  return readJson<LectureResult | null>(
    LECTURE_RESULT_KEY_PREFIX + id,
    null
  );
}

