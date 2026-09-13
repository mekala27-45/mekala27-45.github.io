'use client'

import { useRef, useState } from 'react'
import { MetricCell } from './MetricCell'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import type { Metric } from '@/content/schema'
import { cn } from '@/lib/cn'

type MetricStripProps = {
  metrics: readonly Metric[]
  /** True for the hero, which is on screen before any observer can fire. */
  startOnMount?: boolean
  className?: string
}

export function MetricStrip({ metrics, startOnMount = false, className }: MetricStripProps) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInViewOnce(ref, '0px 0px -10% 0px')
  const [mounted, setMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (startOnMount) setMounted(true)
  }, [startOnMount])

  const active = mounted || seen

  return (
    <div
      ref={ref}
      className={cn(
        'border-edge grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4 md:gap-x-0',
        className,
      )}
    >
      {metrics.map((metric, index) => (
        <MetricCell
          key={metric.label}
          metric={metric}
          active={active}
          className={cn(
            'md:px-6',
            index % 2 === 1 && 'border-edge border-l pl-6',
            index > 0 && 'md:border-edge md:border-l md:pl-6',
            index === 0 && 'md:pl-0',
          )}
        />
      ))}
    </div>
  )
}
