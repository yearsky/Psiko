'use client'
import { cn } from '@/lib/utils'
import type { BaseQuestion } from '@/types/psikotest'

interface Props {
  questions: BaseQuestion[]
  currentIndex: number
  answers: Record<string, string>
  flaggedQuestions: string[]
  onNavigate: (index: number) => void
}

export function NavigationPanel({ questions, currentIndex, answers, flaggedQuestions, onNavigate }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigasi Soal</h3>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = q.id in answers
          const isFlagged = flaggedQuestions.includes(q.id)
          const isCurrent = i === currentIndex

          return (
            <button
              key={q.id}
              onClick={() => onNavigate(i)}
              title={`Soal ${i + 1}${isAnswered ? ' (terjawab)' : ''}${isFlagged ? ' (ditandai)' : ''}`}
              className={cn(
                'w-full aspect-square rounded-md text-xs font-bold transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isCurrent && 'ring-2 ring-blue-500 scale-110',
                isFlagged && !isCurrent && 'bg-yellow-400 text-white',
                isAnswered && !isFlagged && !isCurrent && 'bg-green-500 text-white',
                !isAnswered && !isFlagged && !isCurrent && 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                isCurrent && isAnswered && 'bg-blue-600 text-white',
                isCurrent && !isAnswered && 'bg-blue-100 text-blue-700'
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-green-500 inline-block" />
          <span>Terjawab ({Object.keys(answers).length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-yellow-400 inline-block" />
          <span>Ditandai ({flaggedQuestions.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300 inline-block" />
          <span>Belum dijawab ({questions.length - Object.keys(answers).length})</span>
        </div>
      </div>
    </div>
  )
}
