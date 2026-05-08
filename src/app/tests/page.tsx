import Link from 'next/link'
import { BookOpen, Clock, Star, Filter } from 'lucide-react'
import { dummyPackages } from '@/data/dummy'
import { cn, getDifficultyLabel, getDifficultyColor, getCategoryLabel, formatDuration } from '@/lib/utils'

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  tpa: { icon: '📚', color: 'text-blue-700', bg: 'bg-blue-50' },
  psikotes_kerja: { icon: '💼', color: 'text-purple-700', bg: 'bg-purple-50' },
  cpns: { icon: '🏛️', color: 'text-green-700', bg: 'bg-green-50' },
  ist: { icon: '🧠', color: 'text-orange-700', bg: 'bg-orange-50' },
  custom: { icon: '📝', color: 'text-gray-700', bg: 'bg-gray-50' },
}

export default function TestsPage() {
  const categories = Array.from(new Set(dummyPackages.map(p => p.category)))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Paket Soal</h1>
        <p className="text-gray-500">Pilih paket latihan yang sesuai dengan kebutuhanmu.</p>
      </div>

      {/* Category filter summary */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm text-gray-500">
          <Filter className="w-4 h-4" /> Kategori:
        </span>
        {categories.map(cat => {
          const meta = CATEGORY_META[cat] ?? CATEGORY_META.custom
          return (
            <span key={cat} className={cn('text-xs px-3 py-1 rounded-full font-medium', meta.bg, meta.color)}>
              {meta.icon} {getCategoryLabel(cat)}
            </span>
          )
        })}
      </div>

      {/* Package grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyPackages.map(pkg => {
          const cat = CATEGORY_META[pkg.category] ?? CATEGORY_META.custom
          return (
            <Link
              key={pkg.id}
              href={`/tests/${pkg.id}`}
              className="block bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={cn('text-2xl p-2 rounded-xl', cat.bg)}>{cat.icon}</span>
                <div className="flex flex-col items-end gap-1">
                  {pkg.metadata.isFeatured && (
                    <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      Unggulan
                    </span>
                  )}
                  {pkg.metadata.isVerified && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      ✓ Terverifikasi
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-1">
                <span className={cn('text-xs font-medium', cat.color)}>
                  {getCategoryLabel(pkg.category)}
                </span>
                {pkg.year && <span className="text-xs text-gray-400 ml-1">• {pkg.year}</span>}
              </div>

              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                {pkg.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>

              {pkg.targetPosition && (
                <p className="text-xs text-gray-400 mb-3">Target: {pkg.targetPosition}</p>
              )}

              <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-100">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getDifficultyColor(pkg.difficulty))}>
                  {getDifficultyLabel(pkg.difficulty)}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {pkg.totalQuestions} soal
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDuration(pkg.totalTimeLimitMinutes)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
