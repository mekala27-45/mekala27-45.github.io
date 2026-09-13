'use client'

import { useEffect, useRef, useState } from 'react'
import { platformStages } from '@/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { whenIntentToScroll } from '@/lib/when-idle'
import { PlatformDiagram } from './PlatformDiagram'

const TOTAL = platformStages.length

/**
 * Above 768px with motion allowed, the figure pins for three viewports of
 * scroll and the stages light in order. Below that, or under reduced motion,
 * the same stages read as a vertical stepper. Same content either way.
 */
export function PlatformSequence() {
  const root = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(1)
  const [pinned, setPinned] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const container = root.current
    const target = pin.current
    if (!container || !target || reduced) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    const boot = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const media = gsap.matchMedia()
      media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        // The pinned layout is applied to the node before the trigger measures
        // it. Waiting for the React render would have ScrollTrigger pin the
        // taller stepper layout and push the caption panel off screen.
        container.dataset.mode = 'pinned'
        setPinned(true)

        const trigger = ScrollTrigger.create({
          trigger: target,
          start: 'top top',
          end: '+=300%',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const next = Math.min(TOTAL, Math.max(1, Math.ceil(self.progress * TOTAL) || 1))
            setStage(next)
          },
        })
        ScrollTrigger.refresh()

        return () => {
          container.dataset.mode = 'flow'
          setPinned(false)
          trigger.kill()
        }
      })

      cleanup = () => media.revert()
    }

    const cancelIdle = whenIntentToScroll(() => void boot())
    return () => {
      cancelled = true
      cancelIdle()
      cleanup?.()
    }
  }, [reduced])

  // Stepper mode marks the card nearest the middle of the viewport.
  useEffect(() => {
    if (pinned || reduced) return
    const container = root.current
    if (!container) return
    const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-step]'))
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = Number((entry.target as HTMLElement).dataset.step)
          if (!Number.isNaN(index)) setStage(index)
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    for (const card of cards) observer.observe(card)
    return () => observer.disconnect()
  }, [pinned, reduced])

  return (
    <div
      ref={root}
      className="platform"
      data-mode={pinned ? 'pinned' : 'flow'}
      data-stage={stage}
      style={{ ['--stage' as string]: stage }}
    >
      <div ref={pin} className="platform-pin">
        <figure className="platform-figure">
          <PlatformDiagram stage={pinned ? stage : 7} />
        </figure>

        <div className="platform-readout">
          <p className="mono text-ink-3 platform-counter text-[0.6875rem] tracking-[0.16em]">
            STAGE {String(stage).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </p>

          <ol className="platform-steps">
            {platformStages.map((item) => (
              <li
                key={item.index}
                data-step={item.index}
                data-state={item.index === stage ? 'active' : item.index < stage ? 'past' : 'idle'}
                className="platform-step"
              >
                <p className="platform-step-title mono text-accent mb-2 text-[0.6875rem] tracking-[0.16em]">
                  {String(item.index).padStart(2, '0')} {item.title}
                </p>
                <p className="platform-step-caption text-ink-2 max-w-[68ch] text-[0.9375rem] leading-relaxed">
                  {item.caption}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
