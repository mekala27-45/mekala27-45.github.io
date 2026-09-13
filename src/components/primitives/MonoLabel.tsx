import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type MonoLabelProps = {
  children: ReactNode
  className?: string
}

export function MonoLabel({ children, className }: MonoLabelProps) {
  return <span className={cn('label', className)}>{children}</span>
}
