'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import type { BaseQuestion } from '@/types/psikotest'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

interface Props {
  question: BaseQuestion
}

export function MathQuestion({ question }: Props) {
  const [katexOn, setKatexOn] = useState(false)

  return (
    <div className="space-y-3">
      {question.text && (
        <p className="text-base text-gray-700 leading-relaxed">{question.text}</p>
      )}
      {question.latexExpression && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 bg-white">
            <span className="text-xs text-gray-400">Formula</span>
            <button
              onClick={() => setKatexOn(v => !v)}
              className={cn(
                'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors',
                katexOn
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', katexOn ? 'bg-blue-500' : 'bg-gray-400')} />
              KaTeX {katexOn ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="p-4">
            {katexOn ? (
              <span className="flex justify-center">
                <InlineMath math={`\\displaystyle ${question.latexExpression}`} />
              </span>
            ) : (
              <p className="font-mono text-sm text-gray-800 text-center">
                {question.latexExpression}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function InlineMathRenderer({ latex }: { latex: string }) {
  return <InlineMath math={latex} />
}
