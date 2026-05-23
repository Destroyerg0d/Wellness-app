import { NavLink } from 'react-router-dom'
import { Apple, CalendarDays, Dumbbell, Flame, Settings } from 'lucide-react'
import { cn } from '../lib/cn'

const items = [
  { to: '/', label: 'Today', icon: CalendarDays, end: true },
  { to: '/workout', label: 'Workout', icon: Dumbbell, end: false },
  { to: '/food', label: 'Food', icon: Apple, end: false },
  { to: '/progress', label: 'Progress', icon: Flame, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[26rem] -translate-x-1/2 border-t border-sand-200 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-colors',
                  isActive ? 'text-coral-600' : 'text-ink-soft/70',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-6 w-6', isActive && 'fill-coral-100')} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
