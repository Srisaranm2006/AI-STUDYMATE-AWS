import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, Eraser, Sparkles, GraduationCap } from 'lucide-react';
import { askTutor } from '@/lib/ai';
import { saveHistory } from '@/lib/history';
import { useToast } from '@/lib/toast';
import type { ChatMessage } from '@/lib/types';
import { LoadingDots, DemoBadge } from '@/components/ui/States';

const SUGGESTED = [
  'What is network slicing?',
  'Explain IoT in simple terms',
  'How does a microcontroller work?',
  'What is cloud computing?',
];

function formatReply(text: string) {
  return text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />;
    return <p key={i} className="text-ink-700 leading-relaxed mb-1.5">{line}</p>;
  });
}

export function TutorPage() {
  const toast = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const { data, demo: isDemo } = await askTutor({ question: q, history: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      setDemo(isDemo);
      await saveHistory('AI Tutor', q, 'tutor', { reply: data.reply }, { demo: isDemo });
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I could not generate a response. Please try again.' }]);
      toast('Could not get a response. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setDemo(false);
    toast('Conversation cleared.', 'info');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:py-10">
      <div className="flex items-center justify-between gap-3 mb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-700 text-2xl text-ink-900">AI Tutor</h1>
            <p className="text-ink-500 text-sm">Ask anything. Get simple, student-friendly explanations.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {demo && <DemoBadge />}
          {messages.length > 0 && (
            <button onClick={clearConversation} className="btn-ghost btn-sm">
              <Eraser className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="card flex flex-col h-[60vh] min-h-[420px] animate-fade-up" style={{ animationDelay: '60ms' }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <p className="font-medium text-ink-800">Hi! I'm your AI StudyMate Tutor.</p>
                <p className="text-sm text-ink-500 mt-1 max-w-sm">Ask me to explain any concept in simple terms, or pick a suggested question below.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => send(s)} className="chip bg-white border border-ink-200 text-ink-700 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-fade-up ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-ink-50 text-ink-800'}`}>
                {m.role === 'assistant' ? formatReply(m.content) : <p className="leading-relaxed">{m.content}</p>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="bg-ink-50 rounded-2xl px-4 py-3">
                <LoadingDots label="" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-ink-100 p-3">
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2"
          >
            <input
              className="input flex-1"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 py-2.5">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
