"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { Chat } from "@/components/Chat";

interface DocumentState {
  id: string;
  filename: string;
}

export default function Home() {
  const [document, setDocument] = useState<DocumentState | null>(null);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Chat mode — fullscreen, no landing sections, no footer
  if (document) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Chat
            documentId={document.id}
            filename={document.filename}
            onReset={() => {
              setDocument(null);
              scrollToTop();
            }}
          />
        </main>
      </>
    );
  }

  // Landing mode — 3 sections + footer
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero
          onIndexed={(id, filename) => setDocument({ id, filename })}
        />
        <HowItWorks />
        <Features onScrollToTop={scrollToTop} />
      </main>
      <Footer />
    </>
  );
}