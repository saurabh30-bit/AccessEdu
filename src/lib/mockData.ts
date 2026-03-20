import { HistoryItem, LectureResult } from './types';

export const mockHistory: HistoryItem[] = [
  { id: '1', title: 'Introduction to Machine Learning', date: '2025-03-18' },
  { id: '2', title: 'Neural Networks Fundamentals', date: '2025-03-17' },
  { id: '3', title: 'Data Structures and Algorithms', date: '2025-03-15' },
  { id: '4', title: 'Advanced React Patterns', date: '2025-03-12' },
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
  quiz: sharedQuiz,
  mindMap: sharedMindMap as any,
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
  quiz: [
    {
      id: 'aq1',
      question: 'What does AGI stand for?',
      options: ['Artificial General Intelligence', 'Automated Graphic Interface', 'Advanced Global Information', 'Active Generated Insight'],
      correctAnswer: 0,
      explanation: 'AGI refers to a hypothetical AI that can perform any intellectual task a human can.'
    }
  ],
  mindMap: [
    { id: 'root', label: 'Future AI', type: 'topic', connections: ['c1', 'c2'] },
    { id: 'c1', label: 'Ethics', type: 'concept', connections: [] },
    { id: 'c2', label: 'Generalization', type: 'concept', connections: [] },
  ] as any,
};
