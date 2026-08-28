import { supabase } from './supabase';
import type { ContentType } from './types';
import type { StudyHistoryRow } from './supabase';

export type { StudyHistoryRow };

export async function saveHistory(
  subject: string,
  topic: string,
  contentType: ContentType,
  content: unknown,
  opts?: { answerType?: string | null; difficulty?: string | null; demo?: boolean }
): Promise<StudyHistoryRow | null> {
  const { data, error } = await supabase
    .from('study_history')
    .insert({
      subject,
      topic,
      content_type: contentType,
      content,
      answer_type: opts?.answerType ?? null,
      difficulty: opts?.difficulty ?? null,
      demo: opts?.demo ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('saveHistory error', error);
    return null;
  }
  return data as StudyHistoryRow;
}

export async function fetchHistory(limit = 50): Promise<StudyHistoryRow[]> {
  const { data, error } = await supabase
    .from('study_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchHistory error', error);
    return [];
  }
  return (data ?? []) as StudyHistoryRow[];
}

export async function deleteHistory(id: string): Promise<boolean> {
  const { error } = await supabase.from('study_history').delete().eq('id', id);
  if (error) console.error('deleteHistory error', error);
  return !error;
}
