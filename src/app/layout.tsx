import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'PsikoTest - Belajar Psikotest Online',
  description: 'Platform belajar psikotest pribadi: verbal, numerik, logika, dan gambar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <body className="antialiased bg-gray-50 min-h-screen overflow-x-hidden max-w-[100vw]">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8 min-w-0">
          {children}
        </main>
      </body>
    </html>
  )
}
