'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { cn } from '@/lib/cn'

const InferenceField = dynamic(() => import('./InferenceField'), { ssr: false })

type FieldBackdropProps = {
  opacity?: number
  pointer?: boolean
  className?: string
}

/** Cheap capability read: a weak device or no WebGL means the gradient stands in. */
function isCapable(): boolean {
  if (typeof navigator !== 'undefined') {
    const cores = navigator.hardwareConcurrency
    if (typeof cores === 'number' && cores > 0 && cores < 4) return false
  }
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/**
 * The gradient mesh is always painted. The particle field loads after first
 * paint, only when the section is close to the viewport, and only on hardware
 * that can carry it.
 */
export function FieldBackdrop({ opacity = 0.3, pointer = true, className }: FieldBackdropProps) {
  const host = useRef<HTMLDivElement>(null)
  const near = useInViewOnce(host, '300px 0px 300px 0px')
  const reduced = useReducedMotion()
  const [capable, setCapable] = useState(false)

  useEffect(() => {
    setCapable(isCapable())
  }, [])

  return (
    <div
      ref={host}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(60% 55% at 18% 28%, color-mix(in oklch, var(--accent) 20%, transparent), transparent 70%)',
            'radial-gradient(50% 45% at 82% 18%, color-mix(in oklch, var(--accent) 12%, transparent), transparent 72%)',
            'radial-gradient(75% 60% at 55% 110%, color-mix(in oklch, var(--accent) 9%, transparent), transparent 68%)',
          ].join(', '),
          opacity: capable && near ? 'calc(var(--mesh) * 0.4)' : 'var(--mesh)',
          transition: 'opacity 900ms linear',
        }}
      />
      {capable && near ? (
        <InferenceField opacity={opacity} staticFrame={reduced} pointer={pointer && !reduced} />
      ) : null}
      <div
        className="from-canvas absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent"
        style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}
      />
    </div>
  )
}
