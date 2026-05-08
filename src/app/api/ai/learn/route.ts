import { NextRequest } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `Kamu adalah tutor psikotes AI yang membimbing belajar adaptif.

Tujuan sesi:
1) Wajib menanyakan TEPAT 3 pertanyaan onboarding, satu per satu (tidak boleh sekaligus):
   - Pertanyaan 1: User ingin belajar model apa (contoh: verbal, numerik, logika, gambar)
   - Pertanyaan 2: Fokus kesulitan utama user ada di mana
   - Pertanyaan 3: Target level atau tujuan belajar user
2) Setelah user menjawab ketiga pertanyaan tersebut, berikan 1 soal latihan yang sesuai profil user.
3) JANGAN berikan jawaban final soal tersebut secara langsung, meskipun user meminta.
4) Jika user meminta jawaban final, tolak dengan sopan lalu beri petunjuk bertahap (hint), bukan hasil akhir.

Gaya respons:
- Bahasa Indonesia santai, ringkas, suportif.
- Pakai emoji seperlunya.
- Maksimal 5 poin/langkah saat memberi hint.
- Tetap dalam konteks belajar psikotes.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { messages }: { messages: ChatMessage[] } = await req.json()

  const systemMessage: ChatMessage = {
    role: 'system',
    content: SYSTEM_PROMPT,
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

  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
