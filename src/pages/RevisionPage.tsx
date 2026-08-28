import { useState } from 'react';
import { Zap, Sparkles, Copy, Save, Eraser } from 'lucide-react';
import type { Difficulty } from '@/lib/types';
import { generateRevision } from '@/lib/ai';
import { saveHistory } from '@/lib/history';
import { useToast } from '@/lib/toast';
import { AnswerContent } from '@/components/ui/AnswerContent';
import { LoadingDots, ErrorState, EmptyState, DemoBadge } from '@/components/ui/States';

export function RevisionPage() {
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; sections: any[] } | null>(null);
  const [demo, setDemo] = useState(false);

  async function run() {
    if (!topic.trim()) {
      toast('Please enter a topic before generating.', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, demo: isDemo } = await generateRevision({
        subject: subject.trim() || 'General',
        topic: topic.trim(),
      });
      setResult(data);
      setDemo(isDemo);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    const row = await saveHistory(subject.trim() || 'General', topic.trim(), 'revision', result, { difficulty, demo });
    if (row) toast('Revision notes saved to history.');
    else toast('Could not save. Please try again.', 'error');
  }

  function handleCopy() {
    if (!result) return;
    const text = result.sections
      .map((s) => `${s.heading}\n${s.body ?? ''}\n${(s.bullets ?? []).map((b: string) => `• ${b}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(`${result.title}\n\n${text}`);
    toast('Revision notes copied.');
  }

  function handleClear() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">Quick Revision</h1>
          <p className="text-ink-500 text-sm">Concise last-minute notes: definitions, key points, formulas, applications.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 card p-6 h-fit animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="r-subject">Subject</label>
              <input id="r-subject" className="input" placeholder="Embedded Systems" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="r-topic">Topic</label>
              <input id="r-topic" className="input" placeholder="Microcontrollers" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div>
              <label className="label">Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)} className={`btn ${difficulty === d ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50'} px-3 py-2.5 text-sm`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={run} disabled={loading} className="btn-primary w-full py-3">
              <Sparkles className="w-4 h-4" /> Generate Revision Notes
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 card p-6 min-h-[320px] animate-fade-up" style={{ animationDelay: '120ms' }}>
          {loading ? (
            <LoadingDots />
          ) : error ? (
            <ErrorState message={error} onRetry={run} />
          ) : !result ? (
            <EmptyState
              icon={<Zap className="w-7 h-7" />}
              title="No revision notes yet"
              message="Enter a topic and click Generate to get concise last-minute notes."
            />
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-ink-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-500" />
                  <p className="font-display font-700 text-ink-900 text-sm">{result.title}</p>
                </div>
                {demo && <DemoBadge />}
              </div>

              <AnswerContent sections={result.sections} />

              <div className="mt-6 pt-4 border-t border-ink-100 flex flex-wrap gap-2">
                <button onClick={handleCopy} className="btn-secondary btn-sm">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={handleSave} className="btn-secondary btn-sm">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleClear} className="btn-ghost btn-sm ml-auto">
                  <Eraser className="w-3.5 h-3.5" /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
