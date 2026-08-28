export type AnswerType = '2' | '5' | '13';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ContentType = 'answer' | 'mcq' | 'revision' | 'tutor';

export interface AnswerSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface AnswerResult {
  title: string;
  sections: AnswerSection[];
}

export interface McqQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: string;
}

export interface McqResult {
  questions: McqQuestion[];
  total: number;
}

export interface RevisionResult {
  title: string;
  sections: AnswerSection[];
}

export interface TutorResult {
  reply: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiResponse<T> {
  ok: boolean;
  demo?: boolean;
  data?: T;
  error?: string;
}
