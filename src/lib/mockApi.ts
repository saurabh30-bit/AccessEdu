import type { LectureResult } from '@/lib/types';
import { processLive, processYoutube } from '@/lib/api';
import {
  buildMockResult,
  MOCK_TRANSCRIPT_TOKENS,
} from '@/lib/mockData';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeTitleFromYoutubeLink(link: string) {
  const trimmed = link.trim();
  if (!trimmed) return 'YouTube Lecture';
  try {
    const url = new URL(trimmed);
    const slug = url.pathname.split('/').filter(Boolean).pop();
    return slug ? `YouTube: ${slug}` : 'YouTube Lecture';
  } catch {
    return 'YouTube Lecture';
  }
}

export async function connectOnlineSession(): Promise<{
  sessionId: string;
}> {
  await wait(300);
  return { sessionId: `sess_${Math.random().toString(16).slice(2)}` };
}

export async function startLiveRecording(): Promise<{ ok: true }> {
  await wait(200);
  return { ok: true };
}

export function getTranscriptTokens(mode: LectureResult['mode']): string[] {
  if (mode === 'live-irl') return [...MOCK_TRANSCRIPT_TOKENS['live-irl']];
  if (mode === 'online') return [...MOCK_TRANSCRIPT_TOKENS['online']];
  return [...MOCK_TRANSCRIPT_TOKENS.youtube];
}

export async function analyzeYoutube(
  youtubeLink: string
): Promise<LectureResult> {
  try {
    return await processYoutube(youtubeLink);
  } catch {
    await wait(800);
    const title = safeTitleFromYoutubeLink(youtubeLink);
    return buildMockResult({ mode: 'youtube', title });
  }
}

export async function generateResultsFromLive(
  mode: LectureResult['mode'],
  transcriptSoFar: string,
  opts: { title?: string } = {}
): Promise<LectureResult> {
  const hasTranscript = transcriptSoFar.trim().length > 20;
  if (hasTranscript) {
    try {
      return await processLive(transcriptSoFar.trim());
    } catch {
      /* fall through to mock */
    }
  }
  await wait(1200);
  const title = opts.title ?? (mode === 'online' ? 'Online Lecture' : 'Live IRL Lecture');
  return buildMockResult({ mode, title: `${title}${transcriptSoFar ? ' – Session' : ''}` });
}

export async function saveLectureToHistory(
  lecture: LectureResult
): Promise<{ ok: true }> {
  void lecture;
  await wait(200);
  return { ok: true };
}
