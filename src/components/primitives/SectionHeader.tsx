import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type SectionHeaderProps = {
  /** Two digit section number, as it appears in the mono label. */
  index: string
  /** Uppercase mono label text that follows the number. */
  label: string
  /** The visible heading. */
  heading: string
  headingId: string
  lede?: ReactNode
  className?: string
}

export function SectionHeader({
  index,
  label,
  heading,
  headingId,
  lede,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-12 md:mb-16', className)}>
      <p className="label mb-5">
        {index} / {label}
      </p>
      <h2 id={headingId} className="text-section max-w-[20ch]">
        {heading}
      </h2>
      {lede ? <div className="text-lede text-ink-2 mt-6 max-w-[62ch]">{lede}</div> : null}
    </header>
  )
}
