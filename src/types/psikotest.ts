// ─── Enumerasi ─────────────────────────────────────────────────────────────

export type QuestionType =
  | 'verbal_antonym'
  | 'verbal_synonym'
  | 'verbal_analogy'
  | 'numerical_series'
  | 'numerical_arithmetic'
  | 'numerical_word_problem'
  | 'logical_syllogism'
  | 'logical_reasoning'
  | 'logical_comparison'
  | 'arithmetic'
  | 'arithmetic_word_problem'
  | 'figure_series'
  | 'figure_matrix'
  | 'figure_odd_one_out'
  | 'spatial_rotation'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type TestCategory =
  | 'tpa'
  | 'psikotes_kerja'
  | 'ist'
  | 'cpns'
  | 'custom'

export type ImageLayout = 'single' | 'series_row' | 'matrix_3x3' | 'matrix_2x4'

// ─── Opsi Jawaban ───────────────────────────────────────────────────────────

export interface AnswerOption {
  id: string
  text?: string
  imageUrl?: string
  imageAlt?: string
  latexExpression?: string
}

// ─── Metadata Soal ─────────────────────────────────────────────────────────

export interface QuestionMetadata {
  source?: string | null
  sourceName?: string | null
  originalId?: string | null
  tags?: string[]
  year?: number | null
  company?: string | null
  crawledAt?: string | null
  verifiedAt?: string | null
}

// ─── Soal (BaseQuestion) ────────────────────────────────────────────────────
// Kontrak antara frontend dan output crawler.
// Field nullable menandakan akan diisi saat crawling selesai.

export interface BaseQuestion {
  id: string
  type: QuestionType
  difficulty: Difficulty

  text?: string
  latexExpression?: string
  imageUrl?: string
  imageAlt?: string
  imageLayout?: ImageLayout
  seriesImages?: string[]

  options: AnswerOption[]
  correctAnswer: string
  explanation?: string | null
  explanationLatex?: string | null

  metadata: QuestionMetadata
}

// ─── Section ────────────────────────────────────────────────────────────────

export interface TestSection {
  id: string
  title: string
  description?: string
  instructions?: string
  questionTypes: QuestionType[]
  questions: BaseQuestion[]
  timeLimitSeconds: number
  questionTimeLimitSeconds?: number
  passingScore?: number
}

// ─── Metadata Paket ────────────────────────────────────────────────────────

export interface PackageMetadata {
  source?: string | null
  sourceName?: string | null
  isFeatured?: boolean
  isVerified?: boolean
  totalAttempts?: number
  averageScore?: number
  createdAt: string
  updatedAt: string
}

// ─── Paket Tes ──────────────────────────────────────────────────────────────

export interface TestPackage {
  id: string
  slug: string
  title: string
  description: string
  category: TestCategory
  thumbnailUrl?: string
  difficulty: Difficulty
  sections: TestSection[]
  totalQuestions: number
  totalTimeLimitMinutes: number
  passingScore?: number
  targetPosition?: string
  company?: string
  year?: number
  metadata: PackageMetadata
}

// ─── State Sesi Pengerjaan ──────────────────────────────────────────────────

export interface TestSession {
  packageId: string
  currentSectionIndex: number
  currentQuestionIndex: number
  answers: Record<string, string>
  flaggedQuestions: string[]
  sectionStartTimes: Record<string, number>
  sessionStartTime: number
  isFinished: boolean
}

// ─── Hasil Tes ──────────────────────────────────────────────────────────────

export interface QuestionResult {
  questionId: string
  userAnswer: string | null
  correctAnswer: string
  isCorrect: boolean
  timeTakenSeconds?: number
}

export interface SectionResult {
  sectionId: string
  sectionTitle: string
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  unansweredCount: number
  score: number
  timeTakenSeconds: number
  questionResults: QuestionResult[]
}

export interface TestResult {
  packageId: string
  finishedAt: string
  totalScore: number
  isPassing: boolean
  sectionResults: SectionResult[]
  totalTimeTakenSeconds: number
}

// ─── Statistik Pengguna (localStorage) ─────────────────────────────────────

export interface UserStats {
  totalAttempts: number
  totalQuestionsAnswered: number
  totalCorrect: number
  averageScore: number
  history: {
    packageId: string
    packageTitle: string
    score: number
    finishedAt: string
  }[]
}
