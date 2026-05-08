import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { AnswerOption as AnswerOptionType } from '@/types/psikotest'

interface Props {
  option: AnswerOptionType
  selected: boolean
  correct?: boolean | null
  showResult?: boolean
  onSelect?: () => void
  disabled?: boolean
}

export function AnswerOption({ option, selected, correct, showResult, onSelect, disabled }: Props) {
  const isCorrectAnswer = showResult && correct === true
  const isWrongAnswer = showResult && selected && correct === false

  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        !showResult && !disabled && 'hover:border-blue-300 hover:bg-blue-50 cursor-pointer',
        selected && !showResult && 'border-blue-500 bg-blue-50',
        !selected && !showResult && 'border-gray-200 bg-white',
        isCorrectAnswer && 'border-green-500 bg-green-50',
        isWrongAnswer && 'border-red-400 bg-red-50',
        showResult && !selected && !isCorrectAnswer && 'border-gray-200 bg-white opacity-60',
        disabled && 'cursor-not-allowed opacity-60'
      )}
      aria-pressed={selected}
    >
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold',
          selected && !showResult && 'border-blue-500 bg-blue-500 text-white',
          !selected && !showResult && 'border-gray-300 text-gray-500',
          isCorrectAnswer && 'border-green-500 bg-green-500 text-white',
          isWrongAnswer && 'border-red-500 bg-red-500 text-white',
          showResult && !selected && !isCorrectAnswer && 'border-gray-300 text-gray-400'
        )}
      >
        {option.id}
      </span>

      <div className="flex-1 min-w-0">
        {option.imageUrl ? (
          <div className="relative w-24 h-24">
            <Image
              src={option.imageUrl}
              alt={option.imageAlt ?? `Opsi ${option.id}`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <span className={cn(
            'text-sm leading-relaxed',
            selected && !showResult && 'text-blue-800 font-medium',
            isCorrectAnswer && 'text-green-800 font-medium',
            isWrongAnswer && 'text-red-700',
          )}>
            {option.text}
          </span>
        )}
      </div>

      {showResult && isCorrectAnswer && (
        <span className="flex-shrink-0 text-green-600 text-xs font-semibold">✓ Benar</span>
      )}
    </button>
  )
}
