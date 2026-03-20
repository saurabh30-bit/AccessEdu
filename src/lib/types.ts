export type Flashcard = {
  term: string;
  definition: string;
};

export type KeyTerm = {
  term: string;
  definition: string;
};

export type LectureResult = {
  id: string;
  mode: 'live-irl' | 'online' | 'youtube';
  title: string;
  dateISO: string;
  summaryBullets: string[];
  aiSummary: string;
  keyTerms: KeyTerm[];
  flashcards: Flashcard[];
};

export type HistoryLecture = {
  id: string;
  title: string;
  dateISO: string;
  mode: LectureResult['mode'];
};

