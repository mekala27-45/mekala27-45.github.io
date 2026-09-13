'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'
import { useReducedMotion } from './useReducedMotion'

type Options = {
  target: number
  decimals: number
  prefix: string
  suffix: string
  /** The value already rendered on the server, restored when the tick ends. */
  finalText: string
  durationMs?: number
  active: boolean
}

const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

/**
 * Counts to the target once, writing straight to the node rather than through
 * React state. A 1.4 second tick across four cells would otherwise be several
 * hundred renders during hydration, which is the most expensive moment on the
 * page. Under reduced motion the final value stands and nothing animates.
 */
export function useCountUp({
  target,
  decimals,
  prefix,
  suffix,
  finalText,
  durationMs = 1400,
  active,
}: Options) {
  const node = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const reduced = useReducedMotion()

  useIsomorphicLayoutEffect(() => {
    const element = node.current
    if (!element || !active || started.current || reduced) return
    started.current = true

    let frame = 0
    const start = performance.now()

    const format = (value: number) =>
      `${prefix}${value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`

    element.textContent = format(0)

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      element.textContent = progress < 1 ? format(target * easeOutQuart(progress)) : finalText
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, decimals, durationMs, finalText, prefix, reduced, suffix, target])

  return node
}
