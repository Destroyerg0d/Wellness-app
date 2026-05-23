import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Target } from 'lucide-react'
import type { ExerciseCategory } from '../types'
import { getExercise } from '../data/exercises'
import { ExerciseImage } from '../components/ExerciseImage'
import { Button } from '../components/Button'
import { prescription } from '../lib/format'

const categoryLabel: Record<ExerciseCategory, string> = {
  warmup: 'Warm-up',
  strength: 'Strength',
  cooldown: 'Cool-down',
  yoga: 'Yoga',
  cardio: 'Cardio',
}

export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const exercise = id ? getExercise(id) : undefined

  if (!exercise) {
    return (
      <div className="space-y-4 pt-2 text-center">
        <p className="text-ink-soft">We couldn't find that exercise.</p>
        <Button onClick={() => navigate('/library')}>Back to library</Button>
      </div>
    )
  }

  const label = prescription(exercise.targetReps, exercise.durationSeconds)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-ink" />
        </button>
        <span className="rounded-full bg-coral-100 px-3 py-1 text-sm font-semibold text-coral-700">
          {categoryLabel[exercise.category]}
        </span>
      </div>

      <ExerciseImage exercise={exercise} variant="full" className="aspect-[4/3] w-full rounded-3xl" />

      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{exercise.name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {label && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 font-semibold text-ink">
              <Target className="h-3.5 w-3.5 text-coral-500" /> {label}
            </span>
          )}
          {exercise.muscles && (
            <span className="rounded-full bg-sand px-3 py-1 font-semibold text-ink-soft">{exercise.muscles}</span>
          )}
        </div>
      </div>

      <section className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
        <h2 className="mb-1.5 font-display font-bold text-ink">How to do it</h2>
        <p className="leading-relaxed text-ink-soft">{exercise.formCues}</p>
      </section>

      <section className="rounded-3xl bg-coral-50 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-coral-500" strokeWidth={2} />
          <h2 className="font-display font-bold text-coral-700">New to this? Start here</h2>
        </div>
        <p className="leading-relaxed text-ink">{exercise.easierVariation}</p>
      </section>
    </div>
  )
}
