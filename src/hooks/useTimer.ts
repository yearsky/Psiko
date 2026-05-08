'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTimerOptions {
  initialSeconds: number
  onExpire?: () => void
  autoStart?: boolean
}

export function useTimer({ initialSeconds, onExpire, autoStart = true }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const newRemaining = Math.max(0, initialSeconds - elapsed)
    setRemaining(newRemaining)
    if (newRemaining === 0) {
      setIsRunning(false)
      onExpire?.()
    }
  }, [initialSeconds, onExpire])

  useEffect(() => {
    if (isRunning) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now()
      }
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, tick])

  const reset = useCallback((newSeconds?: number) => {
    startTimeRef.current = null
    setRemaining(newSeconds ?? initialSeconds)
    setIsRunning(autoStart)
  }, [initialSeconds, autoStart])

  const pause = useCallback(() => setIsRunning(false), [])
  const resume = useCallback(() => {
    startTimeRef.current = Date.now() - (initialSeconds - remaining) * 1000
    setIsRunning(true)
  }, [initialSeconds, remaining])

  return { remaining, isRunning, reset, pause, resume }
}
