import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, GraduationCap, Play } from 'lucide-react'
import { useStore } from '../lib/store'
import { todayKey, weekdayOf } from '../lib/dateUtils'
import { currentWeek } from '../lib/scheduleUtils'
import { workoutDays } from '../data/workout'
import { getExercise } from '../data/exercises'
import { getProgressionWeek } from '../data/progression'
import { typeIcon } from '../lib/dayUi'
import { clearActiveSession } from '../lib/activeSession'
import { formatDuration } from '../lib/format'
import { ExerciseCard } from '../components/ExerciseCard'
import { Button } from '../components/Button'
import { cn } from '../lib/cn'

export default function Workout() {
  const navigate = useNavigate()
  const { state } = useStore()
  const today = todayKey()
  const todayWeekday = weekdayOf(today)
  const week = currentWeek(state.startDate, today)
  const prog = getProgressionWeek(week)

  const todaysWorkout = workoutDays.find((d) => d.weekday === todayWeekday)
  const [selectedId, setSelectedId] = useState(todaysWorkout?.id ?? 'day-1')
  const day = workoutDays.find((d) => d.id === selectedId) ?? workoutDays[0]
  const [showWhy, setShowWhy] = useState(false)

  const rounds = day.type === 'strength' ? prog.rounds : (day.roundsOverride ?? 1)
  const roundsLabel =
    day.type === 'strength'
      ? `${rounds} rounds`
      : day.type === 'cardio-circuit'
        ? `2 rounds × 30s`
        : 'Flow once (twice if you like)'

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-ink">Workout</h1>

      {/* Day selector */}
      <div className="grid grid-cols-4 gap-2">
        {workoutDays.map((d, i) => {
          const active = d.id === selectedId
          const Icon = typeIcon[d.type]
          const isToday = d.weekday === todayWeekday
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedId(d.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 transition active:scale-95',
                active ? 'bg-coral-500 text-white shadow-sm shadow-coral-200' : 'bg-white text-ink-soft shadow-sm shadow-black/5',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
              <span className="text-xs font-bold">Day {i + 1}</span>
              <span className="text-[10px] opacity-80">{d.weekday}</span>
              {isToday && (
                <span
                  className={cn(
                    'absolute right-2 top-2 h-1.5 w-1.5 rounded-full',
                    active ? 'bg-white' : 'bg-coral-400',
                  )}
                />
              )}
            </button>
          )
        })}
      </div>

      {todaysWorkout === undefined && (
        <p className="rounded-2xl bg-sage-50 px-4 py-3 text-sm text-sage-700">
          Today is a rest day — but feel free to preview or do any session below.
        </p>
      )}

      {/* Selected day header */}
      <div className="rounded-3xl bg-white p-5 shadow-sm shadow-black/5">
        <h2 className="font-display text-xl font-bold text-ink">{day.dayLabel}</h2>
        <p className="mt-0.5 text-ink-soft">{day.focus}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-coral-50 px-3 py-1 font-semibold text-coral-700">~{day.estMinutes} min</span>
          <span className="rounded-full bg-coral-50 px-3 py-1 font-semibold text-coral-700">Week {week}</span>
          <span className="rounded-full bg-coral-50 px-3 py-1 font-semibold text-coral-700">{roundsLabel}</span>
        </div>

        <Button
          size="lg"
          fullWidth
          className="mt-4"
          onClick={() => {
            clearActiveSession()
            navigate(`/workout/session?day=${day.id}`)
          }}
        >
          <Play className="h-5 w-5 fill-white" /> Begin Guided Session
        </Button>

        {/* Why this works */}
        <button
          type="button"
          onClick={() => setShowWhy((v) => !v)}
          className="mt-3 flex w-full items-center justify-between rounded-2xl bg-sand/50 px-4 py-3 text-left"
        >
          <span className="font-display font-semibold text-ink">Why this works</span>
          <ChevronDown className={cn('h-5 w-5 text-ink-soft transition-transform', showWhy && 'rotate-180')} />
        </button>
        {showWhy && <p className="mt-2 px-1 text-sm leading-relaxed text-ink-soft">{day.whyItWorks}</p>}
      </div>

      {/* Phases */}
      {day.warmupIds.length > 0 && (
        <Phase title="Warm-up" subtitle={`5 min · ${day.warmupIds.length} moves`} ids={day.warmupIds} onPick={(id) => navigate(`/exercise/${id}`)} />
      )}
      {(day.leadInIds ?? []).length > 0 && (
        <Phase title="Warm-up Walk" subtitle="15 min" ids={day.leadInIds ?? []} onPick={(id) => navigate(`/exercise/${id}`)} />
      )}
      <Phase
        title={day.type === 'yoga' ? 'Yoga Sequence' : day.type === 'cardio-circuit' ? 'Mini Circuit' : 'Main Workout'}
        subtitle={
          day.type === 'yoga'
            ? `~20 min · ${day.mainIds.length} poses`
            : day.type === 'cardio-circuit'
              ? `~10 min · 2 rounds`
              : `~20 min · ${rounds} rounds`
        }
        ids={day.mainIds}
        timedSeconds={day.mainTimedSeconds}
        onPick={(id) => navigate(`/exercise/${id}`)}
      />
      {day.cooldownIds.length > 0 && (
        <Phase title="Cool-down" subtitle={`5 min · ${day.cooldownIds.length} stretches`} ids={day.cooldownIds} onPick={(id) => navigate(`/exercise/${id}`)} />
      )}

      <button
        type="button"
        onClick={() => navigate('/library')}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 font-display font-semibold text-coral-600 shadow-sm shadow-black/5 transition active:scale-[0.99]"
      >
        <GraduationCap className="h-5 w-5" /> Browse all exercises
      </button>
    </div>
  )
}

function Phase({
  title,
  subtitle,
  ids,
  timedSeconds,
  onPick,
}: {
  title: string
  subtitle: string
  ids: string[]
  timedSeconds?: number
  onPick: (id: string) => void
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between px-1">
        <h3 className="font-display font-bold text-ink">{title}</h3>
        <span className="text-sm text-ink-soft">{subtitle}</span>
      </div>
      <div className="space-y-2">
        {ids.map((id) => {
          const ex = getExercise(id)
          if (!ex) return null
          return (
            <ExerciseCard
              key={id}
              exercise={ex}
              onClick={() => onPick(id)}
              label={timedSeconds ? formatDuration(timedSeconds) : undefined}
            />
          )
        })}
      </div>
    </section>
  )
}
