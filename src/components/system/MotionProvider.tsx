'use client'

import { LazyMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * The feature bundle carries the layout projection engine, which nothing needs
 * until someone scrolls or points at something. Holding it until the first
 * interaction keeps it out of the hydration window. Motion values bound to
 * style work from the core before it arrives, so the scroll progress bar is
 * live immediately.
 */
const loadFeatures = () =>
  new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }
    const events = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'] as const
    let done = false
    const go = () => {
      if (done) return
      done = true
      for (const event of events) window.removeEventListener(event, go)
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(go, 2000)
    for (const event of events) window.addEventListener(event, go, { once: true, passive: true })
  }).then(() => import('@/lib/motion-features').then((module) => module.default))

/** `strict` makes the full `motion.*` component a build error, on purpose. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
