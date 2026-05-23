import type { Weekday } from '../types'

const WEEKDAYS: Weekday[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Local calendar date as 'YYYY-MM-DD' (uses the device's local day). */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function todayKey(): string {
  return dateKey(new Date())
}

/** Parse 'YYYY-MM-DD' into a local Date at midnight. */
export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Day-count ordinal from a date key — DST-proof (treats the key as a calendar date). */
function ordinal(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000)
}

/** Whole days from a -> b (b minus a). Negative if b is before a. */
export function daysBetween(aKey: string, bKey: string): number {
  return ordinal(bKey) - ordinal(aKey)
}

export function daysSince(startKey: string, today: string = todayKey()): number {
  return daysBetween(startKey, today)
}

export function addDays(key: string, n: number): string {
  const d = parseKey(key)
  d.setDate(d.getDate() + n)
  return dateKey(d)
}

export function weekdayOf(d: Date | string): Weekday {
  const date = typeof d === 'string' ? parseKey(d) : d
  return WEEKDAYS[date.getDay()]
}

/** Time-aware greeting for the home screen. */
export function greeting(d: Date = new Date()): string {
  const h = d.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** e.g. "Mon, 12 May" */
export function formatNice(key: string): string {
  const d = parseKey(key)
  return `${weekdayOf(d)}, ${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** Monday-start: returns the date key of the Monday of the week containing `key`. */
export function startOfWeek(key: string): string {
  const d = parseKey(key)
  const dow = d.getDay() // 0=Sun..6=Sat
  const offset = dow === 0 ? -6 : 1 - dow // shift back to Monday
  return addDays(key, offset)
}
