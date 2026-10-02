interface FeaturesProps {
  onScrollToTop: () => void;
}

export function Features({ onScrollToTop }: FeaturesProps) {
  const features = [
    {
      title: "Grounded answers",
      desc: "Every answer is generated only from retrieved passages. No external knowledge, no pre-training leakage.",
      icon: (
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    },
    {
      title: "Page-level citations",
      desc: "Every answer shows which pages it drew from, with cosine similarity scores — so you can verify the source.",
      icon: (
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      ),
    },
    {
      title: "Honest refusals",
      desc: "If the answer isn't in the document, we say so — without even calling the LLM. No guessing. Ever.",
      icon: (
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
    },
  ];

  return (
    <section
      id="features"
      className="relative min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-5xl">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300/70 font-semibold mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Built for{" "}
            <span className="bg-gradient-to-br from-amber-200 to-rose-300 bg-clip-text text-transparent">
              trust
            </span>
          </h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">
            Every design decision here is about making AI answers verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass glass-specular rounded-2xl p-6 group hover:border-white/15 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
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
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-base font-medium text-white mb-2">
                {f.title}
              </h3>
              <p className="text-[12.5px] text-white/45 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="relative glass-strong glass-specular rounded-3xl p-8 md:p-10 text-center overflow-hidden animate-fade-in-up">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_-20%,rgba(245,158,11,0.15),transparent_60%)]" />

          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
              Ready to try it?
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              Drop a PDF at the top of the page and start asking questions in
              seconds.
            </p>
            <button
              onClick={onScrollToTop}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white text-sm font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/45 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Upload a PDF
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}