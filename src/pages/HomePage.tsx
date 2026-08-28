import {
  GraduationCap,
  FileText,
  MessageSquare,
  ListChecks,
  Zap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Cloud,
  Server,
  Cpu,
  Network,
  User,
} from 'lucide-react';
import type { PageId } from '@/components/Layout';
import { AnswerContent } from '@/components/ui/AnswerContent';

const FEATURES = [
  {
    icon: FileText,
    title: 'AI Exam Answers',
    desc: 'Generate structured 2, 5, and 13-mark answers with definitions, explanations, examples, and conclusions.',
    color: 'bg-brand-50 text-brand-600',
  },
  {
    icon: MessageSquare,
    title: 'AI Tutor',
    desc: 'Ask any question in plain language and get a simple, student-friendly explanation with examples.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: ListChecks,
    title: 'MCQ Generator',
    desc: 'Create custom quizzes with four options, correct answers, explanations, and a scored quiz mode.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Zap,
    title: 'Quick Revision',
    desc: 'Get concise last-minute revision notes: definitions, key points, formulas, and applications.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const DEMO_ANSWER = {
  title: 'Network Slicing — 5-Mark Answer',
  sections: [
    {
      heading: 'Introduction',
      body: 'Network slicing is a 5G technology that allows a single physical network infrastructure to be divided into multiple virtual networks, each optimized for a specific use case.',
    },
    {
      heading: 'Main Points',
      bullets: [
        'Uses NFV and SDN to create isolated virtual networks on shared infrastructure.',
        'Each slice has its own quality of service, security, and bandwidth.',
        'Enables services like ultra-reliable low-latency (URLLC) and massive IoT on the same network.',
      ],
    },
    {
      heading: 'Example',
      body: 'A telecom operator runs one slice for autonomous vehicles (low latency) and another for video streaming (high bandwidth) on the same 5G network.',
    },
    {
      heading: 'Conclusion',
      body: 'Network slicing makes 5G flexible and efficient, allowing operators to serve diverse services from one infrastructure.',
    },
  ],
};

const ARCHITECTURE = [
  { icon: User, label: 'Student', sub: 'Web browser' },
  { icon: Cloud, label: 'Web App', sub: 'React + TypeScript (S3 / Amplify)' },
  { icon: Network, label: 'API Gateway', sub: 'REST endpoints' },
  { icon: Server, label: 'AWS Lambda', sub: 'Serverless backend' },
  { icon: Cpu, label: 'Amazon Bedrock', sub: 'AI model inference' },
];

export function HomePage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24">
          <div className="inline-flex items-center gap-2 chip bg-white border border-ink-200 text-ink-600 shadow-soft mb-6 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            AI-Powered Exam Preparation
          </div>

          <h1 className="font-display font-800 text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1.1] tracking-tight animate-fade-up" style={{ animationDelay: '60ms' }}>
            AI StudyMate
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-brand-700 font-display font-700 animate-fade-up" style={{ animationDelay: '120ms' }}>
            Your Personal AI Exam Preparation Assistant
          </p>
          <p className="mt-4 max-w-2xl text-ink-600 leading-relaxed animate-fade-up" style={{ animationDelay: '180ms' }}>
            Learn smarter, prepare faster, and score better. AI StudyMate generates structured exam
            answers, quizzes, revision notes, and gives you a personal AI tutor — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '240ms' }}>
            <button onClick={() => onNavigate('dashboard')} className="btn-primary text-base px-6 py-3">
              Start Studying
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onNavigate('about')} className="btn-secondary text-base px-6 py-3">
              About This Project
            </button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-700 text-2xl text-ink-900">Everything you need to prepare</h2>
            <p className="text-ink-500 mt-1">Four powerful tools, one focused study companion.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <button
                key={f.title}
                onClick={() => onNavigate(f.title.includes('Exam') ? 'exam' : f.title.includes('Tutor') ? 'tutor' : f.title.includes('MCQ') ? 'mcq' : 'revision')}
                className="card p-5 text-left hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-700 text-ink-900 mt-4">{f.title}</h3>
                <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 text-sm text-brand-600 font-medium mt-3.5">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Demo example */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="chip bg-amber-50 text-amber-700 border border-amber-200 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Demo Mode Example
            </span>
            <h2 className="font-display font-700 text-2xl text-ink-900">See it in action</h2>
            <p className="text-ink-600 mt-2 leading-relaxed">
              Here's a sample 5-mark answer AI StudyMate generates for <strong>5G Network Slicing</strong> under
              Wireless Communication. Every response is clearly formatted with headings and bullet points.
            </p>
            <div className="mt-5 space-y-2.5">
              {[
                ['Subject', 'Wireless Communication'],
                ['Topic', '5G Network Slicing'],
                ['Answer Type', '5 Mark'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-ink-400">{k}</span>
                  <span className="font-medium text-ink-800">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('exam')} className="btn-primary mt-6">
              Try Exam Answers
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-brand-500" />
              <p className="font-display font-700 text-ink-900 text-sm">{DEMO_ANSWER.title}</p>
            </div>
            <AnswerContent sections={DEMO_ANSWER.sections} />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="card p-6 lg:p-8">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="font-display font-700 text-2xl text-ink-900">Built for AWS</h2>
          </div>
          <p className="text-ink-500 max-w-2xl">
            A serverless architecture where AI keys never touch the browser. The frontend calls an API
            abstraction; the backend securely calls Amazon Bedrock.
          </p>

          <div className="mt-8 flex flex-col lg:flex-row items-stretch gap-3">
            {ARCHITECTURE.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="flex items-center gap-3 lg:flex-1">
                  <div className="flex-1 rounded-xl border border-ink-200 bg-ink-50/60 p-4 text-center hover:border-brand-300 hover:bg-brand-50/40 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-lg bg-white border border-ink-200 flex items-center justify-center text-brand-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-ink-900 text-sm mt-2.5">{a.label}</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{a.sub}</p>
                  </div>
                  {i < ARCHITECTURE.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-ink-300 rotate-90 lg:rotate-0 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {['POST /generate-answer', 'POST /generate-mcq', 'POST /tutor', 'POST /revision'].map((e) => (
              <span key={e} className="chip bg-ink-900 text-ink-100 font-mono text-[11px]">{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-12 pb-20">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 lg:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <h2 className="font-display font-700 text-2xl">Ready to ace your exams?</h2>
              </div>
              <p className="text-brand-100 mt-2 max-w-md">
                Jump into the dashboard, pick a subject and topic, and let AI StudyMate do the heavy lifting.
              </p>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn bg-white text-brand-700 px-6 py-3 text-base hover:bg-brand-50 active:scale-[0.98]"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
