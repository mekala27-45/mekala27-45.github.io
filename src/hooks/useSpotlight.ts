'use client'

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'

type Spotlight = {
  ref: (node: HTMLElement | null) => void
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

/**
 * Writes the pointer position onto the element as two custom properties.
 * Throttled to one write per frame and applied with `style.setProperty`, so
 * it never triggers a React render.
 */
export function useSpotlight(): Spotlight {
  const node = useRef<HTMLElement | null>(null)
  const frame = useRef<number | null>(null)
  const next = useRef<{ x: number; y: number } | null>(null)

  const ref = useCallback((element: HTMLElement | null) => {
    node.current = element
  }, [])

  const flush = useCallback(() => {
    frame.current = null
    const element = node.current
    const point = next.current
    if (!element || !point) return
    element.style.setProperty('--spot-x', `${point.x}px`)
    element.style.setProperty('--spot-y', `${point.y}px`)
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const element = node.current
      if (!element || event.pointerType === 'touch') return
      const rect = element.getBoundingClientRect()
      next.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      if (frame.current === null) frame.current = requestAnimationFrame(flush)
    },
    [flush],
  )

  const onPointerLeave = useCallback(() => {
    const element = node.current
    if (!element) return
    element.style.removeProperty('--spot-x')
    element.style.removeProperty('--spot-y')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
