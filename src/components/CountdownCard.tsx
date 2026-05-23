import { useEffect, useState } from 'react'
import type { IconType } from '../lib/dayUi'

interface CountdownCardProps {
  Icon: IconType
  title: string
  subtitle: string
  target: number // timestamp (ms)
  note?: string
  reached?: { title: string; body: string }
}

function diffParts(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    reached: ms <= 0,
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    mins: Math.floor((ms % 3_600_000) / 60_000),
    secs: Math.floor((ms % 60_000) / 1000),
  }
}

export function CountdownCard({ Icon, title, subtitle, target, note, reached }: CountdownCardProps) {
  const [t, setT] = useState(() => diffParts(target))

  useEffect(() => {
    const id = setInterval(() => setT(diffParts(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (t.reached && reached) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-coral-500 to-coral-400 p-5 text-center text-white shadow-lg shadow-coral-200">
        <Icon className="mx-auto h-9 w-9" strokeWidth={1.8} />
        <p className="mt-2 font-display text-2xl font-bold">{reached.title}</p>
        <p className="mt-1 text-white/90">{reached.body}</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-100">
          <Icon className="h-5 w-5 text-coral-500" strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-display font-bold leading-tight text-ink">{title}</h3>
          <p className="text-xs text-ink-soft">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Tile value={t.days} label="days" />
        <Tile value={t.hours} label="hrs" />
        <Tile value={t.mins} label="min" />
        <Tile value={t.secs} label="sec" />
      </div>
      {note && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{note}</p>}
    </div>
  )
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-coral-50 py-2.5 text-center">
      <div className="font-display text-2xl font-bold tabular-nums text-coral-600">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{label}</div>
    </div>
  )
}
