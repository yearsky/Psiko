'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TestPackage, TestResult } from '@/types/psikotest'
import { calculateTestResult, generateSessionId } from '@/lib/utils'

interface SessionState {
  packageData: TestPackage | null
  sessionId: string | null
  currentSectionIndex: number
  currentQuestionIndex: number
  answers: Record<string, string>
  flaggedQuestions: string[]
  sectionStartTimes: Record<string, number>
  sessionStartTime: number | null
  isFinished: boolean
  lastResult: TestResult | null
}

interface SessionActions {
  initSession: (pkg: TestPackage) => string
  selectAnswer: (questionId: string, optionId: string) => void
  toggleFlag: (questionId: string) => void
  navigateQuestion: (index: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  nextSection: () => void
  startSection: (sectionId: string) => void
  finishSession: () => TestResult | null
  resetSession: () => void
}

type SessionStore = SessionState & SessionActions

const initialState: SessionState = {
  packageData: null,
  sessionId: null,
  currentSectionIndex: 0,
  currentQuestionIndex: 0,
  answers: {},
  flaggedQuestions: [],
  sectionStartTimes: {},
  sessionStartTime: null,
  isFinished: false,
  lastResult: null,
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initSession: (pkg) => {
        const sessionId = generateSessionId()
        set({
          packageData: pkg,
          sessionId,
          currentSectionIndex: 0,
          currentQuestionIndex: 0,
          answers: {},
          flaggedQuestions: [],
          sectionStartTimes: {},
          sessionStartTime: Date.now(),
          isFinished: false,
          lastResult: null,
        })
        return sessionId
      },

      selectAnswer: (questionId, optionId) => {
        set(state => ({
          answers: { ...state.answers, [questionId]: optionId },
        }))
      },

      toggleFlag: (questionId) => {
        set(state => {
          const flags = state.flaggedQuestions
          const isFlagged = flags.includes(questionId)
          return {
            flaggedQuestions: isFlagged
              ? flags.filter(id => id !== questionId)
              : [...flags, questionId],
          }
        })
      },

      navigateQuestion: (index) => {
        set({ currentQuestionIndex: index })
      },

      nextQuestion: () => {
        const { currentSectionIndex, currentQuestionIndex, packageData } = get()
        if (!packageData) return
        const section = packageData.sections[currentSectionIndex]
        if (currentQuestionIndex < section.questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },

      nextSection: () => {
        const { currentSectionIndex, packageData } = get()
        if (!packageData) return
        if (currentSectionIndex < packageData.sections.length - 1) {
          set({
            currentSectionIndex: currentSectionIndex + 1,
            currentQuestionIndex: 0,
          })
        } else {
          get().finishSession()
        }
      },

      startSection: (sectionId) => {
        set(state => ({
          sectionStartTimes: {
            ...state.sectionStartTimes,
            [sectionId]: Date.now(),
          },
        }))
      },

      finishSession: () => {
        const { packageData, answers } = get()
        if (!packageData) return null
        const result = calculateTestResult(packageData, answers)
        set({ isFinished: true, lastResult: result })

        // Persist to localStorage history
        try {
          const history = JSON.parse(localStorage.getItem('psiko_history') || '[]')
          history.unshift({
            packageId: packageData.id,
            packageTitle: packageData.title,
            score: result.totalScore,
            finishedAt: result.finishedAt,
          })
          localStorage.setItem('psiko_history', JSON.stringify(history.slice(0, 20)))
        } catch { /* ignore localStorage errors */ }

        return result
      },

      resetSession: () => {
        set(initialState)
      },
    }),
    {
      name: 'psiko-session',
      partialize: (state) => ({
        packageData: state.packageData,
        sessionId: state.sessionId,
        currentSectionIndex: state.currentSectionIndex,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        flaggedQuestions: state.flaggedQuestions,
        sectionStartTimes: state.sectionStartTimes,
        sessionStartTime: state.sessionStartTime,
        isFinished: state.isFinished,
        lastResult: state.lastResult,
      }),
    }
  )
)
