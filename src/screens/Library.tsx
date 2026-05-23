import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { ExerciseCategory } from '../types'
import { exercises } from '../data/exercises'
import { ExerciseImage } from '../components/ExerciseImage'
import { prescription } from '../lib/format'

const order: { category: ExerciseCategory; label: string }[] = [
  { category: 'warmup', label: 'Warm-up' },
  { category: 'strength', label: 'Strength' },
  { category: 'yoga', label: 'Yoga + Mobility' },
  { category: 'cardio', label: 'Cardio' },
  { category: 'cooldown', label: 'Cool-down' },
]

export default function Library() {
  const navigate = useNavigate()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm shadow-black/5 transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-ink" />
        </button>
        <h1 className="font-display text-2xl font-bold text-ink">Exercise Library</h1>
      </div>

      {order.map(({ category, label }) => {
        const items = exercises.filter((e) => e.category === category)
        if (items.length === 0) return null
        return (
          <section key={category}>
            <h2 className="mb-2 px-1 font-display font-bold text-ink">{label}</h2>
            <div className="grid grid-cols-2 gap-3">
              {items.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => navigate(`/exercise/${ex.id}`)}
                  className="overflow-hidden rounded-2xl bg-white text-left shadow-sm shadow-black/5 transition active:scale-[0.98]"
                >
                  <ExerciseImage exercise={ex} variant="thumb" className="aspect-square w-full" />
                  <div className="p-2.5">
                    <p className="truncate font-display text-sm font-semibold text-ink">{ex.name}</p>
                    <p className="truncate text-xs text-ink-soft">{prescription(ex.targetReps, ex.durationSeconds)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
