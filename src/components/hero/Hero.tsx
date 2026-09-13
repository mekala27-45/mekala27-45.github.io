import type { CSSProperties } from 'react'
import { hero, heroMetrics, identity } from '@/content'
import { MetricStrip } from '@/components/primitives/MetricStrip'
import { FieldBackdrop } from './FieldBackdrop'
import { HeroActions } from './HeroActions'
import { ScrollCue } from './ScrollCue'
import { StatusChip } from './StatusChip'

const [firstName = '', lastName = ''] = identity.name.split(' ')

export function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-end overflow-hidden pt-28 pb-20"
    >
      <FieldBackdrop opacity={0.3} pointer />

      <div className="shell-bleed relative flex flex-col gap-7">
        <StatusChip />

        <h1 id="hero-name" className="text-gutter-bleed text-hero font-semibold">
          <span className="line-mask" style={{ '--line-delay': '80ms' } as CSSProperties}>
            <span>{firstName}</span>
          </span>
          <span className="line-mask" style={{ '--line-delay': '170ms' } as CSSProperties}>
            <span>{lastName}</span>
          </span>
        </h1>

        <p className="mono text-ink-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] tracking-[0.12em] uppercase sm:text-sm">
          <span className="text-ink">{hero.roleLine}</span>
          <span aria-hidden className="bg-edge-strong hidden h-3 w-px sm:inline-block" />
          <span>{hero.roleDetail}</span>
        </p>

        <p className="text-ink-2 max-w-[52ch] text-[1.0625rem] leading-[1.55] sm:text-[1.25rem]">
          {hero.paragraph}
        </p>

        <HeroActions />
      </div>

      <div className="shell-bleed relative mt-12 mb-6 md:mt-16">
        <MetricStrip metrics={heroMetrics} startOnMount />
      </div>

      <ScrollCue />
    </section>
  )
}
