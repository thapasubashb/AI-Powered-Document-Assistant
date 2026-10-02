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
      className="relative min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-3xl">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass glass-specular text-[11px] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
            <span>RAG · Powered by Gemini</span>
          </div>
        </div>

        {/* Headline — tighter than before */}
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

        {/* COMPACT UPLOAD — horizontal, ~90px tall */}
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
            className={`relative rounded-2xl glass glass-specular transition-all duration-300 group ${
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

            <div className="px-5 py-5 md:px-6 md:py-5 flex items-center gap-4">
              {uploading ? (
                <CompactProgress stage={STAGES[stageIndex]} idx={stageIndex} />
              ) : (
                <CompactIdle isDragging={isDragging} />
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

        {/* Scroll hint */}
        <div
          className="flex justify-center mt-10 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <a
            href="#how-it-works"
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 group"
          >
            <span>See how it works</span>
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

function CompactIdle({ isDragging }: { isDragging: boolean }) {
  return (
    <>
      <div
        className={`w-11 h-11 rounded-xl glass-strong flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isDragging ? "scale-110 border-amber-400/40" : ""
        }`}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isDragging ? "text-amber-300" : "text-white/60"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium mb-0.5 truncate">
          {isDragging ? "Release to upload" : "Drop a PDF or click to browse"}
        </p>
        <p className="text-white/35 text-[11px]">
          Max 10 MB · Text-based PDFs only
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white text-xs font-medium shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Choose file
        </button>
      </div>
    </>
  );
}

function CompactProgress({ stage, idx }: { stage: string; idx: number }) {
  const progress = ((idx + 1) / 5) * 100;

  return (
    <>
      <div className="w-11 h-11 rounded-xl glass-strong flex items-center justify-center flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <svg
          className="w-5 h-5 text-amber-300 relative z-1 animate-spin-slow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>

      <div className="flex-1 min-w-0 text-left">
        <p className="text-white text-sm font-medium mb-1">{stage}</p>
        <div className="h-0.5 rounded-full bg-white/[0.06] overflow-hidden max-w-[200px]">
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