'use client'

import * as m from 'motion/react-m'
import { useScrollProgress } from '@/hooks/useScrollProgress'

export function ReadingProgress() {
  const progress = useScrollProgress()

  return (
    <m.div
      aria-hidden
      style={{ scaleX: progress }}
      className="bg-accent fixed inset-x-0 top-16 z-40 h-[2px] origin-left"
    />
  )
}
