'use client'

import { useScroll, useSpring, type MotionValue } from 'motion/react'

/**
 * Document scroll progress, 0 to 1, smoothed just enough that the nav bar
 * does not jitter on a trackpad. Backed by Motion's scroll observer rather
 * than a raw scroll listener.
 */
export function useScrollProgress(): MotionValue<number> {
  const { scrollYProgress } = useScroll()
  return useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })
}
