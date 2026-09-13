'use client'

import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { setScroller } from '@/lib/scroll'
import { whenIntentToScroll } from '@/lib/when-idle'

/**
 * Lenis, driven from the GSAP ticker so the pinned sequence and the smooth
 * scroll share one clock. Both libraries are imported inside the effect, so
 * neither lands in the first-load bundle. Under reduced motion nothing is
 * loaded at all and the browser keeps native scrolling.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let dispose: (() => void) | undefined
    let cancelled = false

    const boot = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
      })

      setScroller(lenis)

      const onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      const raf = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)

      dispose = () => {
        setScroller(null)
        lenis.off('scroll', onScroll)
        gsap.ticker.remove(raf)
        lenis.destroy()
      }
    }

    const cancelIdle = whenIntentToScroll(() => void boot())

    return () => {
      cancelled = true
      cancelIdle()
      dispose?.()
    }
  }, [reduced])

  return null
}
