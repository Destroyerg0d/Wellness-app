// ---------- CONTENT (bundled, read-only) ----------

export type ExerciseCategory = 'warmup' | 'strength' | 'cooldown' | 'yoga' | 'cardio'

export interface Exercise {
  id: string
  name: string
  category: ExerciseCategory
  imageFile: string
  targetReps?: string
  durationSeconds?: number
  easierVariation: string
  formCues: string
  muscles?: string
}

export type WorkoutType = 'strength' | 'yoga' | 'cardio-circuit' | 'rest'
export type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface WorkoutDay {
  id: string
  dayLabel: string
  weekday: Weekday
  focus: string
  type: WorkoutType
  warmupIds: string[]
  mainIds: string[]
  cooldownIds: string[]
  whyItWorks: string
  estMinutes: number
  note?: string
  // Optional levers used by the session builder:
  leadInIds?: string[] // done once before the rounded circuit (e.g. the Day-4 walk)
  roundsOverride?: number // fixed rounds for non-strength days (ignores weekly progression)
  mainTimedSeconds?: number // if set, main moves are timed (Day-4 circuit = 30s) instead of reps
}

export interface ProgressionWeek {
  week: number
  rounds: number
  instruction: string
  progressionLever: string
}

export type Season = 'summer' | 'monsoon' | 'autumn' | 'winter'
export type MealSlot = 'breakfast' | 'midMorning' | 'lunch' | 'eveningSnack' | 'dinner'

export interface MealOption {
  id: string
  title: string
  description: string
  prepMinutes: number
  approxCalories: number
  approxProtein: number
  nutrients: string
  hasEggOption: boolean
  eggNote?: string
  vegSwaps?: string[]
  isLazyPick?: boolean
}

export interface SeasonalDiet {
  season: Season
  intro: string
  hydrationNote: string
  meals: Record<MealSlot, MealOption[]>
  bedtimeNote?: string
}

export interface NutrientTarget {
  nutrient: string
  target: string
}

// ---------- USER STATE (saved to localStorage) ----------

export interface CompletedSession {
  date: string // 'YYYY-MM-DD'
  dayId: string
  completedExerciseIds: string[]
}

export interface UserState {
  schemaVersion: number
  userName: string
  startDate: string // 'YYYY-MM-DD' — drives week calculation
  seasonOverride: Season | 'auto'
  waterGoalGlasses: number
  waterLog: Record<string, number> // date -> glasses
  walkLog: Record<string, boolean> // date -> optional walk logged (rest days)
  mealLog: Record<string, string[]> // date -> logged meal ids (intake tracking)
  completedSessions: CompletedSession[]
  favoriteMealIds: string[]
  customMeals: MealOption[] // meals the user added themselves
  onboardingComplete: boolean
  soundEnabled: boolean
  updatedAt: string // ISO timestamp — drives last-write-wins cloud sync
}
