'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, MinusCircle, RotateCcw, Home, BookOpen, Sparkles } from 'lucide-react'
import { useSessionStore } from '@/store/sessionStore'
import { useChatStore } from '@/store/chatStore'
import { cn, getScoreRank, getScoreColor } from '@/lib/utils'
import type { TestResult, SectionResult, BaseQuestion } from '@/types/psikotest'
import { QuestionCard } from '@/components/test/QuestionCard'
import { ChatModal } from '@/components/ai/ChatModal'

const MATH_TYPES = new Set([
  'numerical_series', 'numerical_arithmetic', 'numerical_word_problem',
  'logical_comparison', 'arithmetic', 'arithmetic_word_problem',
])

function ScoreCircle({ score }: { score: number }) {
  const color = getScoreColor(score)
  const r = 54
  const circ = 2 * Math.PI * r
  const pct = score / 100

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'}
          strokeWidth="10"
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn('text-3xl font-bold', color)}>{score}</div>
        <div className="text-xs text-gray-500">/ 100</div>
      </div>
    </div>
  )
}

function SectionResultCard({ section, onAskAI }: { section: SectionResult; onAskAI: (q: BaseQuestion) => void }) {
  const [expanded, setExpanded] = useState(false)
  const pkg = useSessionStore(s => s.packageData)
  const sectionData = pkg?.sections.find(s => s.id === section.sectionId)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="font-semibold text-gray-900">{section.sectionTitle}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-3.5 h-3.5" /> {section.correctCount} benar
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <XCircle className="w-3.5 h-3.5" /> {section.incorrectCount} salah
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <MinusCircle className="w-3.5 h-3.5" /> {section.unansweredCount} kosong
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className={cn('text-2xl font-bold', getScoreColor(section.score))}>{section.score}</div>
          <div className="text-xs text-gray-400">poin</div>
          <div className="text-xs text-gray-400 mt-1">{expanded ? '▲' : '▼'} Pembahasan</div>
        </div>
      </button>

      {expanded && sectionData && (
        <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50">
          {sectionData.questions.map((q, i) => {
            const result = section.questionResults.find(r => r.questionId === q.id)
            const userAnswer = result?.userAnswer ?? null
            return (
              <div key={q.id}>
                <QuestionCard
                  question={q}
                  questionNumber={i + 1}
                  totalQuestions={sectionData.questions.length}
                  selectedAnswer={userAnswer}
                  isFlagged={false}
                  onSelectAnswer={() => {}}
                  onToggleFlag={() => {}}
                  showResult
                  disabled
                />
                {MATH_TYPES.has(q.type) && (
                  <button
                    onClick={() => onAskAI(q)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Tanya AI
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()
  const store = useSessionStore()
  const { openChat } = useChatStore()
  const [result, setResult] = useState<TestResult | null>(null)
  const [chatQuestion, setChatQuestion] = useState<BaseQuestion | null>(null)

  function handleAskAI(q: BaseQuestion) {
    openChat(q.id)
    setChatQuestion(q)
  }

  useEffect(() => {
    if (!store.isFinished || !store.lastResult) {
      router.replace(`/tests/${testId}`)
      return
    }
    setResult(store.lastResult)
  }, [store.isFinished, store.lastResult, testId, router])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-500">Memuat hasil...</p>
        </div>
      </div>
    )
  }

  const rank = getScoreRank(result.totalScore)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Score summary */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {store.packageData?.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">Selesai pada {new Date(result.finishedAt).toLocaleString('id-ID')}</p>

        <ScoreCircle score={result.totalScore} />

        <div className="mt-4 space-y-1">
          <div className={cn('text-xl font-bold', getScoreColor(result.totalScore))}>{rank}</div>
          {result.isPassing ? (
            <div className="flex items-center justify-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Lulus
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-red-500 text-sm font-medium">
              <XCircle className="w-4 h-4" /> Belum Lulus
            </div>
          )}
        </div>

        {/* Section score summary */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {result.sectionResults.map(s => (
            <div key={s.sectionId} className="bg-gray-50 rounded-xl p-3">
              <div className={cn('text-xl font-bold', getScoreColor(s.score))}>{s.score}</div>
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.sectionTitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Benar',
            value: result.sectionResults.reduce((s, r) => s + r.correctCount, 0),
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
          {
            label: 'Salah',
            value: result.sectionResults.reduce((s, r) => s + r.incorrectCount, 0),
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-50',
          },
          {
            label: 'Kosong',
            value: result.sectionResults.reduce((s, r) => s + r.unansweredCount, 0),
            icon: MinusCircle,
            color: 'text-gray-400',
            bg: 'bg-gray-100',
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className={cn('inline-flex p-2 rounded-xl mb-2', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Section breakdown with review */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Pembahasan per Bagian
        </h2>
        {result.sectionResults.map(section => (
          <SectionResultCard
            key={section.sectionId}
            section={section}
            onAskAI={handleAskAI}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => {
            store.resetSession()
            router.push(`/tests/${testId}`)
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Ulangi Tes
        </button>
        <Link
          href="/"
          onClick={() => store.resetSession()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Home className="w-4 h-4" /> Beranda
        </Link>
      </div>

      {chatQuestion && (
        <ChatModal
          question={chatQuestion}
          onClose={() => setChatQuestion(null)}
        />
      )}
    </div>
  )
}
