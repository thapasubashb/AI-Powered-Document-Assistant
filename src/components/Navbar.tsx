"use client";

interface NavbarProps {
  onNavigate?: (anchor: string) => void;
  onHome?: () => void;
}

export function Navbar({ onNavigate, onHome }: NavbarProps) {
  function handleNav(e: React.MouseEvent, anchor: string) {
    e.preventDefault();
    onNavigate?.(anchor);
  }

  function handleHome(e: React.MouseEvent) {
    e.preventDefault();
    onHome?.();
  }

  return (
    <header className="sticky top-0 z-50 px-4 md:px-6 pt-3 animate-fade-in">
      <nav className="max-w-7xl mx-auto glass-strong glass-specular rounded-2xl px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={handleHome}
          className="flex items-center gap-2.5 group text-left"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7091E6] via-[#3D52A0] to-[#3D52A0] flex items-center justify-center shadow-lg shadow-[#3D52A0]/30 group-hover:scale-105 transition-transform">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364l-2.121 2.121M8.757 15.243l-2.121 2.121m12.728 0l-2.121-2.121M8.757 8.757L6.636 6.636" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-lg bg-[#7091E6] opacity-40 blur-md -z-1" />
          </div>
          <div className="leading-none">
            <span className="text-[13px] font-semibold tracking-tight text-[#2A3659]">
              VikSub
            </span>
            <p className="text-[10px] text-[#8697C4] mt-0.5">
              Document intelligence
            </p>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          <a
            href="#pipeline"
            onClick={(e) => handleNav(e, "#pipeline")}
            className="px-3 py-1.5 rounded-lg text-[13px] text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors font-medium"
          >
            Pipeline
          </a>
          <a
            href="#features"
            onClick={(e) => handleNav(e, "#features")}
            className="px-3 py-1.5 rounded-lg text-[13px] text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="https://github.com/thapasubashb/AI-Powered-Document-Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-[13px] text-[#8697C4] hover:text-[#3D52A0] hover:bg-white/60 transition-colors font-medium"
          >
            Docs
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-300/70 bg-emerald-50/70 text-[10px] text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
          <a
            href="https://github.com/thapasubashb/AI-Powered-Document-Assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-[#3D52A0] hover:text-[#2A3659] bg-white/60 hover:bg-white border border-white/80 hover:border-[#ADBBDA] transition-all font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 .3z" />
            </svg>
            <span className="hidden sm:inline">Star</span>
          </a>
        </div>
      </nav>
    </header>
  );
}