import Link from 'next/link'
import { BookOpen, Brain, BarChart3, Clock, ChevronRight, Star } from 'lucide-react'
import { dummyPackages } from '@/data/dummy'
import { cn, getDifficultyLabel, getDifficultyColor, formatDuration } from '@/lib/utils'

const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  tpa: { icon: '📚', color: 'text-blue-700', bg: 'bg-blue-50' },
  psikotes_kerja: { icon: '💼', color: 'text-purple-700', bg: 'bg-purple-50' },
  cpns: { icon: '🏛️', color: 'text-green-700', bg: 'bg-green-50' },
  ist: { icon: '🧠', color: 'text-orange-700', bg: 'bg-orange-50' },
  custom: { icon: '📝', color: 'text-gray-700', bg: 'bg-gray-50' },
}

function PackageCard({ pkg }: { pkg: (typeof dummyPackages)[0] }) {
  const cat = CATEGORY_META[pkg.category] ?? CATEGORY_META.custom
  return (
    <Link
      href={`/tests/${pkg.id}`}
      className="block bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn('text-2xl p-2 rounded-xl', cat.bg)}>{cat.icon}</span>
        {pkg.metadata.isFeatured && (
          <span className="flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            Unggulan
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
        {pkg.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
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
}

export default function HomePage() {
  const featured = dummyPackages.filter(p => p.metadata.isFeatured)

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-gray-50 rounded-3xl px-6">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          Platform Belajar Psikotest
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Latihan Psikotest<br />
          <span className="text-blue-600">Kapan Saja, Di Mana Saja</span>
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          Tingkatkan kemampuanmu dengan latihan soal psikotest terstruktur: verbal, numerik, logika, dan gambar.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/tests"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Mulai Latihan
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tests"
            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Lihat Semua Paket
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Paket', value: String(dummyPackages.length), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Soal', value: String(dummyPackages.reduce((s, p) => s + p.totalQuestions, 0)), icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Kategori', value: '4', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Gratis', value: '100%', icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className={cn('inline-flex p-2 rounded-xl mb-2', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured packages */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Paket Unggulan</h2>
          <Link href="/tests" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Lihat semua <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Cara Penggunaan</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Pilih Paket', desc: 'Pilih paket soal sesuai kebutuhan (TPA, CPNS, dll.)' },
            { step: '2', title: 'Kerjakan Soal', desc: 'Jawab soal dalam batas waktu. Timer otomatis berjalan.' },
            { step: '3', title: 'Lihat Hasil', desc: 'Cek skor, analisis jawaban, dan baca pembahasan.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full text-lg font-bold flex items-center justify-center mx-auto mb-3">
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
