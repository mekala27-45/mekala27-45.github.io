'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useScroll, useTransform } from 'motion/react'
import * as m from 'motion/react-m'

/**
 * The rail draws itself as the section is read. Where the browser supports
 * scroll driven CSS animation that runs off the main thread; otherwise Motion
 * drives the same transform from a scroll progress value.
 */
export function TimelineFrame({ children }: { children: ReactNode }) {
  const section = useRef<HTMLDivElement>(null)
  const [cssTimeline, setCssTimeline] = useState<boolean | null>(null)

  useEffect(() => {
    setCssTimeline(
      typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        CSS.supports('animation-timeline: view()'),
    )
  }, [])

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ['start 70%', 'end 85%'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={section} className="relative pl-6 sm:pl-8">
      <span aria-hidden className="bg-edge absolute top-0 bottom-0 left-0 w-px" />
      {cssTimeline === false ? (
        <m.span
          aria-hidden
          style={{ scaleY }}
          className="bg-accent absolute top-0 bottom-0 left-0 w-px origin-top"
        />
      ) : (
        <span
          aria-hidden
          data-css-timeline={cssTimeline === true ? 'true' : 'false'}
          className="rail-fill bg-accent absolute top-0 bottom-0 left-0 w-px"
        />
      )}
      {children}
    </div>
  )
}
