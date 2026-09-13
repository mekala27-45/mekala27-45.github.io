'use client'

import { useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

export function ScrollCue() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(true)

  useMotionValueEvent(scrollY, 'change', (value) => {
    setVisible(value <= 100)
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="cue-rail" />
    </div>
  )
}
