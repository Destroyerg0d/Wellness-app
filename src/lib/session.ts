import type { Exercise, WorkoutDay } from '../types'
import { getExercise } from '../data/exercises'

export type ExercisePhase = 'warmup' | 'main' | 'cooldown'

export type SessionStep =
  | {
      kind: 'exercise'
      exercise: Exercise
      phase: ExercisePhase
      reps?: string
      durationSeconds?: number
      round?: number
      roundsTotal?: number
    }
  | { kind: 'rest'; seconds: number; label: string }

/**
 * Expand a WorkoutDay + the current week's rounds into a flat, ordered list of
 * steps the session player walks through. Handles all four day shapes:
 *  - strength: warm-up → mainIds × weekRounds → cool-down (rep-based)
 *  - yoga:     mainIds × 1 (timed holds), no rests, no separate warm-up/cool-down
 *  - cardio-circuit (Day 4): walk lead-in → mainIds × 2 (timed 30s) → cool-down
 */
export function buildSession(day: WorkoutDay, weekRounds: number): SessionStep[] {
  const steps: SessionStep[] = []

  const exStep = (
    id: string,
    phase: ExercisePhase,
    extra: Partial<Omit<Extract<SessionStep, { kind: 'exercise' }>, 'kind' | 'exercise' | 'phase'>> = {},
  ) => {
    const exercise = getExercise(id)
    if (exercise) steps.push({ kind: 'exercise', exercise, phase, ...extra })
  }

  // Warm-up — single pass
  for (const id of day.warmupIds) {
    exStep(id, 'warmup', { durationSeconds: getExercise(id)?.durationSeconds })
  }

  // Lead-in (Day-4 walk) — single pass, counts as "main"
  for (const id of day.leadInIds ?? []) {
    const ex = getExercise(id)
    exStep(id, 'main', { durationSeconds: ex?.durationSeconds, reps: ex?.targetReps })
  }

  const rounds = day.type === 'strength' ? weekRounds : (day.roundsOverride ?? 1)
  const betweenRest = day.type === 'strength' ? 25 : day.type === 'cardio-circuit' ? 15 : 0
  const roundRest = day.type === 'cardio-circuit' ? 30 : 60

  for (let r = 1; r <= rounds; r++) {
    day.mainIds.forEach((id, i) => {
      const ex = getExercise(id)
      const timed = day.mainTimedSeconds
      exStep(id, 'main', {
        reps: timed ? undefined : ex?.targetReps,
        durationSeconds: timed ?? ex?.durationSeconds,
        round: rounds > 1 ? r : undefined,
        roundsTotal: rounds > 1 ? rounds : undefined,
      })
      if (betweenRest > 0 && i < day.mainIds.length - 1) {
        steps.push({ kind: 'rest', seconds: betweenRest, label: 'Quick rest' })
      }
    })
    if (r < rounds && roundRest > 0) {
      steps.push({ kind: 'rest', seconds: roundRest, label: `Round ${r + 1} of ${rounds} coming up` })
    }
  }

  // Cool-down — single pass
  for (const id of day.cooldownIds) {
    exStep(id, 'cooldown', { durationSeconds: getExercise(id)?.durationSeconds })
  }

  return steps
}

/** Unique exercise ids that make up a day's session (for completion tracking + overview). */
export function sessionExerciseIds(day: WorkoutDay): string[] {
  return Array.from(
    new Set([...(day.leadInIds ?? []), ...day.warmupIds, ...day.mainIds, ...day.cooldownIds]),
  )
}

export function countExerciseSteps(steps: SessionStep[]): number {
  return steps.filter((s) => s.kind === 'exercise').length
}
