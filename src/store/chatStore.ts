'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const OPENING_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Mau aku jelaskan cara menyelesaikan soal ini lebih detail, atau mau aku kasih 1 soal serupa untuk latihan? 😊',
}

interface ChatState {
  histories: Record<string, ChatMessage[]>
  activeQuestionId: string | null
  isOpen: boolean
  isLoading: boolean
}

interface ChatActions {
  openChat: (questionId: string) => void
  closeChat: () => void
  addMessage: (questionId: string, message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  getHistory: (questionId: string) => ChatMessage[]
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      histories: {},
      activeQuestionId: null,
      isOpen: false,
      isLoading: false,

      openChat: (questionId) => {
        const existing = get().histories[questionId]
        set(state => ({
          activeQuestionId: questionId,
          isOpen: true,
          histories: existing
            ? state.histories
            : { ...state.histories, [questionId]: [OPENING_MESSAGE] },
        }))
      },

      closeChat: () => set({ isOpen: false, activeQuestionId: null }),

      addMessage: (questionId, message) =>
        set(state => ({
          histories: {
            ...state.histories,
            [questionId]: [...(state.histories[questionId] ?? []), message],
          },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      getHistory: (questionId) => get().histories[questionId] ?? [],
    }),
    {
      name: 'psiko_chat_history',
      partialize: (state) => ({ histories: state.histories }),
    }
  )
)
