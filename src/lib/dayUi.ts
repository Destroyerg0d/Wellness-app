import type { ComponentType } from 'react'
import { Dumbbell, Flower2, Footprints, Moon } from 'lucide-react'
import type { WorkoutType } from '../types'

export type IconType = ComponentType<{ className?: string; strokeWidth?: number }>

export const typeIcon: Record<WorkoutType, IconType> = {
  strength: Dumbbell,
  yoga: Flower2,
  'cardio-circuit': Footprints,
  rest: Moon,
}

export const typeLabel: Record<WorkoutType, string> = {
  strength: 'Strength',
  yoga: 'Yoga + Mobility',
  'cardio-circuit': 'Walk + Circuit',
  rest: 'Rest',
}
