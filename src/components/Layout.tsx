import { useEffect, useState, type ReactNode } from 'react';
import {
  Home,
  LayoutDashboard,
  FileText,
  MessageSquare,
  ListChecks,
  Zap,
  History,
  Info,
  GraduationCap,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export type PageId =
  | 'home'
  | 'dashboard'
  | 'exam'
  | 'tutor'
  | 'mcq'
  | 'revision'
  | 'history'
  | 'about';

export const NAV_ITEMS: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'exam', label: 'Exam Answers', icon: FileText },
  { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
  { id: 'mcq', label: 'MCQ Quiz', icon: ListChecks },
  { id: 'revision', label: 'Quick Revision', icon: Zap },
  { id: 'history', label: 'History', icon: History },
  { id: 'about', label: 'About', icon: Info },
];

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { id: PageId; label: string; icon: typeof Home };
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-brand-50 text-brand-700'
          : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
      }`}
    >
      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-brand-600' : 'text-ink-400'}`} />
      <span>{item.label}</span>
      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
    </button>
  );
}

function SidebarContent({ page, onNavigate }: { page: PageId; onNavigate: (p: PageId) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-soft">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-display font-700 text-ink-900 leading-none">AI StudyMate</p>
          <p className="text-[11px] text-ink-400 mt-0.5">Learn Smarter. Prepare Faster.</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavButton key={item.id} item={item} active={page === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </nav>

      <div className="m-3 p-3.5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm font-semibold">Demo Mode Active</p>
        </div>
        <p className="text-xs text-brand-100 leading-snug">
          Realistic sample AI responses. Ready to swap in Amazon Bedrock.
        </p>
      </div>
    </div>
  );
}

export function Layout({
  page,
  onNavigate,
  children,
}: {
  page: PageId;
  onNavigate: (p: PageId) => void;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [page]);

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-ink-200 bg-white">
        <SidebarContent page={page} onNavigate={onNavigate} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white shadow-card animate-fade-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-700"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent page={page} onNavigate={onNavigate} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur border-b border-ink-200">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-ink-600 hover:bg-ink-100"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-700 text-ink-900">AI StudyMate</span>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
