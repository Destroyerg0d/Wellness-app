import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import type { Season } from '../types'
import { useStore } from '../lib/store'
import { currentWeek } from '../lib/scheduleUtils'
import { formatNice, todayKey } from '../lib/dateUtils'
import { disablePush, enablePush, isPushEnabled, pushConfigured, pushSupported } from '../lib/push'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { cn } from '../lib/cn'

const seasonOptions: { value: Season | 'auto'; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'summer', label: 'Summer' },
  { value: 'monsoon', label: 'Monsoon' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
]

export default function Settings() {
  const { state, updateSettings, resetAll } = useStore()
  const [pendingDate, setPendingDate] = useState<string | null>(null)
  const [showReset, setShowReset] = useState(false)
  const [pushOn, setPushOn] = useState(false)
  const week = currentWeek(state.startDate, todayKey())

  useEffect(() => {
    isPushEnabled().then(setPushOn)
  }, [])

  const togglePush = async () => {
    if (pushOn) {
      await disablePush()
      setPushOn(false)
    } else {
      setPushOn(await enablePush())
    }
  }

  const setGoal = (delta: number) =>
    updateSettings({ waterGoalGlasses: Math.min(20, Math.max(4, state.waterGoalGlasses + delta)) })

  return (
    <div className="space-y-5 pb-4">
      <h1 className="font-display text-2xl font-bold text-ink">Settings</h1>

      {/* Name */}
      <section>
        <SectionTitle>Your space</SectionTitle>
        <div className="rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-soft">Name</span>
            <input
              type="text"
              value={state.userName}
              onChange={(e) => updateSettings({ userName: e.target.value })}
              placeholder="Shreya"
              className="w-full rounded-2xl border border-sand-200 bg-cream px-4 py-3 font-display text-lg text-ink outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
            />
          </label>
        </div>
      </section>

      {/* Plan */}
      <section>
        <SectionTitle>Your plan</SectionTitle>
        <div className="space-y-px overflow-hidden rounded-3xl bg-white shadow-sm shadow-black/5">
          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-display font-semibold text-ink">Start date</p>
              <p className="text-sm text-ink-soft">Currently Week {week}{week > 8 ? ' · maintaining' : ' of 8'}</p>
            </div>
            <input
              type="date"
              value={state.startDate}
              max={todayKey()}
              onChange={(e) => e.target.value && setPendingDate(e.target.value)}
              className="rounded-xl border border-sand-200 bg-cream px-3 py-2 text-ink outline-none focus:border-coral-300"
            />
          </div>
          <div className="border-t border-sand-200 p-4">
            <p className="mb-2 font-display font-semibold text-ink">Season</p>
            <div className="flex flex-wrap gap-2">
              {seasonOptions.map((o) => {
                const active = state.seasonOverride === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => updateSettings({ seasonOverride: o.value })}
                    className={cn(
                      'rounded-full px-3.5 py-2 text-sm font-semibold transition active:scale-95',
                      active ? 'bg-coral-500 text-white' : 'bg-sand text-ink-soft',
                    )}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Water goal */}
      <section>
        <SectionTitle>Water</SectionTitle>
        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
          <div>
            <p className="font-display font-semibold text-ink">Daily goal</p>
            <p className="text-sm text-ink-soft">{state.waterGoalGlasses} glasses (~{(state.waterGoalGlasses * 0.25).toFixed(1).replace(/\.0$/, '')} L)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGoal(-1)}
              aria-label="Decrease water goal"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-50 text-aqua-600 transition active:scale-95"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="w-6 text-center font-display text-xl font-bold text-ink">{state.waterGoalGlasses}</span>
            <button
              type="button"
              onClick={() => setGoal(1)}
              aria-label="Increase water goal"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-500 text-white transition active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Sound */}
      <section>
        <SectionTitle>Timers</SectionTitle>
        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
          <div className="pr-3">
            <p className="font-display font-semibold text-ink">Sound &amp; vibration</p>
            <p className="text-sm text-ink-soft">A gentle cue when a timer ends</p>
          </div>
          <Toggle checked={state.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} label="Sound and vibration" />
        </div>
      </section>

      {/* Reminders */}
      {pushSupported && (
        <section>
          <SectionTitle>Reminders</SectionTitle>
          <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm shadow-black/5">
            <div className="pr-3">
              <p className="font-display font-semibold text-ink">Workout reminders</p>
              <p className="text-sm text-ink-soft">
                {pushConfigured ? 'A gentle daily nudge + birthday wishes' : 'Connect the backend to turn these on'}
              </p>
            </div>
            {pushConfigured ? (
              <Toggle checked={pushOn} onChange={() => void togglePush()} label="Workout reminders" />
            ) : (
              <span className="shrink-0 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink-soft">
                Setup needed
              </span>
            )}
          </div>
        </section>
      )}

      {/* Reset */}
      <button
        type="button"
        onClick={() => setShowReset(true)}
        className="w-full rounded-3xl bg-white p-4 text-center font-display font-semibold text-red-500 shadow-sm shadow-black/5 transition active:scale-[0.99]"
      >
        Reset all data
      </button>

      {/* About */}
      <section>
        <SectionTitle>About</SectionTitle>
        <div className="space-y-3 rounded-3xl bg-white p-4 text-sm leading-relaxed text-ink-soft shadow-sm shadow-black/5">
          <p>
            Shreya's Wellness is a personal companion built from a researched 4-day workout plan and a
            seasonal Indian diet plan. Made with love.
          </p>
          <p className="rounded-2xl bg-sand/60 p-3 text-ink">
            <span className="font-semibold">A gentle note:</span> This app is a wellness companion, not
            medical advice. Please check with a doctor before starting a new exercise or diet routine,
            especially with PCOS.
          </p>
          <p className="text-xs text-ink-soft/70">
            Exercise demonstration images from free-exercise-db (public domain).
          </p>
        </div>
      </section>

      <ConfirmDialog
        open={pendingDate !== null}
        title="Change start date?"
        message={
          pendingDate
            ? `Set your start to ${formatNice(pendingDate)}? This recalculates your current week and progression.`
            : ''
        }
        confirmLabel="Change it"
        onConfirm={() => {
          if (pendingDate) updateSettings({ startDate: pendingDate })
          setPendingDate(null)
        }}
        onCancel={() => setPendingDate(null)}
      />
      <ConfirmDialog
        open={showReset}
        danger
        title="Reset everything?"
        message="This permanently clears your streak, history, water log, and favorites, and starts you fresh. This can't be undone."
        confirmLabel="Reset"
        onConfirm={() => {
          resetAll()
          setShowReset(false)
        }}
        onCancel={() => setShowReset(false)}
      />
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 px-1 font-display font-bold text-ink">{children}</h2>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-coral-500' : 'bg-sand-200')}
    >
      <span
        className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all',
          checked ? 'left-6' : 'left-1',
        )}
      />
    </button>
  )
}
