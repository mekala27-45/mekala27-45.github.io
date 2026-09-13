'use client'

import { useEffect, useState, type RefObject } from 'react'

/** Fires once, then stops observing. Nothing on this site re-animates. */
export function useInViewOnce(
  ref: RefObject<Element | null>,
  rootMargin = '0px 0px -15% 0px',
): boolean {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return

    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, rootMargin, seen])

  return seen
}
