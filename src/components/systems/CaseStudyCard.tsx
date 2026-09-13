'use client'

import { ArrowRight } from 'lucide-react'
import type { CaseStudyCardData } from '@/content'
import { useSpotlight } from '@/hooks/useSpotlight'
import { track } from '@/lib/analytics'
import { TransitionLink } from '@/components/system/TransitionLink'

type CaseStudyCardProps = {
  study: CaseStudyCardData
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  const spotlight = useSpotlight()

  return (
    <TransitionLink
      href={`/work/${study.slug}`}
      morphId={study.slug}
      onNavigate={() => track('case_study_open', { slug: study.slug })}
      className="spotlight lit @container group/card flex h-full flex-col gap-6 rounded-[var(--radius-card)] p-6 sm:p-8"
      aria-label={`${study.name} case study`}
    >
      <span
        ref={spotlight.ref}
        onPointerMove={spotlight.onPointerMove}
        onPointerLeave={spotlight.onPointerLeave}
        className="contents"
      />

      <div className="flex flex-col gap-3">
        <span className="label">{study.eyebrow}</span>
        <h3
          data-morph-title
          className="font-display text-ink text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.03em] @[24rem]:text-[1.75rem]"
        >
          {study.name}
        </h3>
        <p className="text-ink-2 text-[0.9375rem] leading-relaxed">{study.summary}</p>
      </div>

      <ul className="grid grid-cols-3 gap-x-4 gap-y-3">
        {study.metrics.map((metric) => (
          <li key={metric.label} className="flex flex-col gap-1">
            <span
              className={
                metric.tone === 'warm'
                  ? 'text-warm font-display text-[1.25rem] font-semibold tracking-[-0.02em] tabular-nums'
                  : 'text-accent font-display text-[1.25rem] font-semibold tracking-[-0.02em] tabular-nums'
              }
            >
              {metric.value}
            </span>
            <span className="label leading-[1.35]">{metric.label}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-auto flex flex-wrap gap-1.5">
        {study.tech.map((item) => (
          <li
            key={item}
            className="mono border-edge text-ink-3 rounded border px-1.5 py-0.5 text-[0.6875rem]"
          >
            {item}
          </li>
        ))}
      </ul>

      <span className="mono text-accent inline-flex items-center gap-2 text-[0.75rem] tracking-[0.08em] uppercase">
        Read the case study
        <ArrowRight
          aria-hidden
          size={14}
          className="transition-transform duration-150 group-hover/card:translate-x-1"
        />
      </span>
    </TransitionLink>
  )
}
