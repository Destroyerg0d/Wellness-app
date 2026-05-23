import type { ReactNode } from 'react'

interface ProgressRingProps {
  value: number // 0..1
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
}

export function ProgressRing({
  value,
  size = 64,
  stroke = 6,
  color = 'var(--color-coral-500)',
  track = 'var(--color-sand-200)',
  children,
}: ProgressRingProps) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(Math.max(value, 0), 1)
  const offset = circumference * (1 - clamped)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
