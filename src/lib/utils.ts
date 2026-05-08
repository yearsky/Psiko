import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TestPackage, TestResult, SectionResult, QuestionResult } from '@/types/psikotest'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} menit`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} jam ${m} menit` : `${h} jam`
}

export function getDifficultyLabel(d: string): string {
  const map: Record<string, string> = {
    easy: 'Mudah',
    medium: 'Menengah',
    hard: 'Sulit',
  }
  return map[d] ?? d
}

export function getDifficultyColor(d: string): string {
  const map: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }
  return map[d] ?? 'bg-gray-100 text-gray-700'
}

export function getCategoryLabel(c: string): string {
  const map: Record<string, string> = {
    tpa: 'TPA',
    psikotes_kerja: 'Psikotes Kerja',
    ist: 'IST',
    cpns: 'CPNS/ASN',
    custom: 'Kustom',
  }
  return map[c] ?? c
}

export function getScoreRank(score: number): string {
  if (score >= 85) return 'Sangat Baik'
  if (score >= 70) return 'Baik'
  if (score >= 55) return 'Cukup'
  return 'Perlu Latihan'
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 55) return 'text-yellow-600'
  return 'text-red-600'
}

export function calculateTestResult(
  packageData: TestPackage,
  answers: Record<string, string>
): TestResult {
  const sectionResults: SectionResult[] = packageData.sections.map(section => {
    const questionResults: QuestionResult[] = section.questions.map(q => {
      const userAnswer = answers[q.id] ?? null
      const isCorrect = userAnswer === q.correctAnswer
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: isCorrect && userAnswer !== null,
      }
    })

    const correct = questionResults.filter(r => r.isCorrect).length
    const incorrect = questionResults.filter(r => !r.isCorrect && r.userAnswer !== null).length
    const unanswered = questionResults.filter(r => r.userAnswer === null).length
    const score = section.questions.length > 0
      ? Math.round((correct / section.questions.length) * 100)
      : 0

    return {
      sectionId: section.id,
      sectionTitle: section.title,
      totalQuestions: section.questions.length,
      correctCount: correct,
      incorrectCount: incorrect,
      unansweredCount: unanswered,
      score,
      timeTakenSeconds: 0,
      questionResults,
    }
  })

  const totalScore = sectionResults.length > 0
    ? Math.round(sectionResults.reduce((sum, s) => sum + s.score, 0) / sectionResults.length)
    : 0

  return {
    packageId: packageData.id,
    finishedAt: new Date().toISOString(),
    totalScore,
    isPassing: packageData.passingScore != null ? totalScore >= packageData.passingScore : false,
    sectionResults,
    totalTimeTakenSeconds: 0,
  }
}

export function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
