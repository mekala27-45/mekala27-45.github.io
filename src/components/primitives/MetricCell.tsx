'use client'

import { useCountUp } from '@/hooks/useCountUp'
import type { Metric } from '@/content/schema'
import { cn } from '@/lib/cn'

type MetricCellProps = {
  metric: Metric
  active: boolean
  size?: 'lg' | 'md'
  className?: string
}

export function MetricCell({ metric, active, size = 'lg', className }: MetricCellProps) {
  const counter = useCountUp({
    target: metric.countTo ?? 0,
    decimals: metric.decimals,
    prefix: metric.prefix,
    suffix: metric.suffix,
    finalText: metric.value,
    active: active && metric.countTo !== null,
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span
        ref={counter}
        data-counter
        className={cn(
          'font-display leading-none font-semibold tracking-[-0.03em]',
          size === 'lg' ? 'text-[clamp(1.75rem,5vw,2.75rem)]' : 'text-[clamp(1.5rem,4vw,2.25rem)]',
          metric.tone === 'warm' ? 'text-warm' : 'text-ink',
        )}
      >
        {metric.value}
      </span>
      <span className="label leading-[1.4] normal-case">{metric.label}</span>
    </div>
  )
}
