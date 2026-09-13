'use client'

import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Returns false on the server and on the first client render so markup
 * matches, then settles to the real preference. Every motion path in the
 * site reads this rather than checking the media query inline.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const update = () => setReduced(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return reduced
}
