import type { BaseQuestion } from '@/types/psikotest'

interface Props {
  question: BaseQuestion
}

export function MathQuestion({ question }: Props) {
  return (
    <div className="space-y-2">
      {question.text && (
        <p className="text-base text-gray-700 leading-relaxed">{question.text}</p>
      )}
      {!question.text && question.latexExpression && (
        <p className="text-base text-gray-700 leading-relaxed">{question.latexExpression}</p>
      )}
    </div>
  )
}
