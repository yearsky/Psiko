'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle, Layers } from 'lucide-react'
import { dummyPackages } from '@/data/dummy'
import { useSessionStore } from '@/store/sessionStore'
import { useTestSession } from '@/hooks/useTestSession'
import { QuestionCard } from '@/components/test/QuestionCard'
import { NavigationPanel } from '@/components/test/NavigationPanel'
import { Timer } from '@/components/test/Timer'
import { ProgressBar } from '@/components/test/ProgressBar'
import { cn } from '@/lib/utils'

type Phase = 'intro' | 'section_intro' | 'testing' | 'section_done' | 'submitting'

function SectionIntroOverlay({
  sectionTitle,
  sectionDesc,
  instructions,
  questionCount,
  timeLimitSeconds,
  onStart,
}: {
  sectionTitle: string
  sectionDesc?: string
  instructions?: string
  questionCount: number
  timeLimitSeconds: number
  onStart: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📝</div>
          <h2 className="text-xl font-bold text-gray-900">{sectionTitle}</h2>
          {sectionDesc && <p className="text-gray-500 text-sm mt-1">{sectionDesc}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-700">{questionCount}</div>
            <div className="text-xs text-blue-500">Soal</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-700">{Math.ceil(timeLimitSeconds / 60)}</div>
            <div className="text-xs text-orange-500">Menit</div>
          </div>
        </div>
        {instructions && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-800 mb-1">Petunjuk:</p>
            {instructions}
          </div>
        )}
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Mulai Bagian Ini
        </button>
      </div>
    </div>
  )
}

function TestIntroOverlay({
  packageTitle,
  totalQuestions,
  totalMinutes,
  sectionCount,
  onStart,
}: {
  packageTitle: string
  totalQuestions: number
  totalMinutes: number
  sectionCount: number
  onStart: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🧠</div>
          <h2 className="text-xl font-bold text-gray-900">{packageTitle}</h2>
          <p className="text-gray-500 text-sm mt-1">Persiapkan dirimu sebelum memulai.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-xl font-bold text-blue-700">{sectionCount}</div>
            <div className="text-xs text-blue-500">Bagian</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl">
            <div className="text-xl font-bold text-purple-700">{totalQuestions}</div>
            <div className="text-xs text-purple-500">Soal</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-xl">
            <div className="text-xl font-bold text-orange-700">{totalMinutes}</div>
            <div className="text-xs text-orange-500">Menit</div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 mb-5 text-xs text-yellow-700">
          ⚠️ Pastikan koneksi stabil. Timer tidak bisa dijeda saat ujian berlangsung.
        </div>
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Mulai Ujian
        </button>
      </div>
    </div>
  )
}

export default function SessionPage() {
  const params = useParams()
  const testId = params.testId as string
  const router = useRouter()

  const [phase, setPhase] = useState<Phase>('intro')
  const store = useSessionStore()
  const session = useTestSession()

  const pkg = dummyPackages.find(p => p.id === testId)

  useEffect(() => {
    if (!pkg) {
      router.replace('/tests')
      return
    }
    if (!store.sessionId || store.packageData?.id !== testId) {
      store.initSession(pkg)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg, testId])

  if (!pkg) return null

  function handleTestStart() {
    setPhase('section_intro')
  }

  function handleSectionStart() {
    const section = session.currentSection
    if (section) {
      store.startSection(section.id)
    }
    setPhase('testing')
  }

  function handleSectionExpire() {
    const { currentSectionIndex, packageData } = store
    if (!packageData) return
    if (currentSectionIndex < packageData.sections.length - 1) {
      store.nextSection()
      setPhase('section_intro')
    } else {
      handleFinish()
    }
  }

  function handleNextSection() {
    const { currentSectionIndex, packageData } = store
    if (!packageData) return
    if (currentSectionIndex < packageData.sections.length - 1) {
      store.nextSection()
      setPhase('section_intro')
    } else {
      handleFinish()
    }
  }

  function handleFinish() {
    setPhase('submitting')
    store.finishSession()
    router.push(`/tests/${testId}/session/results`)
  }

  if (phase === 'intro') {
    return (
      <TestIntroOverlay
        packageTitle={pkg.title}
        totalQuestions={pkg.totalQuestions}
        totalMinutes={pkg.totalTimeLimitMinutes}
        sectionCount={pkg.sections.length}
        onStart={handleTestStart}
      />
    )
  }

  if (phase === 'section_intro' && session.currentSection) {
    return (
      <SectionIntroOverlay
        sectionTitle={session.currentSection.title}
        sectionDesc={session.currentSection.description}
        instructions={session.currentSection.instructions}
        questionCount={session.currentSection.questions.length}
        timeLimitSeconds={session.currentSection.timeLimitSeconds}
        onStart={handleSectionStart}
      />
    )
  }

  if (phase === 'submitting') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-600">Menghitung hasil...</p>
        </div>
      </div>
    )
  }

  if (!session.currentSection || !session.currentQuestion) return null

  const section = session.currentSection
  const question = session.currentQuestion
  const sectionAnswers = Object.fromEntries(
    Object.entries(store.answers).filter(([qId]) =>
      section.questions.some(q => q.id === qId)
    )
  )

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>
              {session.currentSectionIndex + 1}/{session.totalSections}: {section.title}
            </span>
          </div>
        </div>
        <Timer
          key={section.id}
          initialSeconds={section.timeLimitSeconds}
          onExpire={handleSectionExpire}
          label="Sisa Waktu"
        />
      </div>

      {/* Progress */}
      <ProgressBar
        total={session.totalQuestions}
        answered={session.answeredCount}
      />

      {/* Main layout */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-4 items-start min-w-0">
        {/* Question */}
        <div className="space-y-4">
          <QuestionCard
            question={question}
            questionNumber={session.currentQuestionIndex + 1}
            totalQuestions={session.totalQuestions}
            selectedAnswer={session.getAnswer(question.id)}
            isFlagged={session.isFlagged(question.id)}
            onSelectAnswer={optId => store.selectAnswer(question.id, optId)}
            onToggleFlag={() => store.toggleFlag(question.id)}
          />

          {/* Prev/Next navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={store.prevQuestion}
              disabled={session.currentQuestionIndex === 0}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                session.currentQuestionIndex === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
              )}
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>

            {session.isLastQuestion ? (
              <button
                onClick={handleNextSection}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {session.isLastSection ? 'Selesai & Kirim' : 'Selesai Bagian Ini'}
              </button>
            ) : (
              <button
                onClick={store.nextQuestion}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation panel */}
        <div className="hidden lg:block">
          <NavigationPanel
            questions={section.questions}
            currentIndex={session.currentQuestionIndex}
            answers={sectionAnswers}
            flaggedQuestions={store.flaggedQuestions}
            onNavigate={store.navigateQuestion}
          />
        </div>
      </div>
    </div>
  )
}
