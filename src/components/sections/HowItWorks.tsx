export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload",
      desc: "Drop a PDF. We extract, clean, and chunk the text into ~1000-character passages.",
      icon: (
        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      ),
    },
    {
      n: "02",
      title: "Ask",
      desc: "Type any question. We embed it and search for the most similar passages using cosine similarity.",
      icon: (
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      ),
    },
    {
      n: "03",
      title: "Answer",
      desc: "The top 4 passages are sent to Gemini with strict grounding rules. You get an answer with page citations.",
      icon: (
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300/70 font-semibold mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Three steps.{" "}
            <span className="text-white/40">Zero hallucination.</span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Everything happens in a retrieval pipeline — never a black box.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="relative glass glass-specular rounded-2xl p-6 group hover:border-white/15 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Big number watermark */}
              <span className="absolute top-4 right-5 text-[3rem] leading-none font-semibold text-white/[0.04] group-hover:text-white/[0.06] transition-colors">
                {s.n}
              </span>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/15 to-rose-500/15 border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
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

              <p className="text-[10px] font-mono text-white/30 mb-2">
                Step {s.n}
              </p>
              <h3 className="text-base font-medium text-white mb-2">
                {s.title}
              </h3>
              <p className="text-[12.5px] text-white/45 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}