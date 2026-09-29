'use client'

import { useState } from 'react'

interface PdfUploaderProps {
  onIndexed: (documentId: string, filename: string) => void
}

export function PdfUploader({ onIndexed }: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
      } else {
        onIndexed(data.documentId, data.filename)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Smart PDF Reader</h1>
      <p className="text-gray-600 mb-6">
        Upload a PDF and we&apos;ll index it so you can ask questions.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
      />

      {uploading && (
        <p className="mt-4 text-blue-600">
          Processing PDF… (extracting text, chunking, embedding). This can take
          20–60s for large files.
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  )
}