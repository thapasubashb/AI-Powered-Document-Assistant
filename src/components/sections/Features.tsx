export function Features() {
  const features = [
    {
      title: "Grounded answers",
      desc: "Every answer is generated only from retrieved passages. No external knowledge, no pre-training leakage.",
      color: "from-sky-100 to-sky-200/60 text-sky-600 border-sky-200",
      icon: (
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
    },
    {
      title: "Page-level citations",
      desc: "Every answer shows which pages it drew from, with cosine similarity scores — so you can verify the source.",
      color: "from-violet-100 to-violet-200/60 text-violet-600 border-violet-200",
      icon: (
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      ),
    },
    {
      title: "Honest refusals",
      desc: "If the answer isn't in the document, we say so — without even calling the LLM. No guessing. Ever.",
      color: "from-emerald-100 to-emerald-200/60 text-emerald-600 border-emerald-200",
      icon: (
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
    },
  ];

  const stats = [
    {
      value: "768",
      label: "Embedding dims",
      color: "from-sky-500 to-blue-600",
    },
    {
      value: "~1000",
      label: "Chars per chunk",
      color: "from-blue-500 to-violet-600",
    },
    {
      value: "Top-4",
      label: "Passages per query",
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      value: "0",
      label: "Hallucinations by design",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section id="features" className="relative px-4 md:px-6 py-20 md:py-24">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-14 animate-fade-in-up">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sky-600 font-semibold mb-3">
            Why it works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-4">
            Built for{" "}
            <span className="bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              trust
            </span>
          </h2>
          <p className="text-slate-500 text-[15px] max-w-2xl mx-auto">
            Every design decision here is about making AI answers verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-7 group hover:border-sky-300/50 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}
              >
                <svg
                  className="w-5 h-5"
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
              <h3 className="text-[15px] font-medium text-slate-900 mb-2.5">
                {f.title}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-5 animate-fade-in-up"
          style={{ animationDelay: "240ms" }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl px-5 py-7 text-center group hover:border-sky-300/50 transition-all duration-500"
            >
              <p
                className={`text-3xl md:text-4xl font-semibold tracking-tight bg-gradient-to-br ${s.color} bg-clip-text text-transparent mb-2`}
              >
                {s.value}
              </p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400 font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}