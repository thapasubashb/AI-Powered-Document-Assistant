'use client'

import { useState, useRef, useEffect } from 'react'

interface Source {
  index: number
  page: number
  similarity: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

interface ChatProps {
  documentId: string
  filename: string
  onReset: () => void
}

export function Chat({ documentId, filename, onReset }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setMessages((m) => [...m, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, documentId }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Chat failed')

      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ])
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'unknown'}`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-screen py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4 border-b">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate">Chat with your document</h1>
          <p className="text-xs text-gray-500 truncate">{filename}</p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:underline whitespace-nowrap"
        >
          Upload new PDF
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            <p className="mb-2">Ask a question about the document.</p>
            <p className="text-sm">
              Try something specific like &ldquo;how do I use a queue?&rdquo;
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 text-xs text-gray-600">
                  <span className="font-medium">Sources:</span>{' '}
                  {msg.sources
                    .map(
                      (s) =>
                        `Page ${s.page} (${(s.similarity * 100).toFixed(0)}%)`
                    )
                    .join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-500 text-sm">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
           {/* Input */}
      <form onSubmit={send} className="border-t px-4 py-3 flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the document…"
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}