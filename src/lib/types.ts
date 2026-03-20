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
  summary: string[];
  flashcards: Flashcard[];
  quiz?: QuizQuestion[];
  mindMap?: MindMapNode[];
  mode: 'live' | 'online' | 'youtube' | 'file';
  transcript?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
}

export interface AppSettings {
  dyslexiaMode: boolean;
  targetLanguage: string;
  ttsEnabled: boolean;
  theme: 'dark';
}
