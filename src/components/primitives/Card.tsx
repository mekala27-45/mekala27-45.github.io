import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardProps = {
  children: ReactNode
  className?: string
  /** Cards size their own internals from their width, not from the page. */
  container?: boolean
}

export function Card({ children, className, container = true }: CardProps) {
  return (
    <div className={cn('lit rounded-[var(--radius-card)]', container && '@container', className)}>
      {children}
    </div>
  )
}
