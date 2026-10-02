"use client";

import { useState, useRef, useEffect } from "react";

interface Source {
  index: number;
  page: number;
  similarity: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface ChatProps {
  documentId: string;
  filename: string;
  onReset: () => void;
}

const SUGGESTIONS = [
  "Summarize the main topics",
  "What are the key concepts?",
  "Give me an overview",
];

export function Chat({ documentId, filename, onReset }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, documentId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Chat failed");

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Sorry — ${err instanceof Error ? err.message : "unknown error"}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-6 pb-4 h-[calc(100vh-120px)]">
      {/* Document bar */}
      <div
        className="glass glass-specular rounded-2xl px-4 py-3 flex items-center justify-between mb-4 animate-fade-in"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030014]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white/90 font-medium truncate">
              {filename}
            </p>
            <p className="text-[11px] text-white/40 mt-0.5 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              Indexed · Ready for questions
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-white/60 hover:text-white transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-white/[0.06] flex items-center gap-1.5"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">New document</span>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 pb-4 space-y-5 scroll-smooth"
      >
        {messages.length === 0 && (
          <EmptyState onPick={sendMessage} />
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && <ThinkingBubble />}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="relative mt-2 animate-fade-in-up"
        style={{ animationDelay: "180ms" }}
      >
        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/10 to-blue-500/20 blur-2xl -z-1 opacity-70" />
        <div className="glass-strong glass-specular rounded-2xl p-1.5 flex items-end gap-2 focus-within:border-violet-400/40 transition-all duration-300">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document…"
            disabled={loading}
            rows={1}
            className="flex-1 resize-none bg-transparent text-white placeholder:text-white/30 text-sm px-3.5 py-3 outline-none max-h-40 disabled:opacity-50 leading-relaxed"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 160) + "px";
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-blue-500 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 enabled:hover:scale-105 active:scale-95 group"
            aria-label="Send message"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin-slow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-white/25 text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="pt-10 text-center animate-fade-in-up">
      <div className="relative inline-block mb-6">
        <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center">
          <svg
            className="w-7 h-7 text-violet-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-violet-500/25 to-blue-500/25 blur-2xl -z-1" />
      </div>

      <h2 className="text-white/90 text-lg font-medium mb-2">
        Ready when you are
      </h2>
      <p className="text-white/45 text-sm mb-8 max-w-md mx-auto">
        Ask anything about this document. Answers are grounded in the source
        with page-level citations.
      </p>

      <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="text-xs px-3.5 py-2 rounded-full glass text-white/70 hover:text-white hover:border-white/25 transition-all duration-300 hover:scale-105"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-fade-in-up ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <AssistantAvatar />}

      <div className={`max-w-[85%] ${isUser ? "order-1" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-violet-500 to-blue-600 text-white rounded-tr-md shadow-lg shadow-violet-500/20"
              : "glass glass-specular text-white/90 rounded-tl-md"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-white/35 mr-0.5 uppercase tracking-wider font-medium">
              Sources
            </span>
            {message.sources.map((s, i) => (
              <SourcePill key={i} source={s} />
            ))}
          </div>
        )}
      </div>

      {isUser && <UserAvatar />}
    </div>
  );
}

function SourcePill({ source }: { source: Source }) {
  const pct = Math.round(source.similarity * 100);
  const tone =
    pct >= 75 ? "emerald" : pct >= 60 ? "violet" : "white";

  const toneClasses = {
    emerald: "border-emerald-400/25 bg-emerald-500/[0.08] text-emerald-200",
    violet: "border-violet-400/25 bg-violet-500/[0.08] text-violet-200",
    white: "border-white/10 bg-white/[0.04] text-white/70",
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] ${toneClasses} hover:scale-105 transition-transform duration-200 cursor-default`}
      title={`Cosine similarity: ${source.similarity}`}
    >
      <svg
        className="w-2.5 h-2.5 opacity-70"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
      <span className="font-medium">p.{source.page}</span>
      <span className="opacity-40">·</span>
      <span>{pct}%</span>
    </span>
  );
}

function AssistantAvatar() {
  return (
    <div className="relative flex-shrink-0 mt-0.5">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-8 h-8 rounded-xl glass flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg
        className="w-4 h-4 text-white/60"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  );
}

function ThinkingBubble() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <AssistantAvatar />
      <div className="glass glass-specular rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse-dot" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse-dot"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse-dot"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}