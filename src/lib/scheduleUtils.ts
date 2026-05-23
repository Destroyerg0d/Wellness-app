import type { Season, SeasonalDiet, UserState, Weekday, WorkoutDay } from '../types'
import { dayByWeekday } from '../data/workout'
import { seasonalDiets } from '../data/diet'
import { addDays, daysBetween, daysSince, startOfWeek, todayKey, weekdayOf } from './dateUtils'

/** Current plan week (unlimited — keeps counting past week 8 for ongoing training). */
export function currentWeek(startDate: string, today: string = todayKey()): number {
  const since = daysSince(startDate, today)
  return Math.max(Math.floor(since / 7) + 1, 1)
}

export function seasonAuto(d: Date = new Date()): Season {
  const m = d.getMonth() // 0=Jan
  if (m >= 2 && m <= 5) return 'summer' // Mar–Jun
  if (m >= 6 && m <= 8) return 'monsoon' // Jul–Sep
  if (m >= 9 && m <= 10) return 'autumn' // Oct–Nov
  return 'winter' // Dec–Feb
}

export function resolveSeason(override: Season | 'auto', d: Date = new Date()): Season {
  return override === 'auto' ? seasonAuto(d) : override
}

export function getSeasonalDiet(state: UserState, d: Date = new Date()): SeasonalDiet {
  return seasonalDiets[resolveSeason(state.seasonOverride, d)]
}

export function dayForWeekday(weekday: Weekday): WorkoutDay {
  return dayByWeekday[weekday]
}

export function dayForDate(key: string): WorkoutDay {
  return dayByWeekday[weekdayOf(key)]
}

export function todaysDay(today: string = todayKey()): WorkoutDay {
  return dayForDate(today)
}

export function isDayDone(state: UserState, key: string): boolean {
  return state.completedSessions.some((s) => s.date === key)
}

export function completedOn(state: UserState, key: string) {
  return state.completedSessions.find((s) => s.date === key)
}

type Qualify = 'done' | 'rest' | 'miss'

function qualify(state: UserState, key: string): Qualify {
  if (isDayDone(state, key) || state.walkLog[key]) return 'done'
  return dayForDate(key).type === 'rest' ? 'rest' : 'miss'
}

/**
 * Consecutive qualifying days counting back from today (done OR scheduled rest).
 * A not-yet-done workout *today* is treated as pending, not a miss, so the streak
 * never breaks just because the day isn't over.
 */
export function currentStreak(state: UserState, today: string = todayKey()): number {
  let streak = 0
  let cursor = today
  if (qualify(state, cursor) === 'miss') {
    cursor = addDays(cursor, -1) // today is still pending — start from yesterday
  }
  while (daysBetween(state.startDate, cursor) >= 0) {
    const q = qualify(state, cursor)
    if (q === 'done' || q === 'rest') {
      streak++
      cursor = addDays(cursor, -1)
    } else {
      break
    }
  }
  return streak
}

export function bestStreak(state: UserState, today: string = todayKey()): number {
  if (daysBetween(state.startDate, today) < 0) return 0
  let best = 0
  let run = 0
  let cursor = state.startDate
  while (daysBetween(cursor, today) >= 0) {
    const q = qualify(state, cursor)
    if (q === 'done' || q === 'rest') {
      run++
      if (run > best) best = run
    } else if (cursor !== today) {
      run = 0 // a real miss in the past
    }
    cursor = addDays(cursor, 1)
  }
  return Math.max(best, currentStreak(state, today))
}

export type WeekCellStatus = 'done' | 'rest' | 'missed' | 'today' | 'upcoming' | 'before'
export interface WeekCell {
  weekday: Weekday
  date: string
  status: WeekCellStatus
}

/** Mon–Sun status strip for the week containing `today`. */
export function weekStrip(state: UserState, today: string = todayKey()): WeekCell[] {
  const monday = startOfWeek(today)
  const cells: WeekCell[] = []
  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i)
    const cmp = daysBetween(today, date) // >0 future, 0 today, <0 past
    const done = isDayDone(state, date) || !!state.walkLog[date]
    const isRest = dayForDate(date).type === 'rest'
    let status: WeekCellStatus
    if (daysBetween(state.startDate, date) < 0) status = 'before'
    else if (cmp > 0) status = 'upcoming'
    else if (cmp === 0) status = done ? 'done' : isRest ? 'rest' : 'today'
    else status = done ? 'done' : isRest ? 'rest' : 'missed'
    cells.push({ weekday: weekdayOf(date), date, status })
  }
  return cells
}
