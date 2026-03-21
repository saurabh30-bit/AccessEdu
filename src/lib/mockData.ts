import { HistoryItem, LectureResult } from './types';

export const mockHistory: HistoryItem[] = [
  { id: '1', title: 'Introduction to Machine Learning', dateISO: '2025-03-18', mode: 'live-irl' },
  { id: '2', title: 'Neural Networks Fundamentals', dateISO: '2025-03-17', mode: 'live-irl' },
  { id: '3', title: 'Data Structures and Algorithms', dateISO: '2025-03-15', mode: 'live-irl' },
  { id: '4', title: 'Advanced React Patterns', dateISO: '2025-03-12', mode: 'live-irl' },
];

const sharedQuiz = [
  {
    id: 'q1',
    question: 'What is the primary difference between a qubit and a classical bit?',
    options: ['Qubits are faster', 'Qubits can exist in multiple states simultaneously', 'Classical bits are smaller', 'There is no difference'],
    correctAnswer: 1,
    explanation: 'Superposition allows qubits to represent 0, 1, or both at the same time, unlike classical bits which are strictly 0 or 1.'
  },
  {
    id: 'q2',
    question: 'Who coined the term "spooky action at a distance"?',
    options: ['Isaac Newton', 'Richard Feynman', 'Albert Einstein', 'Stephen Hawking'],
    correctAnswer: 2,
    explanation: 'Einstein used this phrase to describe his discomfort with the concept of quantum entanglement.'
  }
];

const sharedMindMap = [
  { id: 'root', label: 'Quantum Computing', type: 'topic', connections: ['c1', 'c2'] },
  { id: 'c1', label: 'Superposition', type: 'concept', connections: ['d1'] },
  { id: 'c2', label: 'Entanglement', type: 'concept', connections: ['d2'] },
  { id: 'd1', label: 'Simultaneous States', type: 'detail', connections: [] },
  { id: 'd2', label: 'Particle Connection', type: 'detail', connections: [] },
];

export function buildMockResult({
  mode,
  title,
  dateISO,
}: { mode: LectureResult["mode"]; title: string; dateISO: string }): LectureResult {
  const summary = [
    'This is a mock summary point 1.',
    'This is a mock summary point 2.',
  ];
  const flashcards = [
    { term: 'Mock Term 1', definition: 'Mock Definition 1' },
    { term: 'Mock Term 2', definition: 'Mock Definition 2' },
  ];
  
  return {
    id: `${mode}-${Date.now()}`,
    title,
    date: dateISO,
    dateISO,
    mode,
    summary,
    summaryBullets: summary,
    aiSummary: summary.join(' ') || 'AI-generated understanding summary.',
    keyTerms: flashcards,
    flashcards,
    quiz: sharedQuiz,
    mindMap: sharedMindMap as any,
  };
}

export const mockLectureResult: LectureResult = buildMockResult({
  mode: 'live',
  title: 'Introduction to Quantum Computing',
  dateISO: '2025-03-20T10:00:00.000Z',
});

export const mockYoutubeResult: LectureResult = buildMockResult({
  mode: 'youtube',
  title: 'The Future of Artificial Intelligence',
  dateISO: '2025-03-20T10:00:00.000Z',
});

export const DEFAULT_KEY_TERMS = [
  { term: 'Mock Term 1', definition: 'Mock Definition 1' },
  { term: 'Mock Term 2', definition: 'Mock Definition 2' },
];

export const MOCK_TRANSCRIPT_TOKENS = {
  'live-irl': ['This', 'is', 'a', 'mock', 'live', 'transcript'],
  'online': ['This', 'is', 'a', 'mock', 'online', 'transcript'],
  'youtube': ['This', 'is', 'a', 'mock', 'YouTube', 'transcript'],
};
