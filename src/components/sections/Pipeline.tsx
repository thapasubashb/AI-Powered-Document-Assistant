export function Pipeline() {
  const steps = [
    {
      n: "01",
      title: "Upload",
      desc: "A PDF lands on the server. We never touch your file after indexing.",
      icon: (
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
    },
    {
      n: "02",
      title: "Extract",
      desc: "pdf-parse reads the raw text layer, page by page, into a single string.",
      icon: (
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      ),
    },
    {
      n: "03",
      title: "Clean",
      desc: "Regex strips page numbers, footers, control characters, and stray whitespace.",
      icon: (
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
      ),
    },
    {
      n: "04",
      title: "Chunk",
      desc: "LangChain splits into ~1000-char passages with 200-char overlap to preserve context.",
      icon: (
        <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />
      ),
    },
    {
      n: "05",
      title: "Embed",
      desc: "Gemini converts each passage into a 768-dimensional vector of meaning.",
      icon: (
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      ),
    },
    {
      n: "06",
      title: "Retrieve",
      desc: "Cosine similarity search finds the top-4 passages. Gemini answers, grounded in those only.",
      icon: (
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      ),
    },
  ];

  return (
    <section
      id="pipeline"
      className="relative px-4 py-24 md:py-28"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300/70 font-semibold mb-3">
            The Pipeline
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Six steps.{" "}
            <span className="text-white/40">Zero hallucination.</span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Every stage runs on your server. Nothing is sent to third parties
            except the embeddings themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="glass glass-specular rounded-2xl p-5 group hover:border-white/15 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/15 to-rose-500/15 border border-white/[0.08] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg
                  className="w-4 h-4 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </div>
              <p className="text-[10px] font-mono text-white/25 mb-1.5">
                {s.n}
              </p>
              <h3 className="text-[13.5px] font-medium text-white mb-1.5">
                {s.title}
              </h3>
              <p className="text-[12px] text-white/45 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}