import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Heart, HeartHandshake } from 'lucide-react'
import { useStore } from '../lib/store'
import { todayKey } from '../lib/dateUtils'
import { Button } from '../components/Button'
import { cn } from '../lib/cn'

const TOTAL = 3

export default function Onboarding() {
  const { completeOnboarding } = useStore()
  const [step, setStep] = useState(0)
  const [startDate, setStartDate] = useState(todayKey())

  const next = () => setStep((s) => Math.min(s + 1, TOTAL - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const finish = () => completeOnboarding({ userName: 'Shreya', startDate })

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col bg-cream px-6 pb-10 pt-12">
      {/* progress dots */}
      <div className="mb-10 flex justify-center gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === step ? 'w-7 bg-coral-500' : 'w-2 bg-coral-200',
            )}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            {step === 0 && (
              <Step
                icon={<Heart className="h-9 w-9 fill-coral-200 text-coral-500" strokeWidth={1.8} />}
                title="Kya haal hai, Shreya!"
                body="I know exercise has never really been your thing — and honestly, that's exactly why I made this for you. No pressure, no guilt. Just ten tiny minutes whenever you feel like it. Main yahin hoon, har step pe tere saath."
              />
            )}
            {step === 1 && (
              <Step
                icon={<CalendarDays className="h-9 w-9 text-coral-500" strokeWidth={1.8} />}
                title="When did you start?"
                body="This sets your Week 1. Today is perfect — but if you began earlier, pick that day. You can change it anytime in Settings."
              >
                <label className="mt-2 block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink-soft">Start date</span>
                  <input
                    type="date"
                    value={startDate}
                    max={todayKey()}
                    onChange={(e) => setStartDate(e.target.value || todayKey())}
                    className="w-full rounded-2xl border border-sand-200 bg-white px-4 py-3.5 font-display text-lg text-ink outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
                  />
                </label>
              </Step>
            )}
            {step === 2 && (
              <Step
                icon={<HeartHandshake className="h-9 w-9 text-coral-500" strokeWidth={1.8} />}
                title="Start tiny, stay kind"
                body="Four short workouts a week, about 30 minutes each. We'll guide every single step — warm-up, moves, and cool-down. The only goal at first is to show up."
              >
                <div className="mt-4 rounded-2xl bg-sand/60 p-4 text-sm leading-relaxed text-ink-soft">
                  This app is a personal wellness companion based on a researched plan — not medical
                  advice. Please check with a doctor before starting a new exercise or diet routine.
                </div>
              </Step>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <Button variant="ghost" size="lg" onClick={back}>
            Back
          </Button>
        )}
        {step < TOTAL - 1 ? (
          <Button size="lg" fullWidth onClick={next}>
            Next
          </Button>
        ) : (
          <Button size="lg" fullWidth onClick={finish}>
            Let's go
          </Button>
        )}
      </div>
    </div>
  )
}

function Step({
  icon,
  title,
  body,
  children,
}: {
  icon: React.ReactNode
  title: string
  body: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-coral-100">{icon}</div>
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">{body}</p>
      {children}
    </div>
  )
}
