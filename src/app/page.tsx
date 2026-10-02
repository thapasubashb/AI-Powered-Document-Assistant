"use client";

import { useState } from "react";
import { PdfUploader } from "@/components/PdfUploader";
import { Chat } from "@/components/Chat";

interface DocumentState {
  id: string;
  filename: string;
}

export default function Home() {
  const [document, setDocument] = useState<DocumentState | null>(null);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 flex flex-col relative z-1">
        {!document ? (
          <PdfUploader
            onIndexed={(id, filename) => setDocument({ id, filename })}
          />
        ) : (
          <Chat
            documentId={document.id}
            filename={document.filename}
            onReset={() => setDocument(null)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 pt-4 px-4">
      <nav className="max-w-5xl mx-auto glass glass-specular rounded-2xl px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757L6.636 6.636" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 opacity-40 blur-md -z-1" />
          </div>
          <div className="leading-none">
            <h1 className="text-sm font-semibold tracking-tight text-white">
              Lumen
            </h1>
            <p className="text-[10px] text-white/40 mt-1">
              Document intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-[10px] text-emerald-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
          <a
            href="https://github.com/thapasubashb/AI-Powered-Document-Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-1 py-6 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between text-[11px] text-white/30">
        <p>Built with Next.js · Supabase pgvector · Google Gemini</p>
        <p className="hidden sm:block">Retrieval-Augmented Generation</p>
      </div>
    </footer>
  );
}