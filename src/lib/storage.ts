import type { UserState } from '../types'
import { todayKey } from './dateUtils'

const STORAGE_KEY = 'shreya-wellness'
export const SCHEMA_VERSION = 1

export function defaultUserState(): UserState {
  return {
    schemaVersion: SCHEMA_VERSION,
    userName: 'Shreya',
    startDate: todayKey(),
    seasonOverride: 'auto',
    waterGoalGlasses: 12,
    waterLog: {},
    walkLog: {},
    mealLog: {},
    completedSessions: [],
    favoriteMealIds: [],
    onboardingComplete: false,
    soundEnabled: true,
    updatedAt: new Date(0).toISOString(), // epoch so any real remote/local data is "newer"
  }
}

/**
 * Load state from localStorage. Degrades gracefully:
 * - empty / corrupt JSON  -> fresh defaults
 * - missing keys          -> filled from defaults (forward-compatible)
 * - unknown schemaVersion -> reset to defaults
 */
export function loadState(): UserState {
  const defaults = defaultUserState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<UserState>
    if (!parsed || typeof parsed !== 'object') return defaults
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      // Only v1 exists today; future migrations would slot in here.
      return defaults
    }
    return {
      ...defaults,
      ...parsed,
      waterLog: { ...(parsed.waterLog ?? {}) },
      walkLog: { ...(parsed.walkLog ?? {}) },
      mealLog: { ...(parsed.mealLog ?? {}) },
      completedSessions: Array.isArray(parsed.completedSessions) ? parsed.completedSessions : [],
      favoriteMealIds: Array.isArray(parsed.favoriteMealIds) ? parsed.favoriteMealIds : [],
    }
  } catch {
    return defaults
  }
}

export function saveState(state: UserState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full / unavailable (private mode) — fail silently; the app still works in-memory.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
