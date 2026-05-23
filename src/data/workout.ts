import type { WorkoutDay, Weekday } from '../types'

const warmupIds = [
  'wu-march',
  'wu-arm-circles',
  'wu-cat-cow',
  'wu-shallow-squat',
  'wu-side-bends',
  'wu-hip-circles',
  'wu-shoulder-rolls',
  'wu-knee-hugs',
]

const cooldownIds = [
  'cd-forward-fold',
  'cd-quad-stretch',
  'cd-childs-pose',
  'cd-butterfly',
  'cd-knee-to-chest',
  'cd-shavasana',
]

export const workoutDays: WorkoutDay[] = [
  {
    id: 'day-1',
    dayLabel: 'Day 1 — Full-Body Strength A',
    weekday: 'Mon',
    focus: 'Lower Body + Core',
    type: 'strength',
    estMinutes: 30,
    warmupIds,
    mainIds: ['chair-squats', 'wall-pushups', 'glute-bridges', 'standing-marches', 'bird-dog', 'dead-bug'],
    cooldownIds,
    whyItWorks:
      "Chair squats and glute bridges work your body's biggest muscles. Wall push-ups build upper-body confidence with no intimidation. Bird-dog and dead bug build core stability and protect your lower back — no experience needed.",
  },
  {
    id: 'day-2',
    dayLabel: 'Day 2 — Full-Body Strength B',
    weekday: 'Wed',
    focus: 'Upper Body + Glutes',
    type: 'strength',
    estMinutes: 30,
    warmupIds,
    mainIds: ['incline-pushups', 'sit-to-stand', 'hip-hinge', 'reverse-lunges', 'knee-plank', 'wall-angels'],
    cooldownIds,
    whyItWorks:
      'This day balances Day 1 — more upper body and posture work. Wall angels fix the slouch from phone and laptop time. Reverse lunges build single-leg strength gently.',
  },
  {
    id: 'day-3',
    dayLabel: 'Day 3 — Yoga + Mobility',
    weekday: 'Fri',
    focus: 'Calm + Flexibility (PCOS-friendly)',
    type: 'yoga',
    estMinutes: 30,
    warmupIds: [],
    mainIds: [
      'yoga-sukhasana',
      'yoga-cat-cow',
      'yoga-childs-pose',
      'yoga-cobra',
      'yoga-downward-dog',
      'yoga-low-lunge',
      'yoga-malasana',
      'yoga-bridge',
      'yoga-reclining-butterfly',
      'yoga-spinal-twist',
      'yoga-shavasana',
    ],
    cooldownIds: [],
    roundsOverride: 1,
    whyItWorks:
      'This is the calm day — it lowers stress, improves flexibility, and is especially good for PCOS. Move slowly and breathe through your nose.',
    note: 'Repeat the whole sequence twice if you have time. During your period, skip or shorten the deep belly-compression poses (Cobra, Bridge) if you feel cramping.',
  },
  {
    id: 'day-4',
    dayLabel: 'Day 4 — Walk + Light Circuit',
    weekday: 'Sat',
    focus: 'Cardio + Full Body',
    type: 'cardio-circuit',
    estMinutes: 30,
    warmupIds: [],
    leadInIds: ['cardio-walk'],
    mainIds: ['chair-squats', 'wall-pushups', 'glute-bridges', 'standing-marches', 'bird-dog'],
    cooldownIds,
    roundsOverride: 2,
    mainTimedSeconds: 30,
    whyItWorks:
      "A brisk walk lifts your mood and warms you up, then a short, familiar circuit keeps your whole body strong. It's the most flexible day — do it indoors, on the terrace, or outside.",
    note: 'Structure: a 15-min brisk walk, then a 10-min mini circuit (2 rounds, 30s each move), then a 5-min cool-down. The walk replaces the warm-up.',
  },
]

export const restDays: WorkoutDay[] = [
  {
    id: 'rest-tue',
    dayLabel: 'Rest Day',
    weekday: 'Tue',
    focus: 'Recovery · optional 20-min walk',
    type: 'rest',
    estMinutes: 0,
    warmupIds: [],
    mainIds: [],
    cooldownIds: [],
    whyItWorks:
      "Rest is when your body actually gets stronger. A gentle 20-minute walk is welcome — but doing nothing is perfectly fine too.",
    note: 'Optional: a relaxed 20-minute walk if you feel like moving.',
  },
  {
    id: 'rest-thu',
    dayLabel: 'Rest Day',
    weekday: 'Thu',
    focus: 'Recovery · optional 20-min walk',
    type: 'rest',
    estMinutes: 0,
    warmupIds: [],
    mainIds: [],
    cooldownIds: [],
    whyItWorks:
      "Rest is when your body actually gets stronger. A gentle 20-minute walk is welcome — but doing nothing is perfectly fine too.",
    note: 'Optional: a relaxed 20-minute walk if you feel like moving.',
  },
  {
    id: 'rest-sun',
    dayLabel: 'Full Rest',
    weekday: 'Sun',
    focus: 'Full rest',
    type: 'rest',
    estMinutes: 0,
    warmupIds: [],
    mainIds: [],
    cooldownIds: [],
    whyItWorks: 'Full rest today. Recovery is part of the plan, not a break from it.',
    note: 'Take the day fully off. You earned it.',
  },
]

export const allDays: WorkoutDay[] = [...workoutDays, ...restDays]

export const weekdayOrder: Weekday[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const dayByWeekday: Record<Weekday, WorkoutDay> = allDays.reduce(
  (acc, d) => {
    acc[d.weekday] = d
    return acc
  },
  {} as Record<Weekday, WorkoutDay>,
)

export const dayById: Record<string, WorkoutDay> = allDays.reduce(
  (acc, d) => {
    acc[d.id] = d
    return acc
  },
  {} as Record<string, WorkoutDay>,
)
