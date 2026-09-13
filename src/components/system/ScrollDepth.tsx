'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/lib/analytics'
import { whenIdle } from '@/lib/when-idle'

const MILESTONES = [25, 50, 75, 100] as const

/** Reports how far down the page people actually get. */
export function ScrollDepth() {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    let frame: number | null = null

    const measure = () => {
      frame = null
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return
      const percent = Math.round((window.scrollY / scrollable) * 100)
      for (const milestone of MILESTONES) {
        if (percent >= milestone && !fired.current.has(milestone)) {
          fired.current.add(milestone)
          track('scroll_depth', { percent: milestone })
        }
      }
    }

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    const cancelIdle = whenIdle(() =>
      window.addEventListener('scroll', onScroll, { passive: true }),
    )

    return () => {
      cancelIdle()
      window.removeEventListener('scroll', onScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
