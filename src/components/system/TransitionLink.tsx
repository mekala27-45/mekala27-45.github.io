'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { runRouteTransition, supportsViewTransitions } from '@/lib/view-transition'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type TransitionLinkProps = {
  href: string
  morphId: string
  /** Element inside the link whose title morphs into the destination heading. */
  morphSelector?: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
  'aria-label'?: string
}

const SETTLE_TIMEOUT_MS = 1600

export function TransitionLink({
  href,
  morphId,
  morphSelector = '[data-morph-title]',
  className,
  children,
  onNavigate,
  ...rest
}: TransitionLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const resolve = useRef<(() => void) | null>(null)
  const waitingFor = useRef<string | null>(null)

  useEffect(() => {
    if (waitingFor.current && pathname === waitingFor.current) {
      resolve.current?.()
      resolve.current = null
      waitingFor.current = null
    }
  }, [pathname])

  const reduced = useReducedMotion()

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return
      }
      onNavigate?.()
      if (reduced || !supportsViewTransitions()) return

      event.preventDefault()

      const morphFrom = event.currentTarget.querySelector<HTMLElement>(morphSelector)
      waitingFor.current = href

      const settled = new Promise<void>((done) => {
        resolve.current = done
        setTimeout(done, SETTLE_TIMEOUT_MS)
      })

      runRouteTransition({
        morphId,
        morphFrom,
        navigate: () => startTransition(() => router.push(href)),
        settled,
      })
    },
    [href, morphId, morphSelector, onNavigate, reduced, router],
  )

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  )
}
