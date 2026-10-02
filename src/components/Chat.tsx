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
  "What is the document about?",
  "List the key concepts",
];

export function Chat({ documentId, filename, onReset }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
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
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-6 pb-2 h-[calc(100vh-73px)]">
      {/* Document bar */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white/90 font-medium truncate">
              {filename}
            </p>
            <p className="text-[11px] text-white/40">
              Indexed · Ready to answer questions
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-white/50 hover:text-white/90 transition-colors whitespace-nowrap px-3 py-1.5 rounded-md hover:bg-white/5"
        >
          New document
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-1 pb-4 space-y-5"
      >
        {messages.length === 0 && (
          <div className="pt-12 text-center animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 text-violet-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">
              Ask anything about this document
            </p>
            <p className="text-white/40 text-xs mb-6">
              Answers are grounded in the PDF with page citations
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {loading && <ThinkingBubble />}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 p-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm focus-within:border-violet-400/40 transition-colors"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about the document…"
          disabled={loading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-white placeholder:text-white/30 text-sm px-3 py-2.5 outline-none max-h-32 disabled:opacity-50"
          style={{
            height: "auto",
            minHeight: "40px",
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 128) + "px";
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          aria-label="Send"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M13 6l6 6-6 6"
            />
          </svg>
        </button>
      </form>
      <p className="text-[10px] text-white/25 text-center mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

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
              ? "bg-gradient-to-br from-violet-500 to-blue-500 text-white rounded-tr-sm shadow-lg shadow-violet-500/10"
              : "bg-white/[0.04] border border-white/5 text-white/90 rounded-tl-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-white/40 self-center mr-1">
              Sources:
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
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.03] text-[10px] text-white/60">
      <span className="text-white/80 font-medium">p.{source.page}</span>
      <span className="text-white/30">·</span>
      <span className="text-emerald-400/80">
        {(source.similarity * 100).toFixed(0)}%
      </span>
    </span>
  );
}

function AssistantAvatar() {
  return (
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg
        className="w-3.5 h-3.5 text-violet-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg
        className="w-3.5 h-3.5 text-white/60"
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
      <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse-dot" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse-dot"
          style={{ animationDelay: "0.15s" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse-dot"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </div>
  );
}