'use client'

import { useRef, type ReactNode } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { MORPH_NAME, claimMorph } from '@/lib/view-transition'

type MorphTitleProps = {
  morphId: string
  className?: string
  children: ReactNode
  id?: string
}

/**
 * Takes the morph name only when this page was reached from the matching
 * card, so no named element lingers to interfere with the theme switch.
 */
export function MorphTitle({ morphId, className, children, id }: MorphTitleProps) {
  const node = useRef<HTMLHeadingElement>(null)

  useIsomorphicLayoutEffect(() => {
    const element = node.current
    if (!element || !claimMorph(morphId)) return
    element.style.viewTransitionName = MORPH_NAME
    const clear = () => element.style.removeProperty('view-transition-name')
    const timer = setTimeout(clear, 1200)
    return () => {
      clearTimeout(timer)
      clear()
    }
  }, [morphId])

  return (
    <h1 ref={node} id={id} className={className}>
      {children}
    </h1>
  )
}
