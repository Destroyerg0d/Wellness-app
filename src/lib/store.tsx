import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserState } from '../types'
import { clearState, defaultUserState, loadState, saveState } from './storage'
import { todayKey } from './dateUtils'
import { isCloudEnabled } from './supabase'
import { fetchRemoteState, pushRemoteState } from './sync'

type SettingsPatch = Partial<
  Pick<UserState, 'userName' | 'startDate' | 'seasonOverride' | 'waterGoalGlasses' | 'soundEnabled'>
>

interface StoreValue {
  state: UserState
  cloudEnabled: boolean
  completeOnboarding: (opts: { userName: string; startDate: string }) => void
  completeSession: (dayId: string, completedExerciseIds: string[], date?: string) => void
  logWalk: (value?: boolean, date?: string) => void
  setWater: (glasses: number, date?: string) => void
  addWater: (delta: number, date?: string) => void
  toggleFavorite: (mealId: string) => void
  updateSettings: (patch: SettingsPatch) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function stamp(s: UserState): UserState {
  return { ...s, updatedAt: new Date().toISOString() }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(() => loadState())

  const stateRef = useRef(state)
  stateRef.current = state
  const readyRef = useRef(false)
  const adoptingRef = useRef(false)
  const lastPushedRef = useRef<string | null>(null)

  // Persist locally on every change.
  useEffect(() => {
    saveState(state)
  }, [state])

  // One-time cloud reconcile: newest of {local, remote} wins.
  useEffect(() => {
    if (!isCloudEnabled) {
      readyRef.current = true
      return
    }
    let cancelled = false
    fetchRemoteState().then((remote) => {
      if (cancelled) return
      const local = stateRef.current
      if (remote && (remote.updatedAt ?? '') > (local.updatedAt ?? '')) {
        adoptingRef.current = true
        lastPushedRef.current = remote.updatedAt
        setState({ ...defaultUserState(), ...remote })
      } else {
        lastPushedRef.current = local.updatedAt
        if (!remote || (local.updatedAt ?? '') > (remote.updatedAt ?? '')) pushRemoteState(local)
      }
      readyRef.current = true
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Debounced push on local changes.
  useEffect(() => {
    if (!isCloudEnabled || !readyRef.current) return
    if (adoptingRef.current) {
      adoptingRef.current = false
      return
    }
    if (state.updatedAt === lastPushedRef.current) return
    const id = setTimeout(() => {
      lastPushedRef.current = state.updatedAt
      pushRemoteState(state)
    }, 800)
    return () => clearTimeout(id)
  }, [state])

  const value = useMemo<StoreValue>(() => {
    const mutate = (fn: (s: UserState) => UserState) => setState((s) => stamp(fn(s)))
    return {
      state,
      cloudEnabled: isCloudEnabled,
      completeOnboarding: ({ userName, startDate }) =>
        mutate((s) => ({ ...s, userName: userName.trim() || 'Shreya', startDate, onboardingComplete: true })),
      completeSession: (dayId, completedExerciseIds, date = todayKey()) =>
        mutate((s) => {
          const others = s.completedSessions.filter((c) => c.date !== date)
          return { ...s, completedSessions: [...others, { date, dayId, completedExerciseIds }] }
        }),
      logWalk: (value = true, date = todayKey()) =>
        mutate((s) => ({ ...s, walkLog: { ...s.walkLog, [date]: value } })),
      setWater: (glasses, date = todayKey()) =>
        mutate((s) => ({ ...s, waterLog: { ...s.waterLog, [date]: Math.max(0, glasses) } })),
      addWater: (delta, date = todayKey()) =>
        mutate((s) => ({
          ...s,
          waterLog: { ...s.waterLog, [date]: Math.max(0, (s.waterLog[date] ?? 0) + delta) },
        })),
      toggleFavorite: (mealId) =>
        mutate((s) => ({
          ...s,
          favoriteMealIds: s.favoriteMealIds.includes(mealId)
            ? s.favoriteMealIds.filter((id) => id !== mealId)
            : [...s.favoriteMealIds, mealId],
        })),
      updateSettings: (patch) => mutate((s) => ({ ...s, ...patch })),
      resetAll: () => {
        clearState()
        setState(stamp({ ...defaultUserState(), onboardingComplete: false }))
      },
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
