import { useState } from 'react';
import { FileText, Copy, RefreshCw, Save, Eraser, Sparkles, AlertCircle } from 'lucide-react';
import type { AnswerType, Difficulty } from '@/lib/types';
import { generateAnswer } from '@/lib/ai';
import { saveHistory } from '@/lib/history';
import { useToast } from '@/lib/toast';
import { AnswerContent } from '@/components/ui/AnswerContent';
import { LoadingDots, ErrorState, EmptyState, DemoBadge } from '@/components/ui/States';

export function ExamPage() {
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [answerType, setAnswerType] = useState<AnswerType>('5');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ title: string; sections: any[] } | null>(null);
  const [demo, setDemo] = useState(false);
  const [topicError, setTopicError] = useState(false);

  async function run() {
    if (!topic.trim()) {
      setTopicError(true);
      toast('Please enter a topic before generating.', 'error');
      return;
    }
    setTopicError(false);
    setLoading(true);
    setError(null);
    try {
      const { data, demo: isDemo } = await generateAnswer({
        subject: subject.trim() || 'General',
        topic: topic.trim(),
        answerType,
        difficulty,
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
    const row = await saveHistory(subject.trim() || 'General', topic.trim(), 'answer', result, {
      answerType,
      difficulty,
      demo,
    });
    if (row) toast('Saved to study history.');
    else toast('Could not save. Please try again.', 'error');
  }

  function handleCopy() {
    if (!result) return;
    const text = result.sections
      .map((s) => `${s.heading}\n${s.body ?? ''}\n${(s.bullets ?? []).map((b: string) => `• ${b}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(`${result.title}\n\n${text}`);
    toast('Answer copied to clipboard.');
  }

  function handleClear() {
    setResult(null);
    setError(null);
    setTopicError(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">AI Exam Answer Generator</h1>
          <p className="text-ink-500 text-sm">Structured answers for 2, 5, and 13-mark questions.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 card p-6 h-fit animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="e-subject">Subject</label>
              <input id="e-subject" className="input" placeholder="Wireless Communication" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="e-topic">Topic</label>
              <input
                id="e-topic"
                className={`input ${topicError ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-100' : ''}`}
                placeholder="5G Network Slicing"
                value={topic}
                onChange={(e) => { setTopic(e.target.value); setTopicError(false); }}
              />
              {topicError && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Please enter a topic before generating.
                </p>
              )}
            </div>
            <div>
              <label className="label">Answer Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['2', '5', '13'] as AnswerType[]).map((t) => (
                  <button key={t} onClick={() => setAnswerType(t)} className={`btn ${answerType === t ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50'} px-3 py-2.5`}>
                    {t} Mark
                  </button>
                ))}
              </div>
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
              <Sparkles className="w-4 h-4" />
              Generate Answer
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3 card p-6 min-h-[320px] animate-fade-up" style={{ animationDelay: '120ms' }}>
          {loading ? (
            <LoadingDots />
          ) : error ? (
            <ErrorState message={error} onRetry={run} />
          ) : !result ? (
            <EmptyState
              icon={<FileText className="w-7 h-7" />}
              title="No answer yet"
              message="Enter a topic and click Generate Answer to see a structured response here."
            />
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-ink-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <p className="font-display font-700 text-ink-900 text-sm">{result.title}</p>
                </div>
                {demo && <DemoBadge />}
              </div>

              <AnswerContent sections={result.sections} />

              <div className="mt-6 pt-4 border-t border-ink-100 flex flex-wrap gap-2">
                <button onClick={handleCopy} className="btn-secondary btn-sm">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button onClick={run} className="btn-secondary btn-sm" disabled={loading}>
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
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
