export interface Flashcard {
  term: string;
  definition: string;
}

export interface LectureResult {
  id: string;
  title: string;
  date: string;
  summary: string[];
  flashcards: Flashcard[];
  mode: 'live' | 'online' | 'youtube';
}

export interface HistoryItem {
  id: string;
  title: string;
  date: string;
}
