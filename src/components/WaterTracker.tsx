import { Droplet, Minus, Plus } from 'lucide-react'
import { useStore } from '../lib/store'
import { todayKey } from '../lib/dateUtils'
import { cn } from '../lib/cn'

interface WaterTrackerProps {
  compact?: boolean
}

export function WaterTracker({ compact = false }: WaterTrackerProps) {
  const { state, setWater, addWater } = useStore()
  const today = todayKey()
  const goal = state.waterGoalGlasses
  const count = state.waterLog[today] ?? 0
  const done = count >= goal

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-aqua-500" strokeWidth={2} />
          <h3 className="font-display font-bold text-ink">Water</h3>
          <span className="text-sm text-ink-soft">
            {count} / {goal} glasses
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => addWater(-1)}
            disabled={count === 0}
            aria-label="Remove a glass"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-aqua-50 text-aqua-600 transition active:scale-95 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => addWater(1)}
            aria-label="Add a glass"
            className="flex h-9 items-center gap-1 rounded-full bg-aqua-500 px-3 text-sm font-semibold text-white transition active:scale-95"
          >
            <Plus className="h-4 w-4" /> Glass
          </button>
        </div>
      </div>

      <div className={cn('grid grid-cols-6 gap-1.5', !compact && 'gap-2')}>
        {Array.from({ length: goal }).map((_, i) => {
          const filled = i < count
          return (
            <button
              key={i}
              type="button"
              onClick={() => setWater(count === i + 1 ? i : i + 1)}
              aria-label={`Set water to ${i + 1} ${i === 0 ? 'glass' : 'glasses'}`}
              className={cn(
                'flex aspect-square items-center justify-center rounded-xl transition active:scale-90',
                filled ? 'bg-aqua-100' : 'bg-sand/60',
              )}
            >
              <Droplet
                className={cn('h-5 w-5 transition-colors', filled ? 'fill-aqua-400 text-aqua-500' : 'text-aqua-300/60')}
                strokeWidth={1.8}
              />
            </button>
          )
        })}
      </div>

      {done && <p className="mt-3 text-sm font-semibold text-aqua-600">Hydration done for today — lovely.</p>}
    </div>
  )
}
