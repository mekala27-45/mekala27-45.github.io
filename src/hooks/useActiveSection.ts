'use client'

import { useEffect, useState } from 'react'

/**
 * Watches the section headings and reports which one owns the viewport,
 * which is what drives the shared indicator in the nav.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)

    if (nodes.length === 0) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let best: string | null = null
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        setActive(best)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [ids])

  return active
}
