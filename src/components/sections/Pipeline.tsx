export function Pipeline() {
  const steps = [
    {
      n: "01",
      title: "Upload",
      desc: "A PDF lands on the server. We never touch your file after indexing.",
    },
    {
      n: "02",
      title: "Extract",
      desc: "pdf-parse reads the raw text layer, page by page, into a single string.",
    },
    {
      n: "03",
      title: "Clean",
      desc: "Regex strips page numbers, footers, control characters, and stray whitespace.",
    },
    {
      n: "04",
      title: "Chunk",
      desc: "LangChain splits into ~1000-char passages with 200-char overlap to preserve context.",
    },
    {
      n: "05",
      title: "Embed",
      desc: "Gemini converts each passage into a 768-dimensional vector of meaning.",
    },
    {
      n: "06",
      title: "Retrieve",
      desc: "Cosine similarity search finds the top-4 passages. Gemini answers, grounded in those only.",
    },
  ];

  return (
    <section id="pipeline" className="relative px-4 md:px-6 py-24 md:py-32">
      <div className="w-full max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14 animate-fade-in-up">
          <p className="text-[12px] font-semibold tracking-wider text-[#7091E6] uppercase mb-3">
            The Pipeline
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] text-[#2A3659] mb-4">
            Six steps. Zero hallucination.
          </h2>
          <p className="text-[#8697C4] text-base leading-relaxed">
            Every stage runs on your server. Nothing leaves your infrastructure
            except the embeddings themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="glass glass-specular glass-interactive p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7091E6] to-[#3D52A0] flex items-center justify-center shadow-lg shadow-[#3D52A0]/25 mb-5">
                <span className="text-[13px] font-bold text-white">
                  {s.n}
                </span>
              </div>

              <h3 className="text-[15px] font-semibold text-[#2A3659] mb-2">
                {s.title}
              </h3>
              <p className="text-[13px] text-[#8697C4] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}