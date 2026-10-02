// "use client";

// import { useState, useRef } from "react";

// interface PdfUploaderProps {
//   onIndexed: (documentId: string, filename: string) => void;
// }

// const STAGES = [
//   "Extracting text from PDF…",
//   "Cleaning formatting artifacts…",
//   "Splitting into semantic chunks…",
//   "Generating vector embeddings…",
//   "Storing in the vector database…",
// ];

// export function PdfUploader({ onIndexed }: PdfUploaderProps) {
//   const [uploading, setUploading] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [error, setError] = useState("");
//   const [stageIndex, setStageIndex] = useState(0);
//   const inputRef = useRef<HTMLInputElement>(null);

//   async function uploadFile(file: File) {
//     if (file.type !== "application/pdf") {
//       setError("Only PDF files are supported.");
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       setError("File exceeds the 10 MB limit.");
//       return;
//     }

//     setUploading(true);
//     setError("");
//     setStageIndex(0);

//     const ticker = setInterval(() => {
//       setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
//     }, 1400);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       if (!res.ok) setError(data.error || "Upload failed.");
//       else onIndexed(data.documentId, data.filename);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unknown error");
//     } finally {
//       clearInterval(ticker);
//       setUploading(false);
//     }
//   }

//   function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (file) uploadFile(file);
//   }

//   function handleDrop(e: React.DragEvent<HTMLDivElement>) {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files?.[0];
//     if (file) uploadFile(file);
//   }

//   return (
//     <div className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
//       <div className="w-full max-w-3xl">
//         {/* ══ HERO ══ */}
//         <div className="text-center mb-14 animate-fade-in-up">
//           <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass glass-specular text-[11px] text-white/60 mb-8">
//             <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
//             <span>Retrieval-Augmented Generation · Powered by Gemini</span>
//           </div>

//           <h1 className="text-[2.75rem] leading-[1.08] md:text-[4.5rem] md:leading-[1.02] font-semibold tracking-[-0.035em] mb-6">
//             <span className="block text-white/95">Chat with</span>
//             <span className="block mt-2 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300 bg-clip-text text-transparent">
//               any document
//             </span>
//           </h1>

//           <p className="text-white/50 text-[15px] md:text-lg max-w-xl mx-auto leading-relaxed mb-3">
//             Upload a PDF. Ask questions in plain English. Get grounded answers
//             with exact page citations — never a hallucination.
//           </p>
//           <p className="text-white/25 text-xs">
//             Free · No signup · Your files stay on your server
//           </p>
//         </div>

//         {/* ══ UPLOAD CARD ══ */}
//         <div
//           className="relative animate-fade-in-up"
//           style={{ animationDelay: "100ms" }}
//         >
//           <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-rose-500/15 blur-3xl -z-1" />

//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//             onClick={() => !uploading && inputRef.current?.click()}
//             role="button"
//             tabIndex={0}
//             onKeyDown={(e) => {
//               if ((e.key === "Enter" || e.key === " ") && !uploading) {
//                 inputRef.current?.click();
//               }
//             }}
//             className={`relative group rounded-3xl glass glass-specular overflow-hidden transition-all duration-500 ${
//               isDragging
//                 ? "scale-[1.015] border-amber-400/40"
//                 : uploading
//                   ? "cursor-wait"
//                   : "cursor-pointer hover:scale-[1.005] hover:border-white/20"
//             }`}
//           >
//             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_-30%,rgba(245,158,11,0.12),transparent_55%)]" />

//             <input
//               ref={inputRef}
//               type="file"
//               accept="application/pdf"
//               onChange={handleFileInput}
//               disabled={uploading}
//               className="hidden"
//             />

//             <div className="relative px-8 py-14 md:px-14 md:py-18">
//               {uploading ? (
//                 <UploadProgress stage={STAGES[stageIndex]} stageIdx={stageIndex} />
//               ) : (
//                 <IdleState isDragging={isDragging} />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ══ ERROR ══ */}
//         {error && (
//           <div
//             className="mt-5 p-4 rounded-2xl glass border-red-500/25 bg-red-500/[0.05] text-red-200 text-sm animate-fade-in flex items-start gap-3"
//             role="alert"
//           >
//             <svg
//               className="w-4 h-4 flex-shrink-0 mt-0.5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span>{error}</span>
//           </div>
//         )}

