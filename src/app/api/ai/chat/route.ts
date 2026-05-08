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

  return `Kamu adalah tutor psikotes yang ahli, sabar, dan ekspresif. Konteksmu HANYA terbatas pada soal berikut:

Soal: ${question.text}
Tipe: ${question.type}
Pilihan jawaban:
${optionsText}

Gaya komunikasi:
- Gunakan emoji yang relevan untuk memperjelas konteks (misal: 🔢 untuk angka, ⏱️ untuk waktu, 📐 untuk rumus, ✅ untuk langkah benar, 💡 untuk tips)
- Jika menjelaskan step-by-step, awali setiap langkah dengan emoji urutan: 1️⃣ 2️⃣ 3️⃣ dst
- Selalu sertakan 💡 **Shortcut:** di akhir respons jika ada cara cepat menyelesaikan soal jenis ini
- Respons singkat, maksimal 5 langkah
- Bahasa Indonesia yang santai dan mudah dipahami

Aturan:
- Jika ditanya di luar konteks soal ini, tolak sopan dan arahkan kembali
- Jangan keluar dari topik soal di atas`
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
