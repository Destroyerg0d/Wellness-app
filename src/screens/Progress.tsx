import { Check, Flame, Minus, Moon, Trophy } from 'lucide-react'
import type { WeekCellStatus } from '../lib/scheduleUtils'
import { useStore } from '../lib/store'
import { addDays, formatNice, todayKey, weekdayOf } from '../lib/dateUtils'
import { bestStreak, currentStreak, currentWeek, weekStrip } from '../lib/scheduleUtils'
import { progression } from '../data/progression'
import { dayById } from '../data/workout'
import { cn } from '../lib/cn'

export default function Progress() {
  const { state } = useStore()
  const today = todayKey()
  const streak = currentStreak(state, today)
  const best = bestStreak(state, today)
  const week = currentWeek(state.startDate, today)
  const cells = weekStrip(state, today)
  const goal = state.waterGoalGlasses

  const history = [...state.completedSessions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 8)

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -(6 - i))
    return { date: d, glasses: state.waterLog[d] ?? 0 }
  })

  const streakLine =
    streak === 0
      ? "Today's a great day to begin."
      : streak < 3
        ? "You've started — keep it going!"
        : `You're on a roll, ${state.userName}!`

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-ink">Progress</h1>

      {/* Streak */}
      <div className="rounded-3xl bg-gradient-to-br from-coral-500 to-coral-400 p-5 text-white shadow-lg shadow-coral-200/70">
        <div className="flex items-center justify-around text-center">
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <Flame className="h-7 w-7 fill-white/30" />
              <span className="font-display text-4xl font-bold">{streak}</span>
            </div>
            <p className="mt-1 text-sm text-white/85">current streak</p>
          </div>
          <div className="h-12 w-px bg-white/25" />
          <div>
            <span className="font-display text-4xl font-bold">{best}</span>
            <p className="mt-1 text-sm text-white/85">best streak</p>
          </div>
        </div>
        <p className="mt-3 text-center font-display font-semibold">{streakLine}</p>
      </div>

      {/* This week */}
      <section>
        <h2 className="mb-2 px-1 font-display font-bold text-ink">This week</h2>
        <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
          <div className="flex justify-between">
            {cells.map((c) => (
              <div key={c.date} className="flex flex-col items-center gap-1.5">
                <WeekDot status={c.status} />
                <span className="text-xs font-semibold text-ink-soft">{c.weekday[0]}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-ink-soft">Missed a day? That's okay — just don't miss two.</p>
        </div>
      </section>

      {/* 8-week journey */}
      <section>
        <h2 className="mb-2 px-1 font-display font-bold text-ink">Your 8-week journey</h2>
        {week > 8 && (
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-400 p-4 text-white shadow-sm shadow-coral-200">
            <Trophy className="h-7 w-7 shrink-0" strokeWidth={1.8} />
            <div>
              <p className="font-display font-bold">Week {week} — maintaining strong</p>
              <p className="text-sm text-white/90">You've graduated the 8-week foundation. Keep showing up!</p>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {progression.map((w) => {
            const isPast = w.week < week
            const isCurrent = w.week === week
            return (
              <div
                key={w.week}
                className={cn(
                  'flex items-start gap-3 rounded-2xl p-3.5 transition',
                  isCurrent ? 'bg-coral-500 text-white shadow-sm shadow-coral-200' : 'bg-white shadow-sm shadow-black/5',
                )}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display font-bold',
                    isCurrent ? 'bg-white text-coral-600' : isPast ? 'bg-sage-100 text-sage-600' : 'bg-sand text-ink-soft',
                  )}
                >
                  {isPast ? <Check className="h-5 w-5" /> : w.week}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={cn('font-display font-bold', isCurrent ? 'text-white' : 'text-ink')}>Week {w.week}</p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        isCurrent ? 'bg-white/20 text-white' : 'bg-coral-50 text-coral-600',
                      )}
                    >
                      {w.rounds} rounds
                    </span>
                  </div>
                  <p className={cn('mt-0.5 text-sm leading-relaxed', isCurrent ? 'text-white/90' : 'text-ink-soft')}>
                    {isCurrent ? w.instruction : w.progressionLever}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Water — last 7 days */}
      <section>
        <h2 className="mb-2 px-1 font-display font-bold text-ink">Water · last 7 days</h2>
        <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
          <div className="flex items-end justify-between gap-2">
            {last7.map(({ date, glasses }) => {
              const frac = Math.min(glasses / goal, 1)
              const met = glasses >= goal
              return (
                <div key={date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-aqua-600">{glasses}</span>
                  <div className="relative h-20 w-full overflow-hidden rounded-lg bg-aqua-50">
                    <div
                      className={cn('absolute inset-x-0 bottom-0 rounded-lg transition-all', met ? 'bg-aqua-500' : 'bg-aqua-300')}
                      style={{ height: `${Math.max(frac * 100, glasses > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-ink-soft">{weekdayOf(date)[0]}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* History */}
      <section>
        <h2 className="mb-2 px-1 font-display font-bold text-ink">Recent sessions</h2>
        {history.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm shadow-black/5">
            <p className="font-display font-semibold text-ink">No sessions yet</p>
            <p className="mt-1 text-sm text-ink-soft">Your finished workouts will show up here. The first one is the hardest.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((s) => (
              <div key={s.date} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100">
                  <Check className="h-5 w-5 text-sage-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-semibold text-ink">
                    {dayById[s.dayId]?.dayLabel ?? 'Workout'}
                  </p>
                  <p className="text-sm text-ink-soft">{formatNice(s.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function WeekDot({ status }: { status: WeekCellStatus }) {
  if (status === 'done') {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-500 text-white">
        <Check className="h-5 w-5" />
      </div>
    )
  }
  if (status === 'rest') {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-100 text-sage-600">
        <Moon className="h-4 w-4" />
      </div>
    )
  }
  if (status === 'today') {
    return <div className="h-10 w-10 rounded-2xl bg-coral-50 ring-2 ring-coral-400" />
  }
  if (status === 'missed') {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sand-200 text-ink-soft/50">
        <Minus className="h-4 w-4" />
      </div>
    )
  }
  // upcoming / before
  return <div className="h-10 w-10 rounded-2xl border border-dashed border-sand-200" />
}
