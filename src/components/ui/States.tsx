import type { ReactNode } from 'react';

export function LoadingDots({ label = 'AI StudyMate is thinking...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 animate-fade-in">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-dot" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-dot" style={{ animationDelay: '160ms' }} />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-dot" style={{ animationDelay: '320ms' }} />
      </div>
      <p className="text-sm text-ink-500 font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="font-medium text-ink-900">Something went wrong</p>
        <p className="text-sm text-ink-500 mt-1 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary btn-sm">
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon?: ReactNode; title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center animate-fade-in">
      {icon && <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center text-ink-400">{icon}</div>}
      <div>
        <p className="font-medium text-ink-800">{title}</p>
        <p className="text-sm text-ink-500 mt-1 max-w-sm">{message}</p>
      </div>
      {action}
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="chip bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Demo Mode
    </span>
  );
}
