import type {
  AiResponse,
  AnswerResult,
  AnswerType,
  ChatMessage,
  ContentType,
  Difficulty,
  McqResult,
  RevisionResult,
  TutorResult,
} from './types';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-studymate`;
const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function call<T>(payload: Record<string, unknown>): Promise<{ data: T; demo: boolean }> {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const json: AiResponse<T> = await res.json();
  if (!json.ok || !json.data) {
    throw new Error(json.error || 'AI generation failed');
  }
  return { data: json.data, demo: !!json.demo };
}

export interface AnswerParams {
  subject: string;
  topic: string;
  answerType: AnswerType;
  difficulty: Difficulty;
}

export function generateAnswer(p: AnswerParams) {
  return call<AnswerResult>({
    action: 'answer',
    subject: p.subject,
    topic: p.topic,
    answerType: p.answerType,
    difficulty: p.difficulty,
  });
}

export interface McqParams {
  subject: string;
  topic: string;
  count: number;
  difficulty: Difficulty;
}

export function generateMcq(p: McqParams) {
  return call<McqResult>({
    action: 'mcq',
    subject: p.subject,
    topic: p.topic,
    count: p.count,
    difficulty: p.difficulty,
  });
}

export interface RevisionParams {
  subject: string;
  topic: string;
}

export function generateRevision(p: RevisionParams) {
  return call<RevisionResult>({
    action: 'revision',
    subject: p.subject,
    topic: p.topic,
  });
}

export interface TutorParams {
  question: string;
  history: ChatMessage[];
}

export function askTutor(p: TutorParams) {
  return call<TutorResult>({
    action: 'tutor',
    question: p.question,
    history: p.history,
  });
}

export type { ContentType };
