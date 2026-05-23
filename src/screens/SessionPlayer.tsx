import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { ArrowLeft, Check, ChevronDown, Flame, Pause, Play, SkipForward, X } from 'lucide-react'
import { useStore } from '../lib/store'
import { todayKey, weekdayOf } from '../lib/dateUtils'
import { currentStreak, currentWeek } from '../lib/scheduleUtils'
import { getProgressionWeek } from '../data/progression'
import { dayByWeekday, dayById } from '../data/workout'
import { buildSession } from '../lib/session'
import { clearActiveSession, loadActiveSession, saveActiveSession } from '../lib/activeSession'
import { playChime, playFinish, playTick } from '../lib/sounds'
import { ExerciseImage } from '../components/ExerciseImage'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { clock } from '../lib/format'
import { cn } from '../lib/cn'

const phaseTitle = (phase: 'warmup' | 'main' | 'cooldown', isYoga: boolean) =>
  phase === 'warmup' ? 'Warm-up' : phase === 'cooldown' ? 'Cool-down' : isYoga ? 'Yoga Flow' : 'Main Workout'

const stepDuration = (s: { kind: 'rest'; seconds: number } | { kind: 'exercise'; durationSeconds?: number } | undefined) =>
  s?.kind === 'rest' ? s.seconds : s?.kind === 'exercise' ? s.durationSeconds ?? 0 : 0

