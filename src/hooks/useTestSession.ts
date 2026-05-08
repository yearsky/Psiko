'use client'
import { useSessionStore } from '@/store/sessionStore'

export function useTestSession() {
  const store = useSessionStore()

  const currentSection = store.packageData?.sections[store.currentSectionIndex] ?? null
  const currentQuestion = currentSection?.questions[store.currentQuestionIndex] ?? null
  const totalSections = store.packageData?.sections.length ?? 0
  const totalQuestions = currentSection?.questions.length ?? 0
  const isLastSection = store.currentSectionIndex === totalSections - 1
  const isLastQuestion = store.currentQuestionIndex === totalQuestions - 1

  function isAnswered(questionId: string) {
    return questionId in store.answers
  }

  function isFlagged(questionId: string) {
    return store.flaggedQuestions.includes(questionId)
  }

  function getAnswer(questionId: string) {
    return store.answers[questionId] ?? null
  }

  const answeredCount = currentSection
    ? currentSection.questions.filter(q => isAnswered(q.id)).length
    : 0

  return {
    ...store,
    currentSection,
    currentQuestion,
    totalSections,
    totalQuestions,
    isLastSection,
    isLastQuestion,
    answeredCount,
    isAnswered,
    isFlagged,
    getAnswer,
  }
}
