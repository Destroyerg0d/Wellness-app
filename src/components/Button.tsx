import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'sage'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-coral-500 text-white shadow-sm shadow-coral-200 hover:bg-coral-600 active:bg-coral-600',
  secondary: 'bg-white text-coral-600 border border-coral-200 hover:bg-coral-50',
  soft: 'bg-coral-100 text-coral-700 hover:bg-coral-200',
  ghost: 'text-ink-soft hover:bg-sand',
  sage: 'bg-sage-500 text-white shadow-sm shadow-sage-100 hover:bg-sage-600',
}

const sizes: Record<Size, string> = {
  sm: 'min-h-9 gap-1.5 rounded-xl px-3 text-sm',
  md: 'min-h-11 gap-2 rounded-2xl px-5 text-base',
  lg: 'min-h-14 gap-2.5 rounded-2xl px-6 text-lg',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', fullWidth, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center font-display font-semibold transition-[transform,background-color] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
