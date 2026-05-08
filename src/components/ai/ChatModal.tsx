'use client'
import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { X, Send, Sparkles } from 'lucide-react'
import { useChatStore, type ChatMessage } from '@/store/chatStore'
import type { BaseQuestion } from '@/types/psikotest'

interface Props {
  question: BaseQuestion
  onClose: () => void
}

export function ChatModal({ question, onClose }: Props) {
  const { getHistory, addMessage, setLoading, isLoading } = useChatStore()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => getHistory(question.id))
  const bottomRef = useRef<HTMLDivElement>(null)

  // Sync local messages with store on question change
  useEffect(() => {
    setMessages(getHistory(question.id))
  }, [question.id, getHistory])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: content.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    addMessage(question.id, userMsg)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated,
          question: {
            id: question.id,
            text: question.text,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          },
        }),
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      // Add empty assistant message to stream into
      const withAssistant: ChatMessage[] = [...updated, { role: 'assistant', content: '' }]
      setMessages(withAssistant)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const delta = json.choices?.[0]?.delta?.content ?? ''
            assistantContent += delta
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { role: 'assistant', content: assistantContent }
              return next
            })
          } catch { /* skip malformed chunks */ }
        }
      }

      const finalMsg: ChatMessage = { role: 'assistant', content: assistantContent }
      addMessage(question.id, finalMsg)
    } catch {
      const errMsg: ChatMessage = { role: 'assistant', content: 'Maaf, terjadi kesalahan. Coba lagi ya 🙏' }
      setMessages(prev => [...prev.slice(0, -1), errMsg])
      addMessage(question.id, errMsg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Tanya AI tentang soal</p>
              <p className="text-sm font-medium text-gray-800 truncate">{question.text}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pertanyaan... (Enter untuk kirim)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ maxHeight: '100px' }}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
