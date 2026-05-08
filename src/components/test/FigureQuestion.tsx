import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { BaseQuestion, ImageLayout } from '@/types/psikotest'

interface Props {
  question: BaseQuestion
}

const PLACEHOLDER_BG = [
  'bg-blue-100', 'bg-purple-100', 'bg-green-100',
  'bg-orange-100', 'bg-pink-100', 'bg-teal-100',
  'bg-yellow-100', 'bg-red-100', 'bg-indigo-100',
]

function FigurePlaceholder({ index, label }: { index: number; label?: string }) {
  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg aspect-square text-xs font-bold text-gray-500 border-2 border-dashed border-gray-300',
      PLACEHOLDER_BG[index % PLACEHOLDER_BG.length]
    )}>
      {label ?? `#${index + 1}`}
    </div>
  )
}

function FigureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-1"
        onError={e => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
    </div>
  )
}

export function FigureQuestion({ question }: Props) {
  const layout: ImageLayout = question.imageLayout ?? 'series_row'
  const images = question.seriesImages ?? []

  if (layout === 'matrix_3x3') {
    return (
      <div className="space-y-3">
        {question.text && (
          <p className="text-base text-gray-700">{question.text}</p>
        )}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto sm:max-w-sm">
          {Array.from({ length: 8 }).map((_, i) => {
            const src = images[i]
            return src ? (
              <FigureImage key={i} src={src} alt={`Sel ${i + 1}`} />
            ) : (
              <FigurePlaceholder key={i} index={i} />
            )
          })}
          <div className="aspect-square rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-400">
            ?
          </div>
        </div>
      </div>
    )
  }

  // series_row layout
  return (
    <div className="space-y-3">
      {question.text && (
        <p className="text-base text-gray-700">{question.text}</p>
      )}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {images.length > 0 ? (
          <>
            {images.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                <FigureImage src={src} alt={`Gambar ${i + 1}`} />
              </div>
            ))}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-400">
              ?
            </div>
          </>
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
              {i < 4 ? (
                <FigurePlaceholder index={i} />
              ) : (
                <div className="w-full h-full rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 flex items-center justify-center text-xl font-bold text-blue-400">?</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
