"use client";

import { useState, useRef } from "react";

interface PdfUploaderProps {
  onIndexed: (documentId: string, filename: string) => void;
}

export function PdfUploader({ onIndexed }: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [progressLabel, setProgressLabel] = useState("");
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
    setProgressLabel("Extracting text…");

    const formData = new FormData();
    formData.append("file", file);

    // Cosmetic stage updates while the request runs
    const stages = [
      "Extracting text…",
      "Cleaning formatting…",
      "Chunking into passages…",
      "Generating embeddings…",
      "Storing in vector database…",
    ];
    let stageIdx = 0;
    const ticker = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, stages.length - 1);
      setProgressLabel(stages[stageIdx]);
    }, 1400);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        onIndexed(data.documentId, data.filename);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      clearInterval(ticker);
      setUploading(false);
      setProgressLabel("");
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
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/60 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Gemini &amp; pgvector
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight">
            Chat with any{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              PDF
            </span>
          </h2>
          <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
            Upload a document. Ask questions. Get answers grounded in the source
            material with exact page citations.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 group ${
            isDragging
              ? "border-violet-400 bg-violet-500/10 scale-[1.02]"
              : uploading
                ? "border-white/10 bg-white/[0.02] cursor-wait"
                : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
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

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">
                  {progressLabel || "Processing…"}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  This usually takes 15–45 seconds
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDragging
                    ? "bg-violet-500/20 scale-110"
                    : "bg-white/5 group-hover:bg-white/10"
                }`}
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    isDragging ? "text-violet-300" : "text-white/60"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium mb-1">
                  {isDragging ? "Drop your PDF here" : "Drop a PDF or click to browse"}
                </p>
                <p className="text-white/40 text-xs">
                  Max 10 MB · Text-based PDFs only
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm animate-fade-in flex items-start gap-3">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
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

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-3 mt-8 animate-fade-in">
          {[
            {
              label: "Grounded answers",
              desc: "Only from your document",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              ),
            },
            {
              label: "Page citations",
              desc: "Every answer sourced",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              ),
            },
            {
              label: "No hallucination",
              desc: "Says 'I don't know' honestly",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              ),
            },
          ].map((f, i) => (
            <div
              key={f.label}
              className="p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <svg
                className="w-4 h-4 text-violet-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                {f.icon}
              </svg>
              <p className="text-white/80 text-xs font-medium">{f.label}</p>
              <p className="text-white/40 text-[11px] mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}