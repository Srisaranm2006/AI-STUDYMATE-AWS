import { useEffect, useState } from 'react';
import {
  GraduationCap,
  FileText,
  MessageSquare,
  ListChecks,
  Zap,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import type { PageId } from '@/components/Layout';
import type { AnswerType, Difficulty } from '@/lib/types';
import { fetchHistory, type StudyHistoryRow } from '@/lib/history';

const QUICK_LINKS: { id: PageId; label: string; desc: string; icon: typeof FileText; color: string }[] = [
  { id: 'exam', label: 'Exam Answers', desc: '2 / 5 / 13 mark', icon: FileText, color: 'bg-brand-50 text-brand-600' },
  { id: 'tutor', label: 'AI Tutor', desc: 'Ask anything', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'mcq', label: 'MCQ Quiz', desc: 'Practice quizzes', icon: ListChecks, color: 'bg-amber-50 text-amber-600' },
  { id: 'revision', label: 'Quick Revision', desc: 'Last-minute notes', icon: Zap, color: 'bg-rose-50 text-rose-600' },
];

const TYPE_LABEL: Record<string, string> = {
  answer: 'Exam Answer',
  mcq: 'MCQ Quiz',
  revision: 'Revision Notes',
  tutor: 'Tutor Chat',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function DashboardPage({
  onNavigate,
  prefill,
}: {
  onNavigate: (p: PageId) => void;
  prefill?: { subject?: string; topic?: string; answerType?: AnswerType; difficulty?: Difficulty } | null;
}) {
  const [subject, setSubject] = useState(prefill?.subject ?? '');
  const [topic, setTopic] = useState(prefill?.topic ?? '');
  const [answerType, setAnswerType] = useState<AnswerType>(prefill?.answerType ?? '5');
  const [difficulty, setDifficulty] = useState<Difficulty>(prefill?.difficulty ?? 'Intermediate');
  const [recent, setRecent] = useState<StudyHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prefill) {
      if (prefill.subject) setSubject(prefill.subject);
      if (prefill.topic) setTopic(prefill.topic);
      if (prefill.answerType) setAnswerType(prefill.answerType);
      if (prefill.difficulty) setDifficulty(prefill.difficulty);
    }
  }, [prefill]);

  useEffect(() => {
    fetchHistory(6).then((rows) => {
      setRecent(rows);
      setLoading(false);
    });
  }, []);

  const canGenerate = subject.trim() && topic.trim();

  function handleGenerate() {
    if (!canGenerate) return;
    onNavigate('exam');
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 lg:py-10">
      {/* Welcome */}
      <div className="flex items-center gap-3 mb-8 animate-fade-up">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-soft">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">Welcome back, Student</h1>
          <p className="text-ink-500 text-sm">Pick a subject and topic, then choose what to generate.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Generator card */}
        <div className="lg:col-span-2 card p-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h2 className="font-display font-700 text-ink-900">Generate Study Material</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="d-subject">Subject</label>
              <input
                id="d-subject"
                className="input"
                placeholder="e.g. Wireless Communication"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="d-topic">Topic</label>
              <input
                id="d-topic"
                className="input"
                placeholder="e.g. 5G Network Slicing"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Answer Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['2', '5', '13'] as AnswerType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setAnswerType(t)}
                  className={`btn ${answerType === t ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50'} px-3 py-2.5`}
                >
                  {t} Mark
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`btn ${difficulty === d ? 'bg-brand-600 text-white' : 'bg-white text-ink-700 border border-ink-200 hover:bg-ink-50'} px-3 py-2.5 text-sm`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="btn-primary w-full mt-6 py-3"
          >
            Generate Answer
            <ArrowRight className="w-4 h-4" />
          </button>
          {!canGenerate && (
            <p className="text-xs text-ink-400 mt-2 text-center">Enter a subject and topic to continue.</p>
          )}
        </div>

        {/* Quick links */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <h2 className="font-display font-700 text-ink-900 mb-4">Quick Tools</h2>
          <div className="space-y-2.5">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.id}
                  onClick={() => onNavigate(q.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-ink-200 hover:border-brand-300 hover:bg-brand-50/40 transition-colors text-left"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${q.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-900 text-sm">{q.label}</p>
                    <p className="text-xs text-ink-400">{q.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-300" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent topics */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ink-400" />
            <h2 className="font-display font-700 text-ink-900">Recent Study Topics</h2>
          </div>
          <button onClick={() => onNavigate('history')} className="btn-ghost btn-sm text-brand-600 hover:bg-brand-50">
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="card divide-y divide-ink-100">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-ink-100 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-40 bg-ink-100 rounded animate-pulse" />
                  <div className="h-2.5 w-24 bg-ink-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="card p-8 text-center">
            <BookOpen className="w-10 h-10 text-ink-300 mx-auto mb-2" />
            <p className="font-medium text-ink-700">No study history yet</p>
            <p className="text-sm text-ink-400 mt-1">Generated content will appear here.</p>
          </div>
        ) : (
          <div className="card divide-y divide-ink-100">
            {recent.map((r) => (
              <button
                key={r.id}
                onClick={() => onNavigate('history')}
                className="w-full p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors text-left first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink-900 text-sm truncate">{r.topic}</p>
                  <p className="text-xs text-ink-400">{r.subject} · {TYPE_LABEL[r.content_type]}</p>
                </div>
                <span className="text-xs text-ink-400 shrink-0">{timeAgo(r.created_at)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
