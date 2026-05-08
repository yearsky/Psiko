'use client'
import dynamic from 'next/dynamic'
import type { BaseQuestion } from '@/types/psikotest'

const BlockMath = dynamic(() => import('react-katex').then(m => m.BlockMath), { ssr: false })
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
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 overflow-x-auto">
          <BlockMath math={question.latexExpression} />
        </div>
      )}
    </div>
  )
}

export function InlineMathRenderer({ latex }: { latex: string }) {
  return <InlineMath math={latex} />
}
