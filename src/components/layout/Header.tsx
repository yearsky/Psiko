'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, BookOpen, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Beranda', icon: LayoutGrid },
  { href: '/tests', label: 'Paket Soal', icon: BookOpen },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Brain className="w-6 h-6" />
          <span>PsikoTest</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
