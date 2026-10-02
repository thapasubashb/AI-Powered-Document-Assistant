export function Pipeline() {
  const steps = [
    {
      n: "01",
      title: "Upload",
      desc: "A PDF lands on the server. We never touch your file after indexing.",
      color: "sky",
      icon: (
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      ),
    },
    {
      n: "02",
      title: "Extract",
      desc: "pdf-parse reads the raw text layer, page by page, into a single string.",
      color: "blue",
      icon: (
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      ),
    },
    {
      n: "03",
      title: "Clean",
      desc: "Regex strips page numbers, footers, control characters, and stray whitespace.",
      color: "violet",
      icon: (
        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
      ),
    },
    {
      n: "04",
      title: "Chunk",
      desc: "LangChain splits into ~1000-char passages with 200-char overlap to preserve context.",
      color: "indigo",
      icon: <path d="M4 6h16M4 10h16M4 14h10M4 18h10" />,
    },
    {
      n: "05",
      title: "Embed",
      desc: "Gemini converts each passage into a 768-dimensional vector of meaning.",
      color: "cyan",
      icon: (
        <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      ),
    },
    {
      n: "06",
      title: "Retrieve",
      desc: "Cosine similarity search finds the top-4 passages. Gemini answers, grounded in those only.",
      color: "emerald",
      icon: (
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      ),
    },
  ];

  const colorMap: Record<string, string> = {
    sky: "from-sky-100 to-sky-200/60 text-sky-600 border-sky-200",
    blue: "from-blue-100 to-blue-200/60 text-blue-600 border-blue-200",
    violet: "from-violet-100 to-violet-200/60 text-violet-600 border-violet-200",
    indigo: "from-indigo-100 to-indigo-200/60 text-indigo-600 border-indigo-200",
    cyan: "from-cyan-100 to-cyan-200/60 text-cyan-600 border-cyan-200",
    emerald: "from-emerald-100 to-emerald-200/60 text-emerald-600 border-emerald-200",
  };

  return (
    <section id="pipeline" className="relative px-4 md:px-6 py-20 md:py-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sky-600 font-semibold mb-3">
            The Pipeline
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            Six steps.{" "}
            <span className="text-slate-400">Zero hallucination.</span>
          </h2>
          <p className="text-slate-500 text-[15px] max-w-2xl mx-auto">
            Every stage runs on your server. Nothing is sent to third parties
            except the embeddings themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="glass rounded-2xl p-6 group hover:border-sky-300/50 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[s.color]} border flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                >
                  <svg
                    className="w-4 h-4"
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
                <span className="text-[1.75rem] leading-none font-semibold text-slate-200/80 group-hover:text-slate-300 transition-colors">
                  {s.n}
                </span>
              </div>

              <h3 className="text-[15px] font-medium text-slate-900 mb-2">
                {s.title}
              </h3>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}