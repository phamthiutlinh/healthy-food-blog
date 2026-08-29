'use client';

import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Source = { title: string; href: string };
type Message = { role: 'user' | 'assistant'; content: string; sources?: Source[] };

const GREETING: Message = {
  role: 'assistant',
  content: 'Chào bạn! Mình là trợ lý của Nhà bếp của Lyn. Bạn muốn tìm công thức healthy hay gợi ý meal prep nào?',
};

const RICH = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

const STORAGE_KEY = 'lyn-chat-history';
const MAX_STORED = 50;

function loadStored(): Message[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const messages = parsed.filter(
      (m): m is Message =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    );
    return messages.length ? messages : null;
  } catch {
    return null;
  }
}

/** Renders the small markdown subset the model uses: links and bold. */
function renderRich(text: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(RICH)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const [full, label, href, bold] = match;
    if (bold) {
      nodes.push(<strong key={index}>{bold}</strong>);
    } else if (href?.startsWith('/')) {
      nodes.push(
        <a
          key={index}
          href={href}
          className="font-medium text-[#5d874f] underline underline-offset-2 transition hover:text-[#78966c] active:text-[#4a6d3f]"
        >
          {label}
        </a>,
      );
    } else {
      nodes.push(label);
    }
    last = index + full.length;
  }
  nodes.push(text.slice(last));
  return nodes;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [restored, setRestored] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadStored();
    if (stored) setMessages(stored);
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored || loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      // storage full or unavailable — history stays in memory only
    }
  }, [messages, restored, loading]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  function reset() {
    setMessages([GREETING]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const history = [
      ...messages.filter((m) => m.content !== GREETING.content),
      { role: 'user' as const, content: text },
    ];
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: '' }));
        throw new Error(error || 'Không gửi được câu hỏi.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let sources: Source[] = [];
      try {
        const raw = res.headers.get('X-Chat-Sources');
        if (raw) sources = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))));
      } catch {
        sources = [];
      }

      let answer = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', content: answer, sources }]);
      }

      if (!answer.trim()) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: 'Mình chưa soạn được câu trả lời. Bạn xem thử các nội dung liên quan bên dưới nhé.', sources },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: error instanceof Error ? error.message : 'Có lỗi xảy ra, thử lại nhé.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Đóng trợ lý' : 'Mở trợ lý'}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-[18px] bottom-[74px] z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#2f342d] text-white shadow-[0_8px_20px_rgba(47,52,45,.28)] transition hover:-translate-y-px md:right-[26px] md:bottom-[90px] md:h-12 md:w-12"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed right-[18px] bottom-[134px] z-40 flex h-[440px] w-[min(360px,calc(100vw-36px))] flex-col overflow-hidden overscroll-contain rounded-2xl border border-[#e7e5df] bg-white shadow-[0_18px_40px_rgba(47,52,45,.22)] md:right-[26px] md:bottom-[150px]">
          <div className="flex items-start justify-between gap-2 border-b border-[#e7e5df] bg-[#faf9f6] px-4 py-3">
            <div>
              <p className="font-['Playfair_Display'] text-[16px] font-bold text-[#2f342d]">Trợ lý Nhà bếp của Lyn</p>
              <p className="text-[12px] text-[#74776f]">Hỏi về công thức, meal prep, sống khỏe</p>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="shrink-0 rounded-full border border-[#d8d5cc] bg-white px-2.5 py-1 text-[12px] text-[#5d874f] transition hover:border-[#78966c] disabled:opacity-50"
            >
              Xoá lịch sử
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[14px] leading-[1.6] ${
                    m.role === 'user' ? 'bg-[#5d874f] text-white' : 'bg-[#f2f1ec] text-[#2f342d]'
                  }`}
                >
                  {m.content ? renderRich(m.content) : loading ? 'Đang tìm trong blog…' : ''}
                </div>
                {m.role === 'assistant' && m.sources?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.sources.map((s) => (
                      <a
                        key={s.href}
                        href={s.href}
                        className="rounded-full border border-[#d8d5cc] bg-white px-2.5 py-1 text-[12px] text-[#5d874f] transition hover:border-[#78966c] hover:bg-[#f2f5ef] active:border-[#5d874f] active:bg-[#e9efe4]"
                      >
                        {s.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#e7e5df] px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi…"
              maxLength={1000}
              className="min-w-0 flex-1 rounded-full border border-[#e7e5df] bg-[#faf9f6] px-4 py-2 text-[14px] outline-none focus:border-[#78966c]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gửi"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5d874f] text-white transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
