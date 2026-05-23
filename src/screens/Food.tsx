import { useState } from 'react'
import { Check, ChevronDown, CloudRain, Egg, Heart, Leaf, Moon, Plus, Snowflake, Sparkles, Sun, Trash2 } from 'lucide-react'
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
  const { state, toggleFavorite, toggleMealLog, addCustomMeal, removeCustomMeal } = useStore()
  const [viewSeason, setViewSeason] = useState<Season>(() => resolveSeason(state.seasonOverride))
  const [lazyOnly, setLazyOnly] = useState(false)
  const [favOnly, setFavOnly] = useState(false)
  const [showNutrients, setShowNutrients] = useState(false)

  const today = todayKey()
  const loggedIds = state.mealLog[today] ?? []
  const loggedMeals = loggedIds
    .map((id) => mealsById[id] ?? state.customMeals.find((m) => m.id === id))
    .filter((m): m is MealOption => Boolean(m))
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

      <MyMeals
        meals={state.customMeals}
        favoriteIds={state.favoriteMealIds}
        loggedIds={loggedIds}
        onAdd={addCustomMeal}
        onFav={toggleFavorite}
        onLog={toggleMealLog}
        onRemove={removeCustomMeal}
      />

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
  onDelete,
}: {
  meal: MealOption
  fav: boolean
  onFav: () => void
  logged: boolean
  onLog: () => void
  onDelete?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-display font-semibold text-ink">{meal.title}</span>
              {meal.isLazyPick && (
                <span className="shrink-0 rounded-full bg-sage-100 px-1.5 py-0.5 text-[10px] font-semibold text-sage-700">
                  Quick
                </span>
              )}
            </span>
            <span className="mt-0.5 block text-xs text-ink-soft">
              ~{meal.approxCalories} kcal · {meal.approxProtein}g protein
              {meal.prepMinutes ? ` · ${meal.prepMinutes} min` : ''}
            </span>
          </span>
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-ink-soft/50 transition-transform', expanded && 'rotate-180')}
          />
        </button>
        <button
          type="button"
          onClick={onFav}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={fav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90"
        >
          <Heart className={cn('h-5 w-5', fav ? 'fill-coral-500 text-coral-500' : 'text-ink-soft/40')} />
        </button>
        <button
          type="button"
          onClick={onLog}
          aria-label={logged ? 'Logged today' : 'Log to today'}
          aria-pressed={logged}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90',
            logged ? 'bg-sage-500 text-white' : 'bg-coral-50 text-coral-700',
          )}
        >
          {logged ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 border-t border-sand-200 pt-3">
          {meal.description && <p className="text-sm leading-relaxed text-ink-soft">{meal.description}</p>}
          {meal.nutrients && <p className="mt-1 text-xs text-ink-soft/80">{meal.nutrients}</p>}
          {meal.hasEggOption && (
            <div className="mt-2 space-y-2 rounded-2xl bg-sand/50 p-3 text-sm">
              <p className="flex items-center gap-1.5 font-semibold text-coral-700">
                <Egg className="h-4 w-4" /> Egg / veg options
              </p>
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
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-red-500"
            >
              <Trash2 className="h-4 w-4" /> Remove meal
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function MyMeals({
  meals,
  favoriteIds,
  loggedIds,
  onAdd,
  onFav,
  onLog,
  onRemove,
}: {
  meals: MealOption[]
  favoriteIds: string[]
  loggedIds: string[]
  onAdd: (title: string, calories: number, protein: number) => void
  onFav: (id: string) => void
  onLog: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [adding, setAdding] = useState(false)
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-display font-bold text-ink">My meals</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 rounded-full bg-coral-100 px-3 py-1.5 text-sm font-semibold text-coral-700"
        >
          <Plus className="h-4 w-4" /> Add a meal
        </button>
      </div>
      {adding && (
        <AddMealForm
          onAdd={(t, c, p) => {
            onAdd(t, c, p)
            setAdding(false)
          }}
          onCancel={() => setAdding(false)}
        />
      )}
      <div className="space-y-2">
        {meals.length === 0 && !adding && (
          <p className="px-1 text-sm text-ink-soft">Add a meal you eat often to log it in one tap.</p>
        )}
        {meals.map((m) => (
          <MealCard
            key={m.id}
            meal={m}
            fav={favoriteIds.includes(m.id)}
            onFav={() => onFav(m.id)}
            logged={loggedIds.includes(m.id)}
            onLog={() => onLog(m.id)}
            onDelete={() => onRemove(m.id)}
          />
        ))}
      </div>
    </section>
  )
}

function AddMealForm({
  onAdd,
  onCancel,
}: {
  onAdd: (title: string, calories: number, protein: number) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const valid = title.trim().length > 0 && Number(calories) > 0
  return (
    <div className="mb-2 space-y-2 rounded-2xl bg-white p-3 shadow-sm shadow-black/5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meal name (e.g. Dahi + fruit)"
        className="w-full rounded-xl border border-sand-200 bg-cream px-3 py-2.5 text-ink outline-none focus:border-coral-300"
      />
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="kcal"
          className="w-full rounded-xl border border-sand-200 bg-cream px-3 py-2.5 text-ink outline-none focus:border-coral-300"
        />
        <input
          type="number"
          inputMode="numeric"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          placeholder="protein (g)"
          className="w-full rounded-xl border border-sand-200 bg-cream px-3 py-2.5 text-ink outline-none focus:border-coral-300"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 flex-1 rounded-xl bg-sand font-display font-semibold text-ink"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!valid}
          onClick={() => onAdd(title, Number(calories), Number(protein) || 0)}
          className="min-h-10 flex-1 rounded-xl bg-coral-500 font-display font-semibold text-white disabled:opacity-50"
        >
          Add meal
        </button>
      </div>
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
