import { Gift } from 'lucide-react'
import { CountdownCard } from './CountdownCard'

const BIRTH_YEAR = 2005
const BIRTH_MONTH = 9 // October (0-indexed)
const BIRTH_DAY = 22

function nextBirthday(): { ts: number; age: number } {
  const now = new Date()
  const isToday = now.getMonth() === BIRTH_MONTH && now.getDate() === BIRTH_DAY
  let d = new Date(now.getFullYear(), BIRTH_MONTH, BIRTH_DAY)
  if (d.getTime() <= now.getTime() && !isToday) {
    d = new Date(now.getFullYear() + 1, BIRTH_MONTH, BIRTH_DAY)
  }
  return { ts: d.getTime(), age: d.getFullYear() - BIRTH_YEAR }
}

export function BirthdayCountdown() {
  const { ts, age } = nextBirthday()
  return (
    <CountdownCard
      Icon={Gift}
      title="Birthday countdown"
      subtitle={`Turning ${age} on 22 October`}
      target={ts}
      reached={{ title: 'Happy Birthday, Shreya!', body: `You're ${age} today. Here's to a strong, happy year.` }}
    />
  )
}
