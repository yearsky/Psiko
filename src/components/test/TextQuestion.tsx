import type { BaseQuestion } from '@/types/psikotest'

interface Props {
  question: BaseQuestion
}

export function TextQuestion({ question }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold text-gray-900 leading-relaxed">
        {question.text}
      </p>
    </div>
  )
}
