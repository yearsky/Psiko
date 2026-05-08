'use client'
import dynamic from 'next/dynamic'
import type { BaseQuestion } from '@/types/psikotest'

// InlineMath only — BlockMath causes katex-display full-width SVG overflow on mobile.
// Use \displaystyle prefix to get display-size rendering without the layout side-effects.
const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

interface Props {
  question: BaseQuestion
}

export function MathQuestion({ question }: Props) {
  return (
    <div className="space-y-3">
      {question.text && (
        <p className="text-base text-gray-700 leading-relaxed">{question.text}</p>
      )}
      {question.latexExpression && (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
          <span className="flex justify-center">
            <InlineMath math={`\\displaystyle ${question.latexExpression}`} />
          </span>
        </div>
      )}
    </div>
  )
}

export function InlineMathRenderer({ latex }: { latex: string }) {
  return <InlineMath math={latex} />
}
