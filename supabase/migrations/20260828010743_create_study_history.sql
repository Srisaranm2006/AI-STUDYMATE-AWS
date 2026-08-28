/*
# Create study_history table (single-tenant, no auth)

1. Purpose
   Stores every AI generation the student creates (exam answers, MCQs, revision notes, tutor Q&A)
   so the student can revisit previous study sessions from the History page.

2. New Tables
   - `study_history`
     - `id` (uuid, primary key)
     - `subject` (text, not null) — e.g. "Wireless Communication"
     - `topic` (text, not null) — e.g. "5G Network Slicing"
     - `content_type` (text, not null) — one of: "answer", "mcq", "revision", "tutor"
     - `answer_type` (text, nullable) — "2" | "5" | "13" for exam answers; null otherwise
     - `difficulty` (text, nullable) — "Beginner" | "Intermediate" | "Advanced"; null for tutor
     - `content` (jsonb, not null) — the full generated payload (answer text, MCQ array, revision sections, tutor response)
     - `demo` (boolean, default true) — whether the response came from Demo Mode
     - `created_at` (timestamptz, default now())

3. Indexes
   - `study_history_created_at_idx` on `created_at DESC` — the History page always orders by newest first.

4. Security
   - Enable RLS on `study_history`.
   - This is a single-tenant app with no sign-in screen, so all CRUD is intentionally public/shared
     via the anon key. Policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)`
     because every row is accessible to the app's single user.
*/

CREATE TABLE IF NOT EXISTS study_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  topic text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('answer', 'mcq', 'revision', 'tutor')),
  answer_type text,
  difficulty text,
  content jsonb NOT NULL,
  demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS study_history_created_at_idx ON study_history (created_at DESC);

ALTER TABLE study_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_study_history" ON study_history;
CREATE POLICY "anon_select_study_history" ON study_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_study_history" ON study_history;
CREATE POLICY "anon_insert_study_history" ON study_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_study_history" ON study_history;
CREATE POLICY "anon_update_study_history" ON study_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_study_history" ON study_history;
CREATE POLICY "anon_delete_study_history" ON study_history FOR DELETE
  TO anon, authenticated USING (true);
