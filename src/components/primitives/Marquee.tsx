import { cn } from '@/lib/cn'

type MarqueeProps = {
  items: readonly string[]
  durationSeconds?: number
  className?: string
}

/**
 * Two identical tracks translated by half the total width. CSS only, no
 * measuring, no JavaScript loop. Overflow is clipped and masked so nothing
 * can scroll horizontally on a phone.
 */
export function Marquee({ items, durationSeconds = 46, className }: MarqueeProps) {
  const track = (ariaHidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item) => (
        <li key={item} className="mono text-ink-3 text-[13px] tracking-[0.18em] whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={cn('marquee group relative overflow-hidden', className)}
      style={{ ['--marquee-duration' as string]: `${durationSeconds}s` }}
    >
      <div className="marquee-track flex w-max">
        {track(false)}
        {track(true)}
      </div>
    </div>
  )
}
