// The in-progress workout, persisted locally so it survives an app close /
// background. Step timing uses an absolute end timestamp so the clock keeps
// "running" while the app is shut. Kept separate from synced UserState — an
// in-progress session is device-local.
export interface ActiveSession {
  dayId: string
  index: number
  completed: string[]
  stepEndsAt: number | null // absolute ms when the current timed step ends (null = rep step or paused)
  pausedRemaining: number | null // seconds left if paused
  startedAt: number
}

const KEY = 'shreya-active-session'

export function loadActiveSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ActiveSession
    if (!parsed || typeof parsed.dayId !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export function saveActiveSession(session: ActiveSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    /* ignore */
  }
}

export function clearActiveSession(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
