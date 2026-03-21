export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'topic' | 'concept' | 'detail';
  connections: string[];
}

export interface LectureResult {
  id: string;
  title: string;
  date: string;
  dateISO: string;
  summary: string[];
  summaryBullets: string[];
  aiSummary: string;
  keyTerms: Flashcard[];
  flashcards: Flashcard[];
  quiz?: QuizQuestion[];
  mindMap?: MindMapNode[];
  mode: 'live' | 'live-irl' | 'online' | 'youtube' | 'file';
  transcript?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  dateISO: string;
  mode: LectureResult["mode"];
}

export interface AppSettings {
  dyslexiaMode: boolean;
  targetLanguage: string;
  ttsEnabled: boolean;
  theme: 'dark';
}
