import { useState } from 'react';
import { ListChecks, Sparkles, CheckCircle2, XCircle, RotateCcw, Save, Trophy, Play, ArrowLeft } from 'lucide-react';
import type { Difficulty, McqQuestion } from '@/lib/types';
import { generateMcq } from '@/lib/ai';
import { saveHistory } from '@/lib/history';
import { useToast } from '@/lib/toast';
import { LoadingDots, ErrorState, EmptyState, DemoBadge } from '@/components/ui/States';

export function McqPage() {
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<McqQuestion[]>([]);
  const [demo, setDemo] = useState(false);

  // quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
  const correct = score;
  const incorrect = questions.length - score;

  async function generate() {
    if (!topic.trim()) {
      toast('Please enter a topic before generating.', 'error');
      return;
    }
    setLoading(true);
    setError(null);
    setQuizMode(false);
    setAnswers({});
    setSubmitted(false);
    try {
      const { data, demo: isDemo } = await generateMcq({
        subject: subject.trim() || 'General',
        topic: topic.trim(),
        count,
        difficulty,
      });
      setQuestions(data.questions);
      setDemo(isDemo);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (questions.length === 0) return;
    const row = await saveHistory(subject.trim() || 'General', topic.trim(), 'mcq', { questions }, { difficulty, demo });
    if (row) toast('Quiz saved to study history.');
    else toast('Could not save. Please try again.', 'error');
  }

  function startQuiz() {
    setQuizMode(true);
    setAnswers({});
    setSubmitted(false);
  }

  function resetQuiz() {
    setQuizMode(false);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <ListChecks className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">MCQ Generator</h1>
          <p className="text-ink-500 text-sm">Generate quizzes and test yourself with a scored quiz mode.</p>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label" htmlFor="m-subject">Subject</label>
            <input id="m-subject" className="input" placeholder="Computer Networks" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="m-topic">Topic</label>
            <input id="m-topic" className="input" placeholder="TCP/IP Model" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="m-count">Questions</label>
            <select id="m-count" className="input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary mt-5">
          <Sparkles className="w-4 h-4" /> Generate MCQs
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card p-6"><LoadingDots /></div>
      ) : error ? (
        <div className="card p-6"><ErrorState message={error} onRetry={generate} /></div>
      ) : questions.length === 0 ? (
        <div className="card p-6">
          <EmptyState icon={<ListChecks className="w-7 h-7" />} title="No questions yet" message="Enter a topic and click Generate MCQs to create a quiz." />
        </div>
      ) : quizMode ? (
        <QuizView
          questions={questions}
          answers={answers}
          submitted={submitted}
          onAnswer={(id, idx) => setAnswers((a) => ({ ...a, [id]: idx }))}
          onSubmit={() => setSubmitted(true)}
          onReset={resetQuiz}
          score={score}
          correct={correct}
          incorrect={incorrect}
        />
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <p className="font-display font-700 text-ink-900">{questions.length} Questions</p>
              {demo && <DemoBadge />}
            </div>
            <div className="flex gap-2">
              <button onClick={startQuiz} className="btn-primary btn-sm">
                <Play className="w-3.5 h-3.5" /> Start Quiz
              </button>
              <button onClick={handleSave} className="btn-secondary btn-sm">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          {questions.map((q, i) => (
            <div key={q.id} className="card p-5">
              <p className="font-medium text-ink-900 mb-3">
                <span className="text-ink-400 mr-1.5">{i + 1}.</span>{q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-ink-50/60">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${j === q.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-200 text-ink-600'}`}>
                      {String.fromCharCode(65 + j)}
                    </span>
                    <span className="text-sm text-ink-700">{opt}</span>
                    {j === q.correct && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-500 bg-amber-50/60 border border-amber-100 rounded-lg p-2.5">
                <strong className="text-amber-700">Explanation:</strong> {q.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuizView({
  questions,
  answers,
  submitted,
  onAnswer,
  onSubmit,
  onReset,
  score,
  correct,
  incorrect,
}: {
  questions: McqQuestion[];
  answers: Record<number, number>;
  submitted: boolean;
  onAnswer: (id: number, idx: number) => void;
  onSubmit: () => void;
  onReset: () => void;
  score: number;
  correct: number;
  incorrect: number;
}) {
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-4 animate-fade-in">
      {submitted && (
        <div className="card p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-6 h-6" />
            <h2 className="font-display font-700 text-xl">Quiz Complete!</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-brand-100 text-sm">Score</p>
              <p className="font-display font-800 text-3xl">{score}/{questions.length}</p>
            </div>
            <div>
              <p className="text-brand-100 text-sm">Correct</p>
              <p className="font-display font-700 text-2xl text-emerald-300">{correct}</p>
            </div>
            <div>
              <p className="text-brand-100 text-sm">Incorrect</p>
              <p className="font-display font-700 text-2xl text-rose-300">{incorrect}</p>
            </div>
          </div>
          <button onClick={onReset} className="btn bg-white/15 text-white px-4 py-2.5 mt-4 hover:bg-white/25">
            <RotateCcw className="w-4 h-4" /> Back to Questions
          </button>
        </div>
      )}

      {questions.map((q, i) => {
        const userAns = answers[q.id];
        return (
          <div key={q.id} className="card p-5">
            <p className="font-medium text-ink-900 mb-3">
              <span className="text-ink-400 mr-1.5">{i + 1}.</span>{q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => {
                const selected = userAns === j;
                const isCorrect = j === q.correct;
                let cls = 'bg-ink-50/60 border border-transparent';
                if (submitted) {
                  if (isCorrect) cls = 'bg-emerald-50 border-emerald-200';
                  else if (selected && !isCorrect) cls = 'bg-rose-50 border-rose-200';
                } else if (selected) {
                  cls = 'bg-brand-50 border-brand-300';
                }
                return (
                  <button
                    key={j}
                    disabled={submitted}
                    onClick={() => onAnswer(q.id, j)}
                    className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-colors ${cls} ${submitted ? 'cursor-default' : 'hover:bg-ink-100'}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${selected ? 'bg-brand-600 text-white' : 'bg-ink-200 text-ink-600'}`}>
                      {String.fromCharCode(65 + j)}
                    </span>
                    <span className="text-sm text-ink-700 flex-1">{opt}</span>
                    {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {submitted && selected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <p className="mt-3 text-xs text-ink-500 bg-amber-50/60 border border-amber-100 rounded-lg p-2.5">
                <strong className="text-amber-700">Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button onClick={onSubmit} disabled={!allAnswered} className="btn-primary w-full py-3">
          Submit Quiz
        </button>
      )}
      {!submitted && !allAnswered && (
        <p className="text-xs text-ink-400 text-center">Answer all questions to submit.</p>
      )}
    </div>
  );
}
