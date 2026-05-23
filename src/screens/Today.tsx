import { useNavigate } from 'react-router-dom'
import { Apple, CheckCircle2, ChevronRight, Clock, Dumbbell, Flame, Flower2, Footprints, Moon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { WorkoutType } from '../types'
import { useStore } from '../lib/store'
import { greeting, parseKey, todayKey } from '../lib/dateUtils'
import { completedOn, currentStreak, currentWeek, isDayDone, resolveSeason, todaysDay } from '../lib/scheduleUtils'
import { dayById } from '../data/workout'
import { getProgressionWeek } from '../data/progression'
import { motivationForDate } from '../data/motivation'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { WaterTracker } from '../components/WaterTracker'
import { BirthdayCountdown } from '../components/BirthdayCountdown'
import { cn } from '../lib/cn'

const typeIcon: Record<WorkoutType, ComponentType<{ className?: string; strokeWidth?: number }>> = {
  strength: Dumbbell,
  yoga: Flower2,
  'cardio-circuit': Footprints,
  rest: Moon,
}

function metaForDay(type: WorkoutType, rounds: number): string {
  if (type === 'strength') return `${rounds} rounds`
  if (type === 'cardio-circuit') return 'Walk + circuit'
  if (type === 'yoga') return 'Gentle flow'
  return ''
}

export default function Today() {
  const navigate = useNavigate()
  const { state, logWalk } = useStore()
  const today = todayKey()
  const day = todaysDay(today)
  const week = currentWeek(state.startDate, today)
  const prog = getProgressionWeek(week)
  const streak = currentStreak(state, today)
  const doneToday = isDayDone(state, today)
  const doneSession = doneToday ? completedOn(state, today) : undefined
  const doneLabel = doneSession ? (dayById[doneSession.dayId]?.dayLabel ?? day.dayLabel) : day.dayLabel
  const walkedToday = !!state.walkLog[today]
  const season = resolveSeason(state.seasonOverride)
  const weekdayFull = parseKey(today).toLocaleDateString('en-US', { weekday: 'long' })
  const Icon = typeIcon[day.type]
  const isRest = day.type === 'rest'

  return (
    <div className="space-y-4">
      {/* Greeting + streak */}
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="text-ink-soft">{greeting()},</p>
          <h1 className="font-display text-3xl font-bold text-ink">{state.userName}</h1>
        </div>
        {streak > 0 ? (
          <div className="flex items-center gap-1.5 rounded-full bg-coral-100 px-3 py-2 text-coral-700">
            <Flame className="h-5 w-5 fill-coral-300 text-coral-500" strokeWidth={1.8} />
            <span className="font-display font-bold">{streak}</span>
            <span className="text-sm">day{streak === 1 ? '' : 's'}</span>
          </div>
        ) : (
          <div className="rounded-full bg-sand px-3 py-2 text-sm font-semibold text-ink-soft">New start</div>
        )}
      </header>

      {/* Hero — today's plan */}
      {isRest ? (
        <RestCard
          weekdayFull={weekdayFull}
          note={day.note}
          walked={walkedToday}
          onToggleWalk={() => logWalk(!walkedToday)}
        />
      ) : doneToday ? (
        <DoneCard dayLabel={doneLabel} onView={() => navigate('/workout')} />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-coral-500 to-coral-400 p-5 text-white shadow-lg shadow-coral-200/70">
          <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
            <Icon className="h-4 w-4" strokeWidth={2.2} />
            Today · {weekdayFull}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight">{day.dayLabel}</h2>
          <p className="mt-0.5 text-white/85">{day.focus}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>
              <Clock className="h-3.5 w-3.5" /> ~{day.estMinutes} min
            </Chip>
            <Chip>Week {week}</Chip>
            <Chip>{metaForDay(day.type, prog.rounds)}</Chip>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/90">{prog.instruction}</p>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            className="mt-4 border-transparent"
            onClick={() => navigate('/workout')}
          >
            Start Workout
          </Button>
        </div>
      )}

      {/* Water */}
      <Card>
        <WaterTracker compact />
      </Card>

      {/* Birthday countdown */}
      <BirthdayCountdown />

      {/* Food shortcut */}
      <button
        type="button"
        onClick={() => navigate('/food')}
        className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm shadow-black/5 transition active:scale-[0.99]"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral-100">
          <Apple className="h-6 w-6 text-coral-500" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink">Eating today?</p>
          <p className="text-sm text-ink-soft">See your {season} meal options</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-ink-soft/50" />
      </button>

      {/* Motivation */}
      <div className="rounded-3xl bg-sand/60 p-4">
        <p className="leading-relaxed text-ink-soft">{motivationForDate(today)}</p>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
      {children}
    </span>
  )
}

function RestCard({
  weekdayFull,
  note,
  walked,
  onToggleWalk,
}: {
  weekdayFull: string
  note?: string
  walked: boolean
  onToggleWalk: () => void
}) {
  return (
    <div className="rounded-3xl border border-sage-100 bg-sage-50 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-sage-600">
        <Moon className="h-4 w-4" strokeWidth={2.2} />
        Today · {weekdayFull}
      </div>
      <h2 className="mt-2 font-display text-2xl font-bold text-ink">Rest Day</h2>
      {note && <p className="mt-1 leading-relaxed text-ink-soft">{note}</p>}
      <button
        type="button"
        onClick={onToggleWalk}
        className={cn(
          'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-display font-semibold transition active:scale-[0.98]',
          walked ? 'bg-sage-500 text-white' : 'bg-white text-sage-600 ring-1 ring-sage-200',
        )}
      >
        {walked ? <CheckCircle2 className="h-5 w-5" /> : <Footprints className="h-5 w-5" />}
        {walked ? 'Walk logged — nice!' : 'Log a 10-min walk'}
      </button>
    </div>
  )
}

function DoneCard({ dayLabel, onView }: { dayLabel: string; onView: () => void }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-sage-500 to-sage-400 p-5 text-white shadow-lg shadow-sage-100">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-7 w-7" strokeWidth={2} />
        <h2 className="font-display text-2xl font-bold">Done today!</h2>
      </div>
      <p className="mt-2 text-white/90">Great job, you finished {dayLabel}. Rest up and hydrate.</p>
      <button
        type="button"
        onClick={onView}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 underline-offset-2 hover:underline"
      >
        View today's workout <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
