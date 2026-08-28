import {
  Info,
  Target,
  Lightbulb,
  Cpu,
  User,
  Cloud,
  Network,
  Server,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  Code2,
  Database,
  Layers,
} from 'lucide-react';

const ARCHITECTURE = [
  { icon: User, label: 'Student', sub: 'Opens the web app in a browser', color: 'text-brand-600 bg-brand-50' },
  { icon: Cloud, label: 'Web Application', sub: 'React + TypeScript hosted on S3 / Amplify', color: 'text-emerald-600 bg-emerald-50' },
  { icon: Network, label: 'API Gateway', sub: 'Exposes REST endpoints securely', color: 'text-amber-600 bg-amber-50' },
  { icon: Server, label: 'AWS Lambda', sub: 'Serverless backend, holds no secrets in browser', color: 'text-rose-600 bg-rose-50' },
  { icon: Cpu, label: 'Amazon Bedrock', sub: 'AI model inference, returns the response', color: 'text-violet-600 bg-violet-50' },
];

const ENDPOINTS = [
  { method: 'POST', path: '/generate-answer', desc: 'Generate structured exam answers (2 / 5 / 13 mark)' },
  { method: 'POST', path: '/generate-mcq', desc: 'Generate multiple-choice questions with explanations' },
  { method: 'POST', path: '/tutor', desc: 'Ask the AI tutor a question in plain language' },
  { method: 'POST', path: '/revision', desc: 'Generate concise quick-revision notes' },
];

const STACK = [
  { icon: Code2, label: 'React + TypeScript', desc: 'Component-based frontend with Tailwind CSS' },
  { icon: Server, label: 'AWS Lambda', desc: 'Serverless backend functions' },
  { icon: Cpu, label: 'Amazon Bedrock', desc: 'Managed AI model inference' },
  { icon: Database, label: 'Supabase / DynamoDB', desc: 'Study history persistence' },
];

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center gap-3 mb-8 animate-fade-up">
        <div className="w-11 h-11 rounded-xl bg-ink-100 flex items-center justify-center text-ink-600">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-700 text-2xl text-ink-900">About This Project</h1>
          <p className="text-ink-500 text-sm">Built for the AWS Builder Center Summer Builds Showcase.</p>
        </div>
      </div>

      {/* Problem / Solution / Tech */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-display font-700 text-ink-900">Problem</h3>
          <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
            Students spend significant time searching for explanations and preparing exam answers from scattered sources.
          </p>
        </div>
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-display font-700 text-ink-900">Solution</h3>
          <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
            AI StudyMate provides one platform for explanations, exam answers, quizzes, revision notes, and AI tutoring.
          </p>
        </div>
        <div className="card p-5 animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-display font-700 text-ink-900">Technology</h3>
          <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
            React + TypeScript + AWS architecture + Amazon Bedrock for AI inference.
          </p>
        </div>
      </div>

      {/* Architecture diagram */}
      <div className="card p-6 lg:p-8 mb-8 animate-fade-up" style={{ animationDelay: '240ms' }}>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="font-display font-700 text-xl text-ink-900">AWS Architecture</h2>
        </div>
        <p className="text-ink-500 text-sm mb-6">
          AI keys and AWS credentials never reach the browser. The frontend calls an API abstraction; the backend securely calls Amazon Bedrock.
        </p>

        <div className="flex flex-col items-stretch gap-2">
          {ARCHITECTURE.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={a.label}>
                <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-4 flex items-center gap-4 hover:border-brand-300 transition-colors">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-700 text-ink-900">{a.label}</p>
                    <p className="text-xs text-ink-500">{a.sub}</p>
                  </div>
                  <span className="text-xs font-mono text-ink-300 hidden sm:block">Step {i + 1}</span>
                </div>
                {i < ARCHITECTURE.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-ink-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* API endpoints */}
      <div className="card p-6 mb-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <h2 className="font-display font-700 text-xl text-ink-900 mb-4">API Endpoints</h2>
        <div className="space-y-2">
          {ENDPOINTS.map((e) => (
            <div key={e.path} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/60 border border-ink-100">
              <span className="chip bg-ink-900 text-ink-100 font-mono text-[11px] shrink-0">{e.method}</span>
              <span className="font-mono text-sm text-ink-800 shrink-0">{e.path}</span>
              <span className="text-xs text-ink-500 hidden sm:block ml-auto">{e.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card p-6 animate-fade-up" style={{ animationDelay: '360ms' }}>
        <h2 className="font-display font-700 text-xl text-ink-900 mb-4">Technology Stack</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {STACK.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl border border-ink-100">
                <div className="w-9 h-9 rounded-lg bg-ink-100 flex items-center justify-center text-ink-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-ink-900 text-sm">{s.label}</p>
                  <p className="text-xs text-ink-500">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-400">
        <span>AI StudyMate</span>
        <span>·</span>
        <span>Learn Smarter. Prepare Faster. Score Better.</span>
      </div>
    </div>
  );
}
