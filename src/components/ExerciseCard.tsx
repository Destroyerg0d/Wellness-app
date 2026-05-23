import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Exercise } from '../types'
import { ExerciseImage } from './ExerciseImage'
import { prescription } from '../lib/format'
import { cn } from '../lib/cn'

interface ExerciseCardProps {
  exercise: Exercise
  onClick?: () => void
  /** Overrides the default reps/duration label (e.g. "30 sec" for the timed Day-4 circuit). */
  label?: string
  trailing?: ReactNode
  className?: string
}

export function ExerciseCard({ exercise, onClick, label, trailing, className }: ExerciseCardProps) {
  const text = label ?? prescription(exercise.targetReps, exercise.durationSeconds)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-sm shadow-black/5 transition active:scale-[0.99]',
        className,
      )}
    >
      <ExerciseImage exercise={exercise} variant="thumb" className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-ink">{exercise.name}</p>
        {text && <p className="text-sm text-ink-soft">{text}</p>}
      </div>
      {trailing ?? <ChevronRight className="h-5 w-5 shrink-0 text-ink-soft/50" />}
    </button>
  )
}
