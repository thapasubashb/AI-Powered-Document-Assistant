"use client";

import { useState, useRef } from "react";
import { Reveal } from "@/components/Reveal";

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
      className="relative flex items-center px-4 md:px-6 pt-16 pb-24 md:pt-24 md:pb-32"
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6">
            <Reveal direction="up" duration={700}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] text-[#3D52A0] font-medium mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#7091E6] to-[#3D52A0] animate-pulse" />
                <span>Retrieval-Augmented Generation</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={100}>
              <h1 className="text-[2.75rem] leading-[1.05] md:text-[4.25rem] md:leading-[1.02] font-semibold tracking-[-0.035em] mb-6">
                <span className="block text-[#2A3659]">Chat with</span>
                <span className="block mt-1 pb-2 bg-gradient-to-r from-[#7091E6] via-[#3D52A0] to-[#3D52A0] bg-clip-text text-transparent">
                  any document
                </span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <p className="text-[#8697C4] text-base md:text-[17px] max-w-xl leading-relaxed mb-8">
                Upload a PDF. Ask questions in plain English. Get grounded
                answers with page citations — never a hallucination.
              </p>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[#8697C4] font-medium">
                <span className="flex items-center gap-2 group cursor-default">
                  <span className="w-5 h-5 rounded-full bg-white/70 border border-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <svg
                      className="w-3 h-3 text-[#7091E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  No signup required
                </span>
                <span className="flex items-center gap-2 group cursor-default">
                  <span className="w-5 h-5 rounded-full bg-white/70 border border-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <svg
                      className="w-3 h-3 text-[#7091E6]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  Data stays on your server
                </span>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Upload */}
          <div className="lg:col-span-6">
            <Reveal direction="up" delay={200} duration={800}>
              <div className="relative">
                <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-[#ADBBDA]/50 via-[#7091E6]/25 to-[#3D52A0]/15 blur-3xl -z-1 animate-breathe" />

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
                  className={`relative glass-strong glass-specular rounded-3xl px-8 py-14 cursor-pointer overflow-hidden transition-all duration-300 ${
                    isDragging
                      ? "scale-[1.02] border-[#7091E6]/60"
                      : uploading
                        ? "cursor-wait"
                        : "hover:scale-[1.01] hover:border-[#ADBBDA]"
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
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7091E6]/15 via-[#ADBBDA]/15 to-[#3D52A0]/10 pointer-events-none" />
                  )}

                  <div className="relative">
                    {uploading ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7091E6] via-[#3D52A0] to-[#3D52A0] flex items-center justify-center shadow-lg shadow-[#3D52A0]/40">
                            <svg
                              className="w-7 h-7 text-white animate-spin-slow"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2.2}
                              strokeLinecap="round"
                            >
                              <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                          </div>
                          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#7091E6]/50 to-[#3D52A0]/40 blur-xl -z-1 animate-float" />
                        </div>
                        <p className="text-[#2A3659] text-[15px] font-semibold mb-1">
                          {STAGES[stageIndex]}
                        </p>
                        <p className="text-[#8697C4] text-xs mb-5">
                          Step {stageIndex + 1} of {STAGES.length}
                        </p>
                        <div className="w-56 h-1.5 rounded-full bg-white/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7091E6] to-[#3D52A0] transition-all duration-700 ease-out"
                            style={{
                              width: `${
                                ((stageIndex + 1) / STAGES.length) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-5">
                          <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7091E6] via-[#3D52A0] to-[#3D52A0] flex items-center justify-center shadow-lg shadow-[#3D52A0]/40 transition-transform duration-300 ${
                              isDragging
                                ? "scale-110"
                                : "hover:scale-105"
                            }`}
                          >
                            <svg
                              className="w-7 h-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#7091E6]/40 to-[#3D52A0]/30 blur-xl -z-1" />
                        </div>
                        <p className="text-[#2A3659] text-[15px] font-semibold mb-1.5">
                          {isDragging
                            ? "Release to upload"
                            : "Drop a PDF to begin"}
                        </p>
                        <p className="text-[#8697C4] text-xs">
                          or{" "}
                          <span className="bg-gradient-to-r from-[#7091E6] to-[#3D52A0] bg-clip-text text-transparent font-semibold">
                            browse files
                          </span>{" "}
                          · Max 10 MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>

            {error && (
              <div className="mt-4 px-4 py-3 rounded-2xl glass border-red-300/60 bg-red-50/70 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-px"
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

            <Reveal direction="up" delay={400}>
              <p className="text-[11px] text-[#8697C4] mt-4 text-center">
                Indexing takes 15–45 seconds for a typical PDF
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}