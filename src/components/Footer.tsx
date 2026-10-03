const AUTHOR = {
  name: "Subash Thapa",
  role: "Full-Stack Developer · AI Engineering",
  location: "Karnataka, India",
  initials: "ST",
};

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

const CONNECT_LINKS = [
  {
    icon: "github" as const,
    label: "GitHub",
    href: "https://github.com/thapasubashb",
  },
  {
    icon: "linkedin" as const,
    label: "B Subash",
    href: "https://www.linkedin.com/in/b-subash",
  },
  {
    icon: "instagram" as const,
    label: "subash._.10",
    href: "https://www.instagram.com/subash._.10",
  },
  {
    icon: "mail" as const,
    label: "thapasubash9072",
    href: "mailto:thapasubash9072@gmail.com",
  },
];

export function Footer() {
  return (
    <footer className="relative mt-auto px-4 md:px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Top hairline — subtle separator, not a card */}
        <div className="h-px w-full bg-gradient-to-r from-transparent to-transparent mb-14" />

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-14">
          {/* Author */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7091E6] via-[#3D52A0] to-[#3D52A0] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#3D52A0]/30">
                  {AUTHOR.initials}
                </div>
                <div className="absolute -inset-1 rounded-xl bg-[#7091E6] opacity-30 blur-md -z-1" />
              </div>
              <div>
                <p className="text-[#2A3659] font-semibold tracking-tight text-[14px]">
                  {AUTHOR.name}
                </p>
                <p className="text-[#8697C4] text-[11.5px]">{AUTHOR.role}</p>
              </div>
            </div>

            <p className="text-[#8697C4] text-[13px] leading-relaxed mb-4 max-w-sm">
              Built this to explore retrieval-augmented generation and
              production AI patterns. Open to opportunities in AI engineering.
            </p>

            <p className="text-[11px] text-[#ADBBDA] flex items-center gap-1.5">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {AUTHOR.location}
            </p>
          </div>

          <div className="md:col-span-2">
            <FooterColumn title="Product" links={PRODUCT_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Resources" links={RESOURCE_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Built with" links={TECH_LINKS} />
          </div>
          <div className="md:col-span-2">
            <ConnectColumn title="Connect" links={CONNECT_LINKS} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#ADBBDA]/30">
          <p className="text-[#ADBBDA] text-[12px] flex items-center gap-1.5">
            <span>Crafted by</span>
            <a
              href="https://github.com/thapasubashb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#7091E6] hover:text-[#3D52A0] transition-colors font-medium"
            >
              {AUTHOR.name}
            </a>
            <span className="text-[#ADBBDA] mx-0.5">·</span>
            <span>© {new Date().getFullYear()}</span>
          </p>

          <div className="flex items-center gap-3 text-[11px] text-[#ADBBDA]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-300/60 bg-emerald-50/70 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems normal
            </span>
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
      <h4 className="text-[11px] font-semibold text-[#2A3659] mb-4 uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[13px] text-[#8697C4] hover:text-[#7091E6] transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConnectColumn({
  title,
  links,
}: {
  title: string;
  links: {
    icon: "github" | "linkedin" | "instagram" | "mail";
    label: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-[#2A3659] mb-4 uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2.5 text-[13px] text-[#8697C4] hover:text-[#7091E6] transition-colors"
            >
              <span className="w-6 h-6 rounded-md bg-white/70 border border-white flex items-center justify-center text-[#7091E6] group-hover:border-[#ADBBDA] transition-colors">
                <SocialIcon name={l.icon} />
              </span>
              <span>{l.label}</span>
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
  const common = "w-3 h-3";

  if (name === "github") {
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }

  return (
    <svg
      className={common}
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