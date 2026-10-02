"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PdfUploader } from "@/components/PdfUploader";
import { Chat } from "@/components/Chat";

interface DocumentState {
  id: string;
  filename: string;
}

export default function Home() {
  const [document, setDocument] = useState<DocumentState | null>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {!document ? (
          <PdfUploader
            onIndexed={(id, filename) => setDocument({ id, filename })}
          />
        ) : (
          <Chat
            documentId={document.id}
            filename={document.filename}
            onReset={() => setDocument(null)}
          />
        )}
      </main>
      <Footer />
    </>
  );
}