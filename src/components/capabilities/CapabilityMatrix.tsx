'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { capabilities, capabilityGroups, capabilityLegend } from '@/content'
import type { CapabilityGroup } from '@/content/schema'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/cn'

type Filter = 'All' | CapabilityGroup

const FILTERS: readonly Filter[] = ['All', ...capabilityGroups]

/**
 * Selecting a filter moves the matching capabilities to the front of the grid
 * and dims the rest rather than removing them, so the breadth stays on screen
 * while the answer to the filter sits at the top.
 */
export function CapabilityMatrix() {
  const [filter, setFilter] = useState<Filter>('All')
  const reduced = useReducedMotion()

  const ordered = useMemo(() => {
    if (filter === 'All') return capabilities.map((item) => ({ item, matched: true }))
    const matched = capabilities.filter((item) => item.group === filter)
    const rest = capabilities.filter((item) => item.group !== filter)
    return [
      ...matched.map((item) => ({ item, matched: true })),
      ...rest.map((item) => ({ item, matched: false })),
    ]
  }, [filter])

  const count = filter === 'All' ? capabilities.length : ordered.filter((row) => row.matched).length

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter capabilities">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              'mono inline-flex h-11 items-center rounded-full border px-4 text-[0.6875rem] tracking-[0.08em] uppercase transition-colors',
              filter === option
                ? 'border-accent text-ink bg-accent-soft'
                : 'border-edge-control text-ink-3 hover:text-ink hover:border-edge-strong',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-6" role="status" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={filter}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.24 }}
            className="mono text-ink-3 text-[0.75rem]"
          >
            {count} {count === 1 ? 'capability' : 'capabilities'}
            {filter === 'All' ? ' across seven groups' : ` in ${filter}`}
          </m.p>
        </AnimatePresence>
      </div>

      <ul className="mt-6 flex flex-wrap gap-2">
        {ordered.map(({ item, matched }) => (
          <m.li
            key={`${item.group}-${item.name}`}
            layout={!reduced}
            layoutId={`${item.group}-${item.name}`}
            transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.7 }}
            className={cn(
              'mono inline-flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[0.75rem] transition-colors duration-300',
              matched
                ? 'border-edge bg-raised text-ink'
                : 'border-edge/60 text-ink-3 border-dashed bg-transparent',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-2 rounded-[1px]',
                item.depth === 'daily'
                  ? matched
                    ? 'bg-accent'
                    : 'bg-[var(--ink-3)]'
                  : matched
                    ? 'border-accent border bg-[linear-gradient(to_right,var(--accent)_50%,transparent_50%)]'
                    : 'border border-[var(--ink-3)] bg-[linear-gradient(to_right,var(--ink-3)_50%,transparent_50%)]',
              )}
            />
            {item.name}
            <span className="sr-only">
              {item.depth === 'daily' ? ', daily production use' : ', working proficiency'}
            </span>
          </m.li>
        ))}
      </ul>

      <p className="mono text-ink-3 mt-6 text-[0.75rem]">{capabilityLegend}</p>
    </div>
  )
}
