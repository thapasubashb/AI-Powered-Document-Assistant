export function Features() {
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

  const stats = [
    { value: "768", label: "Embedding dims" },
    { value: "~1000", label: "Chars per chunk" },
    { value: "Top-4", label: "Passages per query" },
    { value: "0", label: "Hallucinations" },
  ];

  return (
    <section id="features" className="relative px-4 md:px-6 py-24 md:py-32">
      <div className="w-full max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14 animate-fade-in-up">
          <p className="text-[12px] font-semibold tracking-wider text-[#7091E6] uppercase mb-3">
            Why it works
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] text-[#2A3659] mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-[#7091E6] to-[#3D52A0] bg-clip-text text-transparent">
              trust
            </span>
          </h2>
          <p className="text-[#8697C4] text-base leading-relaxed">
            Every design decision here is about making AI answers verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="relative glass glass-specular glass-interactive p-7 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7091E6] to-[#3D52A0] flex items-center justify-center shadow-lg shadow-[#3D52A0]/25 mb-5">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {f.icon}
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-[#2A3659] mb-2.5">
                  {f.title}
                </h3>
                <p className="text-[13px] text-[#8697C4] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="glass glass-specular p-6 text-center animate-fade-in-up"
              style={{ animationDelay: `${240 + i * 50}ms` }}
            >
              <p className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] bg-gradient-to-br from-[#7091E6] to-[#3D52A0] bg-clip-text text-transparent mb-2">
                {s.value}
              </p>
              <p className="text-[11px] text-[#8697C4] font-medium uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}