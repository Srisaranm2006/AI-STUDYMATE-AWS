import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type StudyHistoryRow = {
  id: string;
  subject: string;
  topic: string;
  content_type: 'answer' | 'mcq' | 'revision' | 'tutor';
  answer_type: string | null;
  difficulty: string | null;
  content: unknown;
  demo: boolean;
  created_at: string;
};
