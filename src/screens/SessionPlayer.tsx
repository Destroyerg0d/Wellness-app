import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { ArrowLeft, Check, ChevronDown, Flame, Pause, Play, SkipForward, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { todayKey, weekdayOf } from '../lib/dateUtils'
import { currentStreak, currentWeek } from '../lib/scheduleUtils'
import { getProgressionWeek } from '../data/progression'
import { dayByWeekday, dayById } from '../data/workout'
import { buildSession } from '../lib/session'
import { ExerciseImage } from '../components/ExerciseImage'
import { Button } from '../components/Button'
import { clock } from '../lib/format'
import { cn } from '../lib/cn'

const phaseTitle = (phase: 'warmup' | 'main' | 'cooldown', isYoga: boolean) =>
  phase === 'warmup' ? 'Warm-up' : phase === 'cooldown' ? 'Cool-down' : isYoga ? 'Yoga Flow' : 'Main Workout'

/** Self-contained per-step timer. Keyed by step index so it mounts fresh each step. */
function Countdown({
  duration,
  paused,
  onComplete,
  children,
}: {
  duration: number
  paused: boolean
  onComplete: () => void
  children: (remaining: number) => ReactNode
}) {
  const [remaining, setRemaining] = useState(duration)
  const done = useRef(false)

  useEffect(() => {
    if (paused || remaining <= 0) return
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [paused, remaining])

  useEffect(() => {
    if (remaining <= 0 && !done.current) {
      done.current = true
      onComplete()
    }
  }, [remaining, onComplete])

  return <>{children(remaining)}</>
}

export default function SessionPlayer() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, completeSession } = useStore()
  const today = todayKey()

  const paramDay = params.get('day')
  const todays = dayByWeekday[weekdayOf(today)]
  const day = (paramDay && dayById[paramDay]) || (todays.type !== 'rest' ? todays : dayById['day-1'])
  const rounds = getProgressionWeek(currentWeek(state.startDate, today)).rounds

  const steps = useMemo(() => buildSession(day, rounds), [day, rounds])

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showEasier, setShowEasier] = useState(false)
  const [finished, setFinished] = useState(false)
  const completedRef = useRef<Set<string>>(new Set())

  const step = steps[index]
  const isTimed = step?.kind === 'rest' || (step?.kind === 'exercise' && step.durationSeconds != null)

  // reset transient UI when the step changes
  useEffect(() => {
    setPaused(false)
    setShowEasier(false)
  }, [index])

  const chime = () => {
    if (!state.soundEnabled) return
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 680
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
      osc.start()
      osc.stop(ctx.currentTime + 0.42)
      osc.onended = () => ctx.close()
      if (navigator.vibrate) navigator.vibrate(80)
    } catch {
      /* audio unavailable */
    }
  }

  const advance = (markDone: boolean) => {
    if (step?.kind === 'exercise' && markDone) completedRef.current.add(step.exercise.id)
    if (index >= steps.length - 1) setFinished(true)
    else setIndex((i) => i + 1)
  }

  // On finish: persist + celebrate
  useEffect(() => {
    if (!finished) return
    completeSession(day.id, Array.from(completedRef.current), today)
    if (navigator.vibrate && state.soundEnabled) navigator.vibrate([60, 40, 120])
    const shots = [
      setTimeout(() => burst(0.3), 0),
      setTimeout(() => burst(0.7), 180),
      setTimeout(() => burst(0.5), 360),
    ]
    return () => shots.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const exit = () => {
    if (completedRef.current.size > 0 && !finished) {
      completeSession(day.id, Array.from(completedRef.current), today)
    }
    navigate('/')
  }

  if (finished) {
    return <Celebration name={state.userName} streak={currentStreak(state, today)} onDone={() => navigate('/')} />
  }

  if (!step) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream p-6">
        <Button onClick={() => navigate('/workout')}>Back to workout</Button>
      </div>
    )
  }

  const pct = Math.round((index / steps.length) * 100)
  const isYoga = day.type === 'yoga'

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col bg-cream">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <button
          type="button"
          onClick={exit}
          aria-label="Exit session"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 transition active:scale-95"
        >
          <X className="h-5 w-5 text-ink" />
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-200">
          <div className="h-full rounded-full bg-coral-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {step.kind === 'rest' ? (
        <Countdown key={index} duration={step.seconds} paused={paused} onComplete={() => { chime(); advance(false) }}>
          {(r) => <RestView seconds={r} label={step.label} paused={paused} />}
        </Countdown>
      ) : (
        <div className="flex flex-1 flex-col px-4 pt-4">
          <p className="mb-2 text-sm font-semibold text-coral-600">
            {step.exercise.category === 'cardio' ? 'Warm-up Walk' : phaseTitle(step.phase, isYoga)}
            {step.round ? ` · Round ${step.round} of ${step.roundsTotal}` : ''}
          </p>
          <ExerciseImage exercise={step.exercise} variant="full" className="aspect-[4/3] w-full rounded-3xl" />
          <h2 className="mt-4 font-display text-2xl font-bold text-ink">{step.exercise.name}</h2>

          {isTimed ? (
            <Countdown key={index} duration={step.durationSeconds ?? 0} paused={paused} onComplete={() => { chime(); advance(true) }}>
              {(r) => <p className="mt-1 font-display text-4xl font-bold tabular-nums text-coral-500">{clock(r)}</p>}
            </Countdown>
          ) : (
            <p className="mt-1 font-display text-2xl font-bold text-coral-500">{step.reps}</p>
          )}
          {isTimed && step.reps && <p className="text-sm text-ink-soft">{step.reps}</p>}

          <p className="mt-3 leading-relaxed text-ink-soft">{step.exercise.formCues}</p>

          <button
            type="button"
            onClick={() => setShowEasier((v) => !v)}
            className="mt-3 flex items-center gap-1 self-start rounded-full bg-coral-50 px-3 py-1.5 text-sm font-semibold text-coral-700"
          >
            Show easier version
            <ChevronDown className={cn('h-4 w-4 transition-transform', showEasier && 'rotate-180')} />
          </button>
          {showEasier && (
            <p className="mt-2 rounded-2xl bg-coral-50 p-3 text-sm leading-relaxed text-ink">
              {step.exercise.easierVariation}
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3 px-4 pb-8 pt-4">
        <Button size="lg" fullWidth onClick={() => advance(step.kind === 'exercise')}>
          {step.kind === 'rest' ? (
            <>
              <SkipForward className="h-5 w-5" /> Skip rest
            </>
          ) : isTimed ? (
            'Next'
          ) : (
            <>
              <Check className="h-5 w-5" /> Done
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2">
          {index > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
          )}
          {isTimed && (
            <Button variant="ghost" size="sm" onClick={() => setPaused((p) => !p)}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
          )}
          {step.kind === 'exercise' && (
            <Button variant="ghost" size="sm" onClick={() => advance(false)}>
              Skip <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function burst(x: number) {
  confetti({
    particleCount: 70,
    spread: 70,
    origin: { x, y: 0.5 },
    colors: ['#f97150', '#ffa88e', '#5aa06b', '#54c1ca', '#ffc9b8'],
    disableForReducedMotion: true,
  })
}

function RestView({ seconds, label, paused }: { seconds: number; label: string; paused: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-44 w-44 items-center justify-center rounded-full bg-sage-100">
        <div>
          <p className="font-display text-5xl font-bold tabular-nums text-sage-600">{clock(seconds)}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-sage-600/80">
            {paused ? 'Paused' : 'Rest'}
          </p>
        </div>
      </div>
      <p className="mt-6 font-display text-lg font-semibold text-ink">{label}</p>
      <p className="mt-1 text-ink-soft">Breathe. Shake it out. You're doing great.</p>
    </div>
  )
}

function Celebration({ name, streak, onDone }: { name: string; streak: number; onDone: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col items-center justify-center bg-cream px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-coral-500 shadow-lg shadow-coral-200">
        <Check className="h-12 w-12 text-white" strokeWidth={3} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink">You did it, {name}!</h1>
      <p className="mt-2 text-lg leading-relaxed text-ink-soft">
        That's another session in the books. Your body and mind thank you.
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-full bg-coral-100 px-5 py-3 text-coral-700">
        <Flame className="h-6 w-6 fill-coral-300 text-coral-500" />
        <span className="font-display text-xl font-bold">{streak}</span>
        <span>day{streak === 1 ? '' : 's'} streak</span>
      </div>
      <Button size="lg" fullWidth className="mt-8" onClick={onDone}>
        Back to Today
      </Button>
    </div>
  )
}
