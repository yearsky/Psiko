import { NextRequest } from 'next/server'
import type { AnswerOption } from '@/types/psikotest'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface QuestionContext {
  id: string
  text: string
  type: string
  options: AnswerOption[]
  correctAnswer: string
  explanation?: string | null
}

function buildSystemPrompt(question: QuestionContext): string {
  const optionsText = question.options
    .map(o => `${o.id}. ${o.text}`)
    .join('\n')

  return `Kamu adalah tutor psikotes yang ahli dan sabar. Konteksmu HANYA terbatas pada soal berikut:

Soal: ${question.text}
Tipe: ${question.type}
Pilihan jawaban:
${optionsText}

Aturan ketat yang WAJIB diikuti:
1. JANGAN pernah langsung menyebutkan jawaban benar (${question.correctAnswer})
2. Bantu user memahami CARA penyelesaian dan logika di balik soal
3. Jika user bertanya di luar konteks soal ini, tolak dengan sopan dan arahkan kembali
4. Gunakan Bahasa Indonesia yang ramah dan mudah dipahami
5. Respons singkat, padat, dan fokus — maksimal 3-4 kalimat per respons
6. Boleh memberikan hint bertahap jika user masih bingung`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { messages, question }: { messages: ChatMessage[]; question: QuestionContext } =
    await req.json()

  const systemMessage: ChatMessage = {
    role: 'system',
    content: buildSystemPrompt(question),
  }

  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [systemMessage, ...messages],
      stream: true,
      max_tokens: 512,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return Response.json({ error: err }, { status: res.status })
  }

  // Forward the SSE stream directly
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
