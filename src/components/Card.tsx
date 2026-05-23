import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-3xl bg-white p-4 shadow-sm shadow-black/5', className)} {...rest}>
      {children}
    </div>
  )
}