//         {/* ══ FEATURES ══ */}
//         <div
//           id="features"
//           className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 animate-fade-in-up"
//           style={{ animationDelay: "200ms" }}
//         >
//           <FeatureCard
//             title="Grounded answers"
//             desc="Answers come only from your document — never outside knowledge."
//             icon={
//               <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             }
//           />
//           <FeatureCard
//             title="Page-level citations"
//             desc="Every answer includes the exact pages and similarity scores it used."
//             icon={
//               <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//             }
//           />
//           <FeatureCard
//             title="Honest refusals"
//             desc="If the answer isn't in the document, it says so instead of guessing."
//             icon={
//               <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function IdleState({ isDragging }: { isDragging: boolean }) {
//   return (
//     <div className="flex flex-col items-center gap-6 text-center">
//       <div className="relative">
//         <div
//           className={`w-18 h-18 md:w-20 md:h-20 rounded-2xl glass-strong flex items-center justify-center transition-all duration-500 ${
//             isDragging ? "scale-110" : ""
//           }`}
//         >
//           <svg
//             className={`w-8 h-8 md:w-9 md:h-9 transition-colors duration-300 ${
//               isDragging ? "text-amber-300" : "text-white/60"
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             strokeWidth={1.6}
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//           </svg>
//         </div>
//         {isDragging && (
//           <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-amber-500/25 to-rose-500/25 blur-xl -z-1 animate-glow-pulse" />
//         )}
//       </div>

//       <div>
//         <p className="text-white text-lg font-medium mb-1.5">
//           {isDragging ? "Drop to upload" : "Drop a PDF anywhere"}
//         </p>
//         <p className="text-white/40 text-sm">
//           or{" "}
//           <span className="text-amber-300 underline underline-offset-4 decoration-amber-300/30 hover:decoration-amber-300 transition-colors">
//             browse files
//           </span>{" "}
//           from your computer
//         </p>
//       </div>

//       <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/30 mt-1">
//         <span className="flex items-center gap-1.5">
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//           Max 10 MB
//         </span>
//         <span className="w-1 h-1 rounded-full bg-white/15" />
//         <span className="flex items-center gap-1.5">
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//           Text-based PDFs
//         </span>
//         <span className="w-1 h-1 rounded-full bg-white/15" />
//         <span className="flex items-center gap-1.5">
//           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//           </svg>
//           15–45 seconds
//         </span>
//       </div>
//     </div>
//   );
// }

// function UploadProgress({
//   stage,
//   stageIdx,
// }: {
//   stage: string;
//   stageIdx: number;
// }) {
//   const progress = ((stageIdx + 1) / STAGES.length) * 100;

//   return (
//     <div className="flex flex-col items-center gap-6 text-center">
//       <div className="relative">
//         <div className="w-18 h-18 md:w-20 md:h-20 rounded-2xl glass-strong flex items-center justify-center relative overflow-hidden">
//           <div className="absolute inset-0 shimmer" />
//           <svg
//             className="w-8 h-8 md:w-9 md:h-9 text-amber-300 relative z-1 animate-spin-slow"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             strokeWidth={1.6}
//             strokeLinecap="round"
//           >
//             <path d="M21 12a9 9 0 11-6.219-8.56" />
//           </svg>
//         </div>
//         <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-amber-500/25 to-rose-500/25 blur-2xl -z-1 animate-glow-pulse" />
//       </div>

//       <div>
//         <p className="text-white text-lg font-medium mb-1.5">{stage}</p>
//         <p className="text-white/35 text-xs">
//           Step {stageIdx + 1} of {STAGES.length} · Estimated 15–45 seconds
//         </p>
//       </div>

//       <div className="w-64 max-w-full">
//         <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-700 ease-out"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// function FeatureCard({
//   title,
//   desc,
//   icon,
// }: {
//   title: string;
//   desc: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="glass glass-specular rounded-2xl p-5 group hover:border-white/15 transition-all duration-500">
//       <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/12 to-rose-500/12 border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
//         <svg
//           className="w-4 h-4 text-amber-300"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           strokeWidth={1.8}
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           {icon}
//         </svg>
//       </div>
//       <h3 className="text-[13px] font-medium text-white mb-1.5">{title}</h3>
//       <p className="text-[12px] text-white/40 leading-relaxed">{desc}</p>
//     </div>
//   );
// }