export default function SessionPlayer() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, completeSession } = useStore()
  const today = todayKey()

  // Resume a persisted session if there is one; otherwise start the requested day.
  const persistedRef = useRef(loadActiveSession())
  const persisted = persistedRef.current
  const paramDay = params.get('day')
  const todays = dayByWeekday[weekdayOf(today)]
  const dayId =
    persisted?.dayId ?? (paramDay && dayById[paramDay] ? paramDay : todays.type !== 'rest' ? todays.id : 'day-1')
  const day = dayById[dayId] ?? dayById['day-1']
  const rounds = getProgressionWeek(currentWeek(state.startDate, today)).rounds
  const steps = useMemo(() => buildSession(day, rounds), [day, rounds])

  const [index, setIndex] = useState(persisted?.index ?? 0)
  const [completed, setCompleted] = useState<string[]>(persisted?.completed ?? [])
  const [stepEndsAt, setStepEndsAt] = useState<number | null>(persisted?.stepEndsAt ?? null)
  const [pausedRemaining, setPausedRemaining] = useState<number | null>(persisted?.pausedRemaining ?? null)
  const [paused, setPaused] = useState<boolean>(persisted?.pausedRemaining != null)
  const [now, setNow] = useState(Date.now())
  const [showEasier, setShowEasier] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showQuit, setShowQuit] = useState(false)

  const step = steps[index]
  const isTimed = step?.kind === 'rest' || (step?.kind === 'exercise' && step.durationSeconds != null)
  const remaining = paused
    ? pausedRemaining ?? 0
    : stepEndsAt != null
      ? Math.max(0, Math.ceil((stepEndsAt - now) / 1000))
      : 0

  const sound = (fn: () => void) => {
    if (state.soundEnabled) fn()
  }

  const goToStep = (i: number) => {
    if (i < 0 || i >= steps.length) return
    const dur = stepDuration(steps[i])
    setShowEasier(false)
    setPaused(false)
    setPausedRemaining(null)
    setStepEndsAt(dur > 0 ? Date.now() + dur * 1000 : null)
    setIndex(i)
  }

  const advance = (markDone: boolean) => {
    if (step?.kind === 'exercise' && markDone) {
      setCompleted((c) => (c.includes(step.exercise.id) ? c : [...c, step.exercise.id]))
    }
    if (index >= steps.length - 1) setFinished(true)
    else goToStep(index + 1)
  }

  // Mount: for a fresh start (no persisted), arm the timer for step 0.
  useEffect(() => {
    if (!persistedRef.current) {
      const dur = stepDuration(steps[0])
      if (dur > 0) setStepEndsAt(Date.now() + dur * 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Wall-clock tick (keeps running by absolute time; re-syncs when tab becomes visible).
  useEffect(() => {
    if (finished) return
    const id = setInterval(() => setNow(Date.now()), 250)
    const onVisible = () => {
      if (!document.hidden) setNow(Date.now())
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [finished])

  // Auto-advance a timed step when its end time passes (even after being backgrounded).
  useEffect(() => {
    if (finished || paused || stepEndsAt == null) return
    if (now >= stepEndsAt) {
      sound(playChime)
      if (state.soundEnabled && navigator.vibrate) navigator.vibrate(60)
      advance(step?.kind === 'exercise')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, paused, stepEndsAt, finished])

  // Persist the session so it survives a close (not on every tick — end time is absolute).
  useEffect(() => {
    if (finished) return
    saveActiveSession({
      dayId: day.id,
      index,
      completed,
      stepEndsAt: paused ? null : stepEndsAt,
      pausedRemaining: paused ? pausedRemaining ?? remaining : null,
      startedAt: persistedRef.current?.startedAt ?? Date.now(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, completed, stepEndsAt, paused, pausedRemaining, finished, day.id])

  // Quit-resistance: a back press shows a confirm instead of leaving. Only finishing counts.
  useEffect(() => {
    if (finished) return
    window.history.pushState({ sw: 'session' }, '')
    const onPop = () => {
      window.history.pushState({ sw: 'session' }, '')
      setShowQuit(true)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [finished])

  // Finish: save + celebrate, clear the active session.
  useEffect(() => {
    if (!finished) return
    completeSession(day.id, completed, today)
    clearActiveSession()
    sound(playFinish)
    if (state.soundEnabled && navigator.vibrate) navigator.vibrate([60, 40, 120])
    const shots = [
      setTimeout(() => burst(0.3), 0),
      setTimeout(() => burst(0.7), 180),
      setTimeout(() => burst(0.5), 360),
    ]
    return () => shots.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const togglePause = () => {
    if (paused) {
      setStepEndsAt(Date.now() + (pausedRemaining ?? 0) * 1000)
      setPausedRemaining(null)
      setPaused(false)
    } else {
      setPausedRemaining(remaining)
      setStepEndsAt(null)
      setPaused(true)
    }
  }

  const quit = () => {
    clearActiveSession()
    navigate('/')
  }

  if (finished) {
    return <Celebration name={state.userName} streak={currentStreak(state, today)} onDone={() => navigate('/')} />
  }

  if (!step) {
    clearActiveSession()
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
          onClick={() => setShowQuit(true)}
          aria-label="Quit session"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 transition active:scale-95"
        >
          <X className="h-5 w-5 text-ink" />
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-200">
          <div className="h-full rounded-full bg-coral-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {step.kind === 'rest' ? (
        <RestView seconds={remaining} label={step.label} paused={paused} />
      ) : (
        <div className="flex flex-1 flex-col px-4 pt-4">
          <p className="mb-2 text-sm font-semibold text-coral-600">
            {step.exercise.category === 'cardio' ? 'Warm-up Walk' : phaseTitle(step.phase, isYoga)}
            {step.round ? ` · Round ${step.round} of ${step.roundsTotal}` : ''}
          </p>
          <ExerciseImage exercise={step.exercise} variant="full" className="aspect-[4/3] w-full rounded-3xl" />
          <h2 className="mt-4 font-display text-2xl font-bold text-ink">{step.exercise.name}</h2>

          {isTimed ? (
            <p className="mt-1 font-display text-4xl font-bold tabular-nums text-coral-500">{clock(remaining)}</p>
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
        <Button
          size="lg"
          fullWidth
          onClick={() => {
            sound(playTick)
            advance(step.kind === 'exercise')
          }}
        >
          {step.kind === 'rest' ? (
            <>
              <SkipForward className="h-5 w-5" /> Skip rest
            </>
          ) : index >= steps.length - 1 ? (
            <>
              <Check className="h-5 w-5" /> Finish workout
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sound(playTick)
                goToStep(index - 1)
              }}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
          )}
          {isTimed && (
            <Button variant="ghost" size="sm" onClick={togglePause}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {paused ? 'Resume' : 'Pause'}
            </Button>
          )}
          {step.kind === 'exercise' && index < steps.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sound(playTick)
                advance(false)
              }}
            >
              Skip <SkipForward className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showQuit}
        danger
        title="Leave this workout?"
        message="Your progress won't be saved — only finishing the workout counts it. Want to keep going?"
        confirmLabel="Quit"
        cancelLabel="Keep going"
        onConfirm={quit}
        onCancel={() => setShowQuit(false)}
      />
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
