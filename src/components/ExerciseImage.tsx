import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { Dumbbell, Flower2, Footprints, Leaf, Sunrise } from 'lucide-react'
import type { Exercise, ExerciseCategory } from '../types'
import { cn } from '../lib/cn'

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>

const meta: Record<ExerciseCategory, { icon: IconType; grad: string; color: string }> = {
  warmup: { icon: Sunrise, grad: 'from-coral-100 to-coral-50', color: 'text-coral-500' },
  strength: { icon: Dumbbell, grad: 'from-coral-200 to-coral-100', color: 'text-coral-600' },
  cooldown: { icon: Leaf, grad: 'from-sage-100 to-sage-50', color: 'text-sage-600' },
  yoga: { icon: Flower2, grad: 'from-sage-100 to-aqua-50', color: 'text-sage-600' },
  cardio: { icon: Footprints, grad: 'from-aqua-100 to-aqua-50', color: 'text-aqua-600' },
}

interface ExerciseImageProps {
  exercise: Exercise
  variant?: 'thumb' | 'full'
  className?: string
}

/**
 * Shows the bundled demo photo when one exists; on any load error (offline-safe,
 * missing file) it swaps to an on-brand category illustration — never a broken image.
 */
export function ExerciseImage({ exercise, variant = 'full', className }: ExerciseImageProps) {
  const [failed, setFailed] = useState(false)
  // Reset when the image changes — this component is reused across steps in the session player.
  useEffect(() => setFailed(false), [exercise.imageFile])
  const m = meta[exercise.category]
  const Icon = m.icon
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', m.grad, className)}>
      {!failed ? (
        <img
          src={`/exercises/${exercise.imageFile}`}
          alt={exercise.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
          <Icon className={cn(variant === 'thumb' ? 'h-7 w-7' : 'h-12 w-12', m.color)} strokeWidth={1.6} />
          {variant === 'full' && (
            <>
              <span className="font-display text-base leading-tight font-semibold text-ink">{exercise.name}</span>
              <span className="text-[11px] uppercase tracking-wide text-ink-soft/70">illustrated guide</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
