import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, Clock, ChevronLeft, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'
import { dummyPackages } from '@/data/dummy'
import { cn, getDifficultyLabel, getDifficultyColor, getCategoryLabel, formatDuration } from '@/lib/utils'

interface Props {
  params: { testId: string }
}

const SECTION_ICONS: Record<string, string> = {
  verbal: '📖',
  numerik: '🔢',
  logika: '🧩',
  gambar: '🖼️',
}

export function generateStaticParams() {
  return dummyPackages.map(p => ({ testId: p.id }))
}

export default function TestDetailPage({ params }: Props) {
  const pkg = dummyPackages.find(p => p.id === params.testId)
  if (!pkg) notFound()

  const totalQuestions = pkg.sections.reduce((sum, s) => sum + s.questions.length, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/tests" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Kembali ke Daftar Paket
      </Link>

      {/* Package header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-3xl bg-blue-50 p-3 rounded-2xl">📋</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {getCategoryLabel(pkg.category)}
              </span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', getDifficultyColor(pkg.difficulty))}>
                {getDifficultyLabel(pkg.difficulty)}
              </span>
              {pkg.year && (
                <span className="text-xs text-gray-400">{pkg.year}</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{pkg.title}</h1>
            {pkg.targetPosition && (
              <p className="text-sm text-gray-500 mt-0.5">Target: {pkg.targetPosition}</p>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">{pkg.description}</p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-1">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{totalQuestions}</div>
            <div className="text-xs text-gray-500">Total Soal</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-1">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{formatDuration(pkg.totalTimeLimitMinutes)}</div>
            <div className="text-xs text-gray-500">Total Waktu</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="flex justify-center mb-1">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{pkg.passingScore ?? '-'}%</div>
            <div className="text-xs text-gray-500">Min. Lulus</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800">Bagian Tes</h2>
        {pkg.sections.map((section, i) => {
          const icon = Object.entries(SECTION_ICONS).find(([key]) =>
            section.title.toLowerCase().includes(key)
          )?.[1] ?? '📝'
          const mins = Math.ceil(section.timeLimitSeconds / 60)
          return (
            <div key={section.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {i + 1}. {section.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {section.questions.length} soal
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {mins} menit
                      </span>
                    </div>
                  </div>
                  {section.description && (
                    <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                  )}
                  {section.questionTimeLimitSeconds && (
                    <p className="text-xs text-orange-500 mt-1">
                      ⏱ {section.questionTimeLimitSeconds}s per soal
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info notices */}
      <div className="space-y-2">
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Setiap bagian memiliki timer tersendiri. Soal akan otomatis dikirim saat waktu habis.</span>
        </div>
        <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl text-sm text-yellow-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Pastikan koneksi internet stabil. Progress tersimpan di browser.</span>
        </div>
      </div>

      {/* Start button */}
      <StartButton testId={pkg.id} />
    </div>
  )
}

function StartButton({ testId }: { testId: string }) {
  return (
    <Link
      href={`/tests/${testId}/session`}
      className="block w-full text-center bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
    >
      Mulai Ujian
    </Link>
  )
}
