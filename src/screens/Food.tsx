import { useState } from 'react'
import { Check, ChevronDown, Clock, CloudRain, Egg, Heart, Leaf, Moon, Plus, Snowflake, Sparkles, Sun } from 'lucide-react'
import type { MealOption, Season } from '../types'
import type { IconType } from '../lib/dayUi'
import { useStore } from '../lib/store'
import { resolveSeason } from '../lib/scheduleUtils'
import { todayKey } from '../lib/dateUtils'
import {
  intakeGoals,
  mealSlots,
  mealsById,
  nutrientCoverageNotes,
  nutrientTargets,
  plateRule,
  seasonalDiets,
} from '../data/diet'
import { cn } from '../lib/cn'

const seasonMeta: Record<Season, { label: string; icon: IconType }> = {
  summer: { label: 'Summer', icon: Sun },
  monsoon: { label: 'Monsoon', icon: CloudRain },
  autumn: { label: 'Autumn', icon: Leaf },
  winter: { label: 'Winter', icon: Snowflake },
}
const seasonOrder: Season[] = ['summer', 'monsoon', 'autumn', 'winter']

export default function Food() {
  const { state, toggleFavorite, toggleMealLog } = useStore()
  const [viewSeason, setViewSeason] = useState<Season>(() => resolveSeason(state.seasonOverride))
  const [lazyOnly, setLazyOnly] = useState(false)
  const [favOnly, setFavOnly] = useState(false)
  const [showNutrients, setShowNutrients] = useState(false)

  const today = todayKey()
  const loggedIds = state.mealLog[today] ?? []
  const loggedMeals = loggedIds.map((id) => mealsById[id]).filter((m): m is MealOption => Boolean(m))
  const intakeCalories = loggedMeals.reduce((sum, m) => sum + m.approxCalories, 0)
  const intakeProtein = loggedMeals.reduce((sum, m) => sum + m.approxProtein, 0)

  const diet = seasonalDiets[viewSeason]
  const filt = (opts: MealOption[]) =>
    opts.filter(
      (o) => (!lazyOnly || o.isLazyPick) && (!favOnly || state.favoriteMealIds.includes(o.id)),
    )
  const anyVisible = mealSlots.some(({ slot }) => filt(diet.meals[slot]).length > 0)

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-ink">Food</h1>

      <IntakeCard calories={intakeCalories} protein={intakeProtein} count={loggedMeals.length} />

      {/* Season switcher */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {seasonOrder.map((s) => {
          const M = seasonMeta[s]
          const active = s === viewSeason
          return (
            <button
              key={s}
              type="button"
              onClick={() => setViewSeason(s)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-95',
                active ? 'bg-coral-500 text-white shadow-sm shadow-coral-200' : 'bg-white text-ink-soft shadow-sm shadow-black/5',
              )}
            >
              <M.icon className="h-4 w-4" strokeWidth={2} />
              {M.label}
            </button>
          )
        })}
      </div>

      {/* Season intro */}
      <div className="rounded-3xl bg-gradient-to-br from-coral-100 to-sand p-4">
        <p className="leading-relaxed text-ink">{diet.intro}</p>
      </div>

      {/* Hydration */}
      <div className="rounded-3xl bg-aqua-50 p-4">
        <h3 className="mb-1 font-display font-bold text-aqua-700">Staying hydrated</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{diet.hydrationNote}</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <FilterChip active={lazyOnly} onClick={() => setLazyOnly((v) => !v)} icon={Sparkles} label="Quick picks" />
        <FilterChip active={favOnly} onClick={() => setFavOnly((v) => !v)} icon={Heart} label="Favorites" />
      </div>

      {/* Meals */}
      {anyVisible ? (
        mealSlots.map(({ slot, label, time }) => {
          const opts = filt(diet.meals[slot])
          if (opts.length === 0) return null
          return (
            <section key={slot}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="font-display font-bold text-ink">{label}</h2>
                {time && <span className="text-xs text-ink-soft">{time}</span>}
              </div>
              <div className="space-y-3">
                {opts.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    fav={state.favoriteMealIds.includes(meal.id)}
                    onFav={() => toggleFavorite(meal.id)}
                    logged={loggedIds.includes(meal.id)}
                    onLog={() => toggleMealLog(meal.id)}
                  />
                ))}
              </div>
            </section>
          )
        })
      ) : (
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm shadow-black/5">
          <Heart className="mx-auto h-8 w-8 text-coral-300" />
          <p className="mt-2 font-display font-semibold text-ink">No meals here yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            {favOnly ? 'Tap the heart on meals you love to save them here.' : 'Try turning off a filter.'}
          </p>
        </div>
      )}

      {diet.bedtimeNote && (
        <div className="flex items-start gap-2 rounded-2xl bg-sand/60 p-4">
          <Moon className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" strokeWidth={1.8} />
          <p className="text-sm leading-relaxed text-ink-soft">{diet.bedtimeNote}</p>
        </div>
      )}

      {/* What my body needs */}
      <div className="rounded-3xl bg-white shadow-sm shadow-black/5">
        <button
          type="button"
          onClick={() => setShowNutrients((v) => !v)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <span className="font-display font-bold text-ink">What my body needs</span>
          <ChevronDown className={cn('h-5 w-5 text-ink-soft transition-transform', showNutrients && 'rotate-180')} />
        </button>
        {showNutrients && (
          <div className="space-y-4 px-4 pb-4">
            <p className="text-sm text-ink-soft">
              Daily targets — for information, not a checklist. You don't need to count anything.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {nutrientTargets.map((n) => (
                <div key={n.nutrient} className="flex justify-between border-b border-sand-200 pb-1 text-sm">
                  <span className="text-ink-soft">{n.nutrient}</span>
                  <span className="font-semibold text-ink">{n.target}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="mb-1 font-display font-semibold text-ink">The simple plate</h4>
              <ul className="space-y-1 text-sm text-ink-soft">
                {plateRule.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-coral-400">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-1 font-display font-semibold text-ink">Good to know</h4>
              <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                {nutrientCoverageNotes.map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-coral-400">•</span> {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: IconType
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-95',
        active ? 'bg-coral-500 text-white shadow-sm shadow-coral-200' : 'bg-white text-ink-soft shadow-sm shadow-black/5',
      )}
    >
      <Icon className={cn('h-4 w-4', active && label === 'Favorites' && 'fill-white')} strokeWidth={2} />
      {label}
    </button>
  )
}

function MealCard({
  meal,
  fav,
  onFav,
  logged,
  onLog,
}: {
  meal: MealOption
  fav: boolean
  onFav: () => void
  logged: boolean
  onLog: () => void
}) {
  const [showEgg, setShowEgg] = useState(false)
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display font-bold text-ink">{meal.title}</h3>
            {meal.isLazyPick && (
              <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-700">Quick pick</span>
            )}
          </div>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{meal.description}</p>
        </div>
        <button
          type="button"
          onClick={onFav}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={fav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
        >
          <Heart className={cn('h-5 w-5', fav ? 'fill-coral-500 text-coral-500' : 'text-ink-soft/40')} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="flex items-center gap-1 text-ink-soft">
          <Clock className="h-3.5 w-3.5" /> {meal.prepMinutes} min
        </span>
        <span className="font-semibold text-coral-600">~{meal.approxCalories} kcal</span>
        <span className="font-semibold text-coral-600">{meal.approxProtein}g protein</span>
      </div>
      <p className="mt-1 text-xs text-ink-soft/80">{meal.nutrients}</p>

      {meal.hasEggOption && (
        <>
          <button
            type="button"
            onClick={() => setShowEgg((v) => !v)}
            className="mt-3 flex items-center gap-1.5 rounded-full bg-coral-50 px-3 py-1.5 text-sm font-semibold text-coral-700"
          >
            <Egg className="h-4 w-4" /> Egg / veg options
            <ChevronDown className={cn('h-4 w-4 transition-transform', showEgg && 'rotate-180')} />
          </button>
          {showEgg && (
            <div className="mt-2 space-y-2 rounded-2xl bg-sand/50 p-3 text-sm">
              {meal.eggNote && (
                <p className="text-ink">
                  <span className="font-semibold text-coral-700">With egg:</span> {meal.eggNote}
                </p>
              )}
              {meal.vegSwaps && meal.vegSwaps.length > 0 && (
                <div>
                  <p className="font-semibold text-sage-700">Vegetarian instead:</p>
                  <ul className="mt-0.5 space-y-0.5 text-ink-soft">
                    {meal.vegSwaps.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="text-sage-500">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onLog}
        aria-pressed={logged}
        className={cn(
          'mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl py-2.5 text-sm font-semibold transition active:scale-[0.98]',
          logged ? 'bg-sage-500 text-white' : 'bg-coral-50 text-coral-700',
        )}
      >
        {logged ? (
          <>
            <Check className="h-4 w-4" /> Logged today
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Log to today
          </>
        )}
      </button>
    </div>
  )
}

function IntakeCard({ calories, protein, count }: { calories: number; protein: number; count: number }) {
  const message =
    count === 0
      ? "Tap 'Log to today' on a meal to start tracking your day."
      : protein < intakeGoals.protein * 0.6
        ? 'Going well — a protein-rich meal would help you reach your goal.'
        : calories >= intakeGoals.calories * 0.8 && protein >= intakeGoals.protein * 0.8
          ? 'Beautifully balanced today. Well done, Shreya!'
          : 'Nice — keep it going through the day.'
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display font-bold text-ink">Today's intake</h2>
        <span className="text-xs text-ink-soft">
          {count} meal{count === 1 ? '' : 's'} logged
        </span>
      </div>
      <NutrientBar label="Energy" value={calories} goal={intakeGoals.calories} unit="kcal" accent="bg-coral-500" />
      <NutrientBar label="Protein" value={protein} goal={intakeGoals.protein} unit="g" accent="bg-sage-500" />
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{message}</p>
    </div>
  )
}

function NutrientBar({
  label,
  value,
  goal,
  unit,
  accent,
}: {
  label: string
  value: number
  goal: number
  unit: string
  accent: string
}) {
  const pct = Math.min((value / goal) * 100, 100)
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-soft">
          {Math.round(value)} / {goal} {unit}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-sand-200">
        <div className={cn('h-full rounded-full transition-all duration-500', accent)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
