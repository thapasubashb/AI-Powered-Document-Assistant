'use client'

import { useState } from 'react'
import { PdfUploader } from '@/components/PdfUploader'
import { Chat } from '@/components/Chat'

export default function Home() {
  const [document, setDocument] = useState<{
    id: string
    filename: string
  } | null>(null)

  return (
      <main className="min-h-screen bg-white text-gray-900">
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
  )
}