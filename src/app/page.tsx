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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white">
                Smart PDF Reader
              </h1>
              <p className="text-[11px] text-white/40">
                RAG-powered document assistant
              </p>
            </div>
          </div>
          <a
            href="https://github.com/thapasubashb/AI-Powered-Document-Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white/90 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
            </svg>
            Source
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col">
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
    </div>
  );
}