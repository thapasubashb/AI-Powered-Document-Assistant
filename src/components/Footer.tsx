const AUTHOR = {
  name: "Subash Thapa",
  role: "Full-Stack Developer · AI Engineering",
  location: "Karnataka, India",
  email: "thapasubash9072@gmail.com",
  initials: "ST",
};

const SOCIALS = [
  {
    name: "GitHub",
    href: "https://github.com/thapasubashb",
    icon: "github" as const,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/b-subash",
    icon: "linkedin" as const,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/subash._.10",
    icon: "instagram" as const,
  },
  {
    name: "Email",
    href: "mailto:thapasubash9072@gmail.com",
    icon: "mail" as const,
  },
];

const PRODUCT_LINKS = [
  { label: "Upload", href: "#hero" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Features", href: "#features" },
];

const RESOURCE_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/thapasubashb/AI-Powered-Document-Assistant",
  },
  {
    label: "README",
    href: "https://github.com/thapasubashb/AI-Powered-Document-Assistant#readme",
  },
  {
    label: "Report issue",
    href: "https://github.com/thapasubashb/AI-Powered-Document-Assistant/issues",
  },
];

const TECH_LINKS = [
  { label: "Next.js 16", href: "https://nextjs.org" },
  { label: "Supabase", href: "https://supabase.com" },
  { label: "Gemini", href: "https://ai.google.dev" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-slate-200/70">
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-16 left-1/4 w-[400px] h-[200px] rounded-full bg-gradient-to-r from-sky-300/40 via-violet-300/30 to-rose-300/30 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-8">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-violet-500 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-sky-500/20">
                {AUTHOR.initials}
              </div>
              <div>
                <p className="text-slate-900 font-medium tracking-tight text-[13.5px]">
                  {AUTHOR.name}
                </p>
                <p className="text-slate-500 text-[11px]">{AUTHOR.role}</p>
              </div>
            </div>

            <p className="text-slate-500 text-[12.5px] leading-relaxed mb-5 max-w-sm">
              Built this to explore retrieval-augmented generation and
              production AI patterns. Open to opportunities in AI engineering.
            </p>

            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-md glass flex items-center justify-center text-slate-500 hover:text-sky-600 hover:scale-110 hover:border-sky-300 transition-all duration-200"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <FooterColumn title="Product" links={PRODUCT_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          </div>
          <div className="md:col-span-3">
            <FooterColumn title="Built with" links={TECH_LINKS} />
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <span>Crafted with</span>
            <svg
              className="w-2.5 h-2.5 text-rose-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>by</span>
            <a
              href="https://github.com/thapasubashb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              {AUTHOR.name}
            </a>
            <span className="text-slate-300 mx-0.5">·</span>
            <span>© {new Date().getFullYear()}</span>
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-700">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
            <span className="text-slate-300">·</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-3">
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={
                l.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="text-[12px] text-slate-500 hover:text-sky-600 transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  name,
}: {
  name: "github" | "linkedin" | "instagram" | "mail";
}) {
  if (name === "github") {
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }

  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}