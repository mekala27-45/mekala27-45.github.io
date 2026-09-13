'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { whenIdle } from '@/lib/when-idle'

/**
 * One observer for every reveal on the page. Each element is marked once and
 * then dropped from the observer, so nothing re-animates on the way back up.
 */
export function RevealEngine() {
  const pathname = usePathname()

  // The grain is decorative, so it waits until the page has painted.
  useEffect(
    () =>
      whenIdle(() => {
        document.documentElement.dataset.grain = 'on'
      }),
    [],
  )

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'),
    )
    if (nodes.length === 0) return

    if (typeof IntersectionObserver === 'undefined') {
      for (const node of nodes) node.dataset.revealed = 'true'
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = 'true'
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [pathname])

  return null
}
