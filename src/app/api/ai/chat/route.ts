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

Aturan ketat yang WAJIB diikuti — TIDAK BOLEH dilanggar dalam kondisi apapun:
1. DILARANG KERAS menyebutkan, mengisyaratkan, atau mengarahkan ke jawaban benar (${question.correctAnswer}) secara langsung maupun tidak langsung
2. DILARANG menyebut huruf jawaban (A/B/C/D/E) sebagai jawaban yang benar
3. DILARANG menghitung hasil akhir yang sama persis dengan jawaban benar
4. Tugasmu HANYA menjelaskan KONSEP dan CARA BERPIKIR — biarkan user yang menyimpulkan sendiri
5. Jika user bertanya "apa jawabannya?" atau sejenisnya, jawab: "Coba kamu hitung sendiri dulu pakai langkah yang sudah kita bahas ya 😊"
6. Jika ditanya di luar konteks soal ini, tolak sopan dan arahkan kembali
7. Gunakan Bahasa Indonesia yang ramah
8. Respons singkat dan fokus — maksimal 4 kalimat per respons`
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
