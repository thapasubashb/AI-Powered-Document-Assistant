"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Pipeline } from "@/components/sections/Pipeline";
import { Features } from "@/components/sections/Features";
import { Chat } from "@/components/Chat";

interface DocumentState {
  id: string;
  filename: string;
}

export default function Home() {
  const [currentDoc, setCurrentDoc] = useState<DocumentState | null>(null);
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  useEffect(() => {
    if (view === "landing" && pendingAnchor) {
      const id = setTimeout(() => {
        const el = window.document.querySelector(pendingAnchor);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setPendingAnchor(null);
      }, 60);
      return () => clearTimeout(id);
    }
  }, [view, pendingAnchor]);

  function navigateTo(anchor: string) {
    if (view === "chat") {
      setPendingAnchor(anchor);
      setView("landing");
    } else {
      const el = window.document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function goHome() {
    if (view === "chat") {
      setPendingAnchor("#hero");
      setView("landing");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  if (view === "chat" && currentDoc) {
    return (
      <>
        <Navbar onNavigate={navigateTo} onHome={goHome} />
        <main className="flex-1 flex flex-col">
          <Chat
            documentId={currentDoc.id}
            filename={currentDoc.filename}
            onReset={() => {
              setCurrentDoc(null);
              setView("landing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar onNavigate={navigateTo} onHome={goHome} />
      <main className="flex-1">
        <Hero
          onIndexed={(id, filename) => {
            setCurrentDoc({ id, filename });
            setView("chat");
          }}
        />
        <Pipeline />
        <Features />
      </main>
      <Footer />

      {currentDoc && (
        <button
          onClick={() => setView("chat")}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-3 rounded-full glass-strong glass-specular text-[#2A3659] text-[13px] font-semibold hover:-translate-y-0.5 transition-all shadow-xl shadow-[#3D52A0]/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#7091E6] opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7091E6]" />
          </span>
          <span className="truncate max-w-[180px]">
            Resume chat · {currentDoc.filename}
          </span>
          <svg
            className="w-3.5 h-3.5 text-[#7091E6]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.4}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M13 6l6 6-6 6"
            />
          </svg>
        </button>
      )}
    </>
  );
}