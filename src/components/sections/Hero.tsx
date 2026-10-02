"use client";

import { useState, useRef } from "react";

interface HeroProps {
  onIndexed: (documentId: string, filename: string) => void;
}

const STAGES = [
  "Extracting text…",
  "Cleaning artifacts…",
  "Chunking…",
  "Generating embeddings…",
  "Storing…",
];

export function Hero({ onIndexed }: HeroProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds the 10 MB limit.");
      return;
    }

    setUploading(true);
    setError("");
    setStageIndex(0);

    const ticker = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 1400);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Upload failed.");
      else onIndexed(data.documentId, data.filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      clearInterval(ticker);
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-72px)] flex items-center px-4 md:px-6 py-16"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass glass-specular text-[11px] text-slate-600 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
              <span>RAG · Powered by Gemini</span>
            </div>

            <h1 className="text-[2.75rem] leading-[1.05] md:text-[4.5rem] md:leading-[1.02] font-semibold tracking-[-0.035em] mb-6">
              <span className="block text-slate-900">Chat with</span>
              <span className="block mt-1 bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                any document
              </span>
            </h1>

            <p className="text-slate-500 text-base md:text-[17px] max-w-xl leading-relaxed mb-8">
              Upload a PDF. Ask questions in plain English. Get grounded
              answers with page citations — never a hallucination.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                No signup
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Data stays on server
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.6}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Open source
              </span>
            </div>
          </div>

          <div
            className="lg:col-span-6 animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-300/40 via-violet-300/30 to-rose-300/30 blur-3xl -z-1" />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !uploading && inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !uploading) {
                    inputRef.current?.click();
                  }
                }}
                className={`relative rounded-2xl glass-strong glass-specular overflow-hidden transition-all duration-300 group ${
                  isDragging
                    ? "scale-[1.01] border-sky-400/60"
                    : uploading
                      ? "cursor-wait"
                      : "cursor-pointer hover:border-sky-300/60"
                }`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInput}
                  disabled={uploading}
                  className="hidden"
                />

                {isDragging && (
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-100/60 via-violet-100/50 to-rose-100/50 pointer-events-none" />
                )}

                <div className="relative px-6 py-6">
                  {uploading ? (
                    <ProgressState stage={STAGES[stageIndex]} idx={stageIndex} />
                  ) : (
                    <IdleState isDragging={isDragging} />
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center">
              Everything runs on your server. Nothing leaves your infrastructure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IdleState({ isDragging }: { isDragging: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/30 flex-shrink-0 transition-all duration-300 ${
          isDragging ? "scale-110 shadow-sky-500/50" : "group-hover:scale-105"
        }`}
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white"
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

      <div className="flex-1 min-w-0 text-left">
        <p className="text-slate-900 text-[15px] md:text-base font-medium mb-1 truncate">
          {isDragging ? "Release to upload" : "Drop your PDF here"}
        </p>
        <p className="text-slate-500 text-xs">
          or click anywhere to browse · Max 10 MB
        </p>
      </div>
    </div>
  );
}

function ProgressState({ stage, idx }: { stage: string; idx: number }) {
  const progress = ((idx + 1) / 5) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-sky-500/30 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-white relative z-1 animate-spin-slow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          strokeLinecap="round"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-slate-900 text-[15px] font-medium mb-2">{stage}</p>
        <div className="h-0.5 rounded-full bg-slate-200 overflow-hidden max-w-[280px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-400 text-[10px] mt-2">
          Step {idx + 1} of 5
        </p>
      </div>
    </div>
  );
}