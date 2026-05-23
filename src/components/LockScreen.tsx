import { useState } from 'react'
import type { FormEvent } from 'react'
import { Lock } from 'lucide-react'
import { Button } from './Button'
import { BirthdayCountdown } from './BirthdayCountdown'

const CODES = ['22/10', '2210']

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (CODES.includes(value.trim())) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[26rem] flex-col justify-center bg-cream px-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-coral-100">
          <Lock className="h-9 w-9 text-coral-500" strokeWidth={1.8} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Shreya's Wellness</h1>
        <p className="mt-2 text-ink-soft">This little space is just for you. Enter your code to open it.</p>
      </div>

      <form onSubmit={submit} className="mt-7">
        <input
          type="text"
          inputMode="numeric"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Your code"
          aria-label="Passcode"
          className="w-full rounded-2xl border border-sand-200 bg-white px-4 py-4 text-center font-display text-2xl tracking-widest text-ink outline-none focus:border-coral-300 focus:ring-2 focus:ring-coral-100"
        />
        {error && <p className="mt-2 text-center text-sm text-red-500">That's not it — try again.</p>}
        <Button type="submit" size="lg" fullWidth className="mt-4">
          Unlock
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-soft/60">Hint: a date that's all about you.</p>

      <div className="mt-8">
        <BirthdayCountdown />
      </div>
    </div>
  )
}
