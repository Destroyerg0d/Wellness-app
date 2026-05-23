import { useEffect, useState } from 'react'
import { Cake, Gift } from 'lucide-react'
import { cn } from '../lib/cn'

const BIRTH_YEAR = 2005
const BIRTH_MONTH = 9 // October (0-indexed)
const BIRTH_DAY = 22

interface Countdown {
  isBirthday: boolean
  days: number
  hours: number
  mins: number
  secs: number
  turningAge: number
}

function compute(): Countdown {
  const now = new Date()
  const isBirthday = now.getMonth() === BIRTH_MONTH && now.getDate() === BIRTH_DAY
  let next = new Date(now.getFullYear(), BIRTH_MONTH, BIRTH_DAY, 0, 0, 0, 0)
  if (next.getTime() <= now.getTime() && !isBirthday) {
    next = new Date(now.getFullYear() + 1, BIRTH_MONTH, BIRTH_DAY)
  }
  const diff = Math.max(0, next.getTime() - now.getTime())
  return {
    isBirthday,
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    mins: Math.floor((diff % 3_600_000) / 60_000),
    secs: Math.floor((diff % 60_000) / 1000),
    turningAge: next.getFullYear() - BIRTH_YEAR,
  }
}

export function BirthdayCountdown({ compact = false }: { compact?: boolean }) {
  const [c, setC] = useState<Countdown>(compute)

  useEffect(() => {
    const id = setInterval(() => setC(compute()), 1000)
    return () => clearInterval(id)
  }, [])

  if (c.isBirthday) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-coral-500 to-coral-400 p-5 text-center text-white shadow-lg shadow-coral-200">
        <Cake className="mx-auto h-9 w-9" strokeWidth={1.8} />
        <p className="mt-2 font-display text-2xl font-bold">Happy Birthday, Shreya!</p>
        <p className="mt-1 text-white/90">You're {c.turningAge} today. Here's to a strong, happy year.</p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-3xl bg-white p-4 shadow-sm shadow-black/5', compact && 'p-3')}>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-100">
          <Gift className="h-5 w-5 text-coral-500" strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-display font-bold leading-tight text-ink">Birthday countdown</h3>
          <p className="text-xs text-ink-soft">Turning {c.turningAge} on 22 October</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <TimeTile value={c.days} label="days" />
        <TimeTile value={c.hours} label="hrs" />
        <TimeTile value={c.mins} label="min" />
        <TimeTile value={c.secs} label="sec" />
      </div>
    </div>
  )
}

function TimeTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-coral-50 py-2.5 text-center">
      <div className="font-display text-2xl font-bold tabular-nums text-coral-600">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}
