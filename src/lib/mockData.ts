import { HistoryItem, LectureResult } from './types';

export const mockHistory: HistoryItem[] = [
  { id: '1', title: 'Introduction to Machine Learning', date: '2025-03-18' },
  { id: '2', title: 'Neural Networks Fundamentals', date: '2025-03-17' },
  { id: '3', title: 'Data Structures and Algorithms', date: '2025-03-15' },
  { id: '4', title: 'Advanced React Patterns', date: '2025-03-12' },
];

export const mockLectureResult: LectureResult = {
  id: '123',
  title: 'Introduction to Quantum Computing',
  date: '2025-03-20',
  mode: 'live',
  summary: [
    'Quantum computing uses qubits instead of classical bits, allowing for superposition and entanglement.',
    'Superposition enables qubits to exist in multiple states simultaneously, exponentially increasing processing power.',
    'Entanglement links qubits so the state of one instantly influences another, regardless of distance.',
  ],
  flashcards: [
    { term: 'Qubit', definition: 'The basic unit of quantum information, capable of representing 0, 1, or both simultaneously.' },
    { term: 'Superposition', definition: 'A fundamental principle of quantum mechanics where a physical system exists in multiple states at once.' },
    { term: 'Entanglement', definition: 'A phenomenon where quantum particles become connected such that the state of one particle cannot be described independently of the other.' },
    { term: 'Quantum Supremacy', definition: 'The point where a quantum computer can solve a problem that a classical computer practically cannot.' },
  ],
};

export const mockYoutubeResult: LectureResult = {
  id: 'yt-456',
  title: 'The Future of Artificial Intelligence',
  date: '2025-03-20',
  mode: 'youtube',
  summary: [
    'AI is transitioning from specialized narrow tasks to more generalized problem-solving capabilities.',
    'Ethical considerations and safety guardrails are becoming as important as raw processing power.',
    'The integration of AI into daily hardware will redefine human-computer interaction in the next decade.',
  ],
  flashcards: [
    { term: 'AGI', definition: 'Artificial General Intelligence - AI that can understand, learn, and apply knowledge across any intellectual task.' },
    { term: 'Transformer Model', definition: 'A deep learning architecture that uses self-attention mechanisms to process sequential data.' },
    { term: 'Fine-tuning', definition: 'The process of taking a pre-trained model and further training it on a specific dataset for better accuracy.' },
    { term: 'Hallucination', definition: 'When an AI generates confident but incorrect or nonsensical information.' },
  ],
};
