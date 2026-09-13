import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type RevealProps = {
  children: ReactNode
  /** Milliseconds of stagger against its siblings. Kept at or below 90. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'section'
}

/**
 * Ships visible. The hidden start state only applies once the head script
 * has added the `js` class, so a page without JavaScript reads in full.
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const Tag = as
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties
  return (
    <Tag data-reveal style={style} className={cn(className)}>
      {children}
    </Tag>
  )
}
