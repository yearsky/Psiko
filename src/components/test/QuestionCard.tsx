'use client'
import { Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BaseQuestion } from '@/types/psikotest'
import { TextQuestion } from './TextQuestion'
import { MathQuestion } from './MathQuestion'
import { FigureQuestion } from './FigureQuestion'
import { AnswerOption } from './AnswerOption'

interface Props {
  question: BaseQuestion
  questionNumber: number
  totalQuestions: number
  selectedAnswer: string | null
  isFlagged: boolean
  onSelectAnswer: (optionId: string) => void
  onToggleFlag: () => void
  showResult?: boolean
  disabled?: boolean
}

function QuestionBody({ question }: { question: BaseQuestion }) {
  if (question.type.startsWith('figure_') || question.type === 'spatial_rotation') {
    return <FigureQuestion question={question} />
  }
  if (question.latexExpression || question.type.startsWith('numerical_')) {
    return <MathQuestion question={question} />
  }
  return <TextQuestion question={question} />
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  showResult = false,
  disabled = false,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-500">
          Soal {questionNumber} / {totalQuestions}
        </span>
        <button
          onClick={onToggleFlag}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
            isFlagged
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Flag className="w-3.5 h-3.5" />
          {isFlagged ? 'Ditandai' : 'Tandai'}
        </button>
      </div>

      {/* Question body */}
      <div className="p-5 pb-3">
        <QuestionBody question={question} />
      </div>

      {/* Answer options */}
      <div className="px-5 pb-5 space-y-2">
        {question.options.map(option => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = showResult ? option.id === question.correctAnswer : null
          return (
            <AnswerOption
              key={option.id}
              option={option}
              selected={isSelected}
              correct={isCorrect}
              showResult={showResult}
              onSelect={() => !disabled && onSelectAnswer(option.id)}
              disabled={disabled}
            />
          )
        })}
      </div>

      {/* Explanation (shown in review mode) */}
      {showResult && question.explanation && (
        <div className="mx-5 mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-1">Pembahasan:</p>
          <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
