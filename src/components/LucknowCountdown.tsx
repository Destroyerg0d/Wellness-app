import { MapPin } from 'lucide-react'
import { CountdownCard } from './CountdownCard'

// Elections wrap up on 28 Feb — then she's finally back in Lucknow.
const LUCKNOW_DAY = new Date(2027, 1, 28).getTime() // 28 Feb 2027

export function LucknowCountdown() {
  return (
    <CountdownCard
      Icon={MapPin}
      title="Coming to Lucknow"
      subtitle="till you're finally here"
      target={LUCKNOW_DAY}
      note="Elections khatam, phir seedha Lucknow. Main har din count kar raha hoon till I get to see you again."
      reached={{ title: "You're in Lucknow!", body: 'Finally. The whole city feels better with you in it.' }}
    />
  )
}
