import type { Flashcard, KeyTerm, LectureResult } from '@/lib/types';

export const DEFAULT_KEY_TERMS: KeyTerm[] = [
  {
    term: 'Core Mechanism',
    definition:
      'A repeated pattern that explains how something works end-to-end, not just individual steps.',
  },
  {
    term: 'Assumption Check',
    definition:
      'The quick sanity review that confirms whether the current explanation matches the problem’s constraints.',
  },
  {
    term: 'Example Mapping',
    definition:
      'Pairing each definition with a concrete example so recall becomes automatic.',
  },
  {
    term: 'Transfer Thinking',
    definition:
      'Using the concept in a new context to prove understanding (not just recognition).',
  },
  {
    term: 'Common Pitfall',
    definition:
      'The most frequent misunderstanding that the explanation tries to eliminate early.',
  },
];

export const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    term: 'Core Mechanism',
    definition:
      'The “through-line” idea that makes the lecture make sense as one connected story.',
  },
  {
    term: 'Assumption Check',
    definition:
      'A deliberate check that prevents you from building on the wrong premise.',
  },
  {
    term: 'Example Mapping',
    definition:
      'Turning definitions into recall by attaching them to vivid examples.',
  },
  {
    term: 'Transfer Thinking',
    definition:
      'Re-applying knowledge in a different scenario to verify real understanding.',
  },
  {
    term: 'Common Pitfall',
    definition:
      'The specific misconception learners tend to make, identified and corrected.',
  },
];

export const MOCK_TRANSCRIPT_TOKENS = {
  'live-irl': [
    'Today we are going to transform raw lecture audio into actionable understanding.',
    'First, identify the core mechanism behind the topic.',
    'Next, check the assumptions so we don’t drift from the actual question.',
    'Then, map definitions to examples as they appear in the lecture.',
    'Finally, practice transfer thinking by applying the concept in a new context.',
    'If you get stuck, look for the common pitfall and correct it early.',
  ],
  online: [
    'When the speaker explains step-by-step, we extract the structure and highlight the through-line.',
    'We also track transitions such as “therefore,” “however,” and “the key idea is.”',
    'As definitions arrive, we attach them to the examples the lecturer uses.',
    'This creates a summary that updates while the lecture is still happening.',
    'You can then convert the result into flashcards for quick spaced repetition.',
  ],
  youtube: [
    'Let’s break down this video into the ideas you can actually use.',
    'We’ll compress the lesson into three bullet insights and a crisp AI summary.',
    'Then we’ll generate key terms with definitions so you can study fast.',
    'Finally, we’ll provide flashcards you can flip through in seconds.',
  ],
} as const;

export function buildMockResult(input: {
  mode: LectureResult['mode'];
  title: string;
  dateISO?: string;
}): LectureResult {
  const dateISO = input.dateISO ?? new Date().toISOString();
  const id = `lec_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  const modePrefix =
    input.mode === 'live-irl'
      ? 'Live IRL'
      : input.mode === 'online'
      ? 'Online Session'
      : 'YouTube';

  const summaryBullets = [
    `Extracted the core mechanism and turned it into a clear explanation for ${input.title}.`,
    'Identified assumptions, common pitfalls, and example mappings so you can spot confusion instantly.',
    'Generated key terms + flip cards designed for fast recall and transfer thinking.',
  ];

  const aiSummary =
    `${modePrefix} analysis created an understanding-focused summary. ` +
    'You should be able to explain the concept in your own words, apply it to a new example, and avoid the most common pitfalls.';

  return {
    id,
    mode: input.mode,
    title: input.title,
    dateISO,
    summaryBullets,
    aiSummary,
    keyTerms: DEFAULT_KEY_TERMS,
    flashcards: DEFAULT_FLASHCARDS,
  };
}

