import type { ProgressionWeek } from '../types'

// 8-Week Progression Table (PRD 11.8)
export const progression: ProgressionWeek[] = [
  {
    week: 1,
    rounds: 2,
    instruction: "Just show up. Complete all 4 sessions — that's the only goal.",
    progressionLever: 'None — settle in',
  },
  {
    week: 2,
    rounds: 2,
    instruction: 'Repeat Week 1. Notice the movements feeling more familiar.',
    progressionLever: 'None — repeat',
  },
  {
    week: 3,
    rounds: 3,
    instruction: 'Add a third round. Sessions feel longer; rest a bit more if needed.',
    progressionLever: '+1 round',
  },
  {
    week: 4,
    rounds: 3,
    instruction: 'Add 2 reps to each exercise (e.g. squats 10 to 12).',
    progressionLever: '+reps',
  },
  {
    week: 5,
    rounds: 3,
    instruction: 'Add 2 more reps. If it feels easy, slow the tempo: 3s down, 1s up.',
    progressionLever: '+reps / tempo',
  },
  {
    week: 6,
    rounds: 3,
    instruction: 'Upgrade ONE exercise to a harder version (wall to countertop push-ups).',
    progressionLever: 'Variation swap',
  },
  {
    week: 7,
    rounds: 3,
    instruction: 'Upgrade a second exercise. Keep the rest the same.',
    progressionLever: 'Variation swap',
  },
  {
    week: 8,
    rounds: 3,
    instruction: 'Full reps + harder variations. If tired, repeat Week 6 instead — recovery is progress.',
    progressionLever: 'Consolidate / deload',
  },
]

export const FOUNDATION_WEEKS = progression.length // 8

/**
 * Returns the plan for any week. Weeks 1–8 follow the foundation table; beyond
 * that, training continues at Week-8 intensity (the "maintaining" phase).
 */
export function getProgressionWeek(week: number): ProgressionWeek {
  if (week <= FOUNDATION_WEEKS) {
    return progression[Math.max(week, 1) - 1]
  }
  return {
    week,
    rounds: 3,
    instruction:
      "You've built the habit — keep going strong. Repeat your favourite sessions, and add reps or slow the tempo whenever you feel ready.",
    progressionLever: 'Maintain',
  }
}
