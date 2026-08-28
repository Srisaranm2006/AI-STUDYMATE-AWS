import { useEffect, useState } from 'react';
import { Layout, type PageId } from '@/components/Layout';
import { ToastProvider } from '@/lib/toast';
import { HomePage } from '@/pages/HomePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ExamPage } from '@/pages/ExamPage';
import { TutorPage } from '@/pages/TutorPage';
import { McqPage } from '@/pages/McqPage';
import { RevisionPage } from '@/pages/RevisionPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AboutPage } from '@/pages/AboutPage';

function getHashPage(): PageId {
  const hash = window.location.hash.replace('#/', '').replace('#', '') as PageId;
  const valid: PageId[] = ['home', 'dashboard', 'exam', 'tutor', 'mcq', 'revision', 'history', 'about'];
  return valid.includes(hash) ? hash : 'home';
}

function App() {
  const [page, setPage] = useState<PageId>(getHashPage());

  useEffect(() => {
    const onHash = () => setPage(getHashPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function navigate(p: PageId) {
    window.location.hash = `/${p}`;
    setPage(p);
    window.scrollTo({ top: 0 });
  }

  return (
    <ToastProvider>
      <Layout page={page} onNavigate={navigate}>
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {page === 'exam' && <ExamPage />}
        {page === 'tutor' && <TutorPage />}
        {page === 'mcq' && <McqPage />}
        {page === 'revision' && <RevisionPage />}
        {page === 'history' && <HistoryPage />}
        {page === 'about' && <AboutPage />}
      </Layout>
    </ToastProvider>
  );
}

export default App;
