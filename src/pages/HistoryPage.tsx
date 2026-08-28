import { useEffect, useState } from 'react';
import { History as HistoryIcon, FileText, MessageSquare, ListChecks, Zap, Trash2, X, ArrowLeft } from 'lucide-react';
import { fetchHistory, deleteHistory, type StudyHistoryRow } from '@/lib/history';
import { useToast } from '@/lib/toast';
import { AnswerContent } from '@/components/ui/AnswerContent';
import { EmptyState } from '@/components/ui/States';

const TYPE_META: Record<string, { label: string; icon: typeof FileText; color: string }> = {
  answer: { label: 'Exam Answer', icon: FileText, color: 'bg-brand-50 text-brand-600' },
  tutor: { label: 'Tutor Chat', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
  mcq: { label: 'MCQ Quiz', icon: ListChecks, color: 'bg-amber-50 text-amber-600' },
  revision: { label: 'Revision Notes', icon: Zap, color: 'bg-rose-50 text-rose-600' },
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function HistoryPage() {
  const toast = useToast();
  const [rows, setRows] = useState<StudyHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudyHistoryRow | null>(null);

  async function load() {
    setLoading(true);
    const data = await fetchHistory(100);
    setRows(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    const ok = await deleteHistory(id);
    if (ok) {
      setRows((r) => r.filter((x) => x.id !== id));
      if (selected?.id === id) setSelected(null);
      toast('Entry deleted.');
    } else {
      toast('Could not delete. Please try again.', 'error');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-ink-100 flex items-center justify-center text-ink-600">
          <HistoryIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">Study History</h1>
          <p className="text-ink-500 text-sm">Browse and reopen your previously generated study material.</p>
        </div>
      </div>

      {loading ? (
        <div className="card divide-y divide-ink-100">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ink-100 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-48 bg-ink-100 rounded animate-pulse" />
                <div className="h-2.5 w-28 bg-ink-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="card p-8">
          <EmptyState
            icon={<HistoryIcon className="w-7 h-7" />}
            title="No history yet"
            message="Generated answers, quizzes, revision notes, and tutor chats will be saved here automatically."
          />
        </div>
      ) : (
        <div className="card divide-y divide-ink-100 animate-fade-up">
          {rows.map((r) => {
            const meta = TYPE_META[r.content_type] ?? TYPE_META.answer;
            const Icon = meta.icon;
            return (
              <div key={r.id} className="p-4 flex items-center gap-3 hover:bg-ink-50/60 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <button onClick={() => setSelected(r)} className="flex-1 min-w-0 text-left">
                  <p className="font-medium text-ink-900 text-sm truncate">{r.topic}</p>
                  <p className="text-xs text-ink-400">{r.subject} · {meta.label}{r.answer_type ? ` · ${r.answer_type} Mark` : ''}{r.difficulty ? ` · ${r.difficulty}` : ''}</p>
                </button>
                <span className="text-xs text-ink-400 shrink-0 hidden sm:block">{fmtDate(r.created_at)}</span>
                <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-ink-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg bg-white shadow-card h-full overflow-y-auto animate-fade-up">
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-ink-100 p-4 flex items-center justify-between">
              <button onClick={() => setSelected(null)} className="btn-ghost btn-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg text-ink-400 hover:text-ink-700" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <HistoryDetail row={selected} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryDetail({ row }: { row: StudyHistoryRow }) {
  const meta = TYPE_META[row.content_type] ?? TYPE_META.answer;
  const Icon = meta.icon;
  const content = row.content as any;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="chip bg-ink-100 text-ink-600">{meta.label}</span>
        {row.demo && <span className="chip bg-amber-50 text-amber-700 border border-amber-200">Demo</span>}
      </div>
      <h2 className="font-display font-700 text-xl text-ink-900 mt-3">{row.topic}</h2>
      <p className="text-sm text-ink-500">{row.subject}</p>
      <p className="text-xs text-ink-400 mt-1">{fmtDate(row.created_at)}</p>

      <div className="mt-5 border-t border-ink-100 pt-5">
        {row.content_type === 'tutor' ? (
          <div className="space-y-3">
            <div className="bg-brand-50 rounded-xl p-3">
              <p className="text-xs text-brand-600 font-medium mb-1">You asked</p>
              <p className="text-sm text-ink-800">{row.topic}</p>
            </div>
            <div className="bg-ink-50 rounded-xl p-3">
              <p className="text-xs text-emerald-600 font-medium mb-1">AI Tutor</p>
              <div className="ai-content">
                {(content.reply as string).split('\n').map((line, i) => (
                  line.trim() ? <p key={i} className="text-ink-700 leading-relaxed mb-1.5">{line}</p> : <div key={i} className="h-2" />
                ))}
              </div>
            </div>
          </div>
        ) : row.content_type === 'mcq' ? (
          <div className="space-y-3">
            {(content.questions as any[]).map((q, i) => (
              <div key={i} className="bg-ink-50/60 rounded-xl p-3">
                <p className="font-medium text-ink-900 text-sm mb-2">{i + 1}. {q.question}</p>
                <div className="space-y-1">
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium ${j === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-200 text-ink-500'}`}>
                        {String.fromCharCode(65 + j)}
                      </span>
                      <span className={j === q.correct ? 'text-emerald-700 font-medium' : 'text-ink-600'}>{opt}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-500 mt-1.5">Explanation: {q.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <AnswerContent sections={content.sections ?? []} />
        )}
      </div>
    </div>
  );
}
