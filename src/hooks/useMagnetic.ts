'use client'

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'motion/react'
import { useReducedMotion } from './useReducedMotion'

type Magnetic = {
  ref: (node: HTMLElement | null) => void
  x: MotionValue<number>
  y: MotionValue<number>
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

const SPRING = { stiffness: 180, damping: 26, mass: 1 }

/**
 * Pulls an element up to `distance` pixels toward the pointer, on a spring.
 * Disabled for coarse pointers and under reduced motion, so a phone never
 * pays for it.
 */
export function useMagnetic(distance = 6): Magnetic {
  const reduced = useReducedMotion()
  const node = useRef<HTMLElement | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING)
  const y = useSpring(rawY, SPRING)

  const ref = useCallback((element: HTMLElement | null) => {
    node.current = element
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduced || event.pointerType !== 'mouse' || !node.current) return
      const rect = node.current.getBoundingClientRect()
      const offsetX = event.clientX - (rect.left + rect.width / 2)
      const offsetY = event.clientY - (rect.top + rect.height / 2)
      rawX.set(Math.max(-distance, Math.min(distance, (offsetX / rect.width) * distance * 2)))
      rawY.set(Math.max(-distance, Math.min(distance, (offsetY / rect.height) * distance * 2)))
    },
    [distance, rawX, rawY, reduced],
  )

  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { ref, x, y, onPointerMove, onPointerLeave }
}
