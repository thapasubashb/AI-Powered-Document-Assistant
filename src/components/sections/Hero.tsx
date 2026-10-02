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
      const res = await fetch("/api/upload", { method: "POST", body: formData });
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
      className="relative min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-3xl">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass glass-specular text-[11px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
            <span>RAG · Powered by Gemini</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-[2.5rem] leading-[1.1] md:text-[4rem] md:leading-[1.05] font-semibold tracking-[-0.035em] mb-5 animate-fade-in-up">
          <span className="block text-white/95">Chat with</span>
          <span className="block mt-1 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent">
            any document
          </span>
        </h1>

        <p
          className="text-center text-white/50 text-[15px] md:text-base max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          Upload a PDF. Ask questions in plain English. Get grounded answers
          with page citations — never a hallucination.
        </p>

        {/* Upload card */}
        <div
          className="relative animate-fade-in-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-amber-500/12 via-orange-500/8 to-rose-500/12 blur-3xl -z-1" />

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
            className={`relative rounded-2xl glass glass-specular overflow-hidden transition-all duration-300 group ${
              isDragging
                ? "scale-[1.01] border-amber-400/50"
                : uploading
                  ? "cursor-wait"
                  : "cursor-pointer hover:border-white/20"
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

            {/* Animated glow on drag */}
            {isDragging && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 pointer-events-none" />
            )}

            <div className="relative px-5 py-5 md:px-6 md:py-5 flex items-center gap-4">
              {uploading ? (
                <ProgressState stage={STAGES[stageIndex]} idx={stageIndex} />
              ) : (
                <IdleState isDragging={isDragging} />
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mt-4 p-3 rounded-xl glass border-red-500/25 bg-red-500/[0.05] text-red-200 text-xs animate-fade-in flex items-start gap-2.5"
            role="alert"
          >
            <svg
              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Trust hints */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-[10.5px] text-white/25 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            No signup
          </span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Data stays on server
          </span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Open source
          </span>
        </div>

        {/* Scroll hint */}
        <div
          className="flex justify-center mt-14 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <a
            href="#pipeline"
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 group"
          >
            <span>See the pipeline</span>
            <svg
              className="w-3 h-3 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */

function IdleState({ isDragging }: { isDragging: boolean }) {
  return (
    <>
      {/* Gradient icon */}
      <div
        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0 transition-all duration-300 ${
          isDragging ? "scale-110 shadow-amber-500/50" : "group-hover:scale-105"
        }`}
      >
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-white"
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

      {/* Text */}
      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm md:text-[15px] font-medium mb-0.5 truncate">
          {isDragging ? "Release to upload" : "Drop your PDF anywhere"}
        </p>
        <p className="text-white/40 text-[11px] md:text-xs">
          Max 10 MB · Text-based PDFs · 15–45 seconds
        </p>
      </div>

      {/* Secondary button — hidden on small screens where card is fully tappable */}
      <button
        type="button"
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/20 text-white text-xs font-medium transition-all flex-shrink-0 pointer-events-none"
      >
        Choose file
        <svg
          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </>
  );
}

function ProgressState({ stage, idx }: { stage: string; idx: number }) {
  const progress = ((idx + 1) / 5) * 100;

  return (
    <>
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <svg
          className="w-5 h-5 md:w-6 md:h-6 text-white relative z-1 animate-spin-slow"
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
        <p className="text-white text-sm md:text-[15px] font-medium mb-1.5">
          {stage}
        </p>
        <div className="h-0.5 rounded-full bg-white/[0.08] overflow-hidden max-w-[240px]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="hidden sm:block text-white/35 text-[11px] flex-shrink-0">
        Step {idx + 1} of 5
      </p>
    </>
  );
}