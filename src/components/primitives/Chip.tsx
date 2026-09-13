import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipProps = {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent'
}

export function Chip({ children, className, tone = 'default' }: ChipProps) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center rounded-md border px-2 py-1 text-[0.6875rem] tracking-[0.06em] whitespace-nowrap',
        tone === 'accent'
          ? 'border-accent/40 text-accent bg-accent-soft'
          : 'border-edge text-ink-3',
        className,
      )}
    >
      {children}
    </span>
  )
}
