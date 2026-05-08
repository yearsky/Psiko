'use client'
import { Clock } from 'lucide-react'
import { cn, formatTime } from '@/lib/utils'
import { useTimer } from '@/hooks/useTimer'

interface Props {
  initialSeconds: number
  onExpire: () => void
  label?: string
}

export function Timer({ initialSeconds, onExpire, label }: Props) {
  const { remaining } = useTimer({ initialSeconds, onExpire })

  const pct = Math.round((remaining / initialSeconds) * 100)
  const isWarning = remaining <= 60
  const isCritical = remaining <= 30

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold transition-colors',
      isCritical ? 'bg-red-100 text-red-700 animate-pulse' :
      isWarning ? 'bg-orange-100 text-orange-700' :
      'bg-blue-50 text-blue-700'
    )}>
      <Clock className="w-4 h-4 flex-shrink-0" />
      <div className="flex flex-col items-start leading-tight">
        {label && <span className="text-[10px] font-normal opacity-70">{label}</span>}
        <span>{formatTime(remaining)}</span>
      </div>
      <div className="hidden sm:block w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-1">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-blue-500'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
