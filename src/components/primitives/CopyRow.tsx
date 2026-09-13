'use client'

import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { track, type AnalyticsEvent } from '@/lib/analytics'

type CopyRowProps = {
  label: string
  value: string
  href: string
  event: AnalyticsEvent
}

/**
 * The value is a real link, so it still works without JavaScript. The copy
 * control sits beside it and confirms for 1.5 seconds.
 */
export function CopyRow({ label, value, href, event }: CopyRowProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="min-w-0">
        <span className="label block">{label}</span>
        <a
          href={href}
          className="mono text-ink hover:text-accent flex min-h-11 items-center truncate text-[0.8125rem] transition-colors"
        >
          {value}
        </a>
      </div>
      <button
        type="button"
        onClick={() => {
          void copy(value)
          track(event)
        }}
        className="border-edge-control text-ink-3 hover:text-accent hover:border-accent grid size-11 flex-none place-items-center rounded-lg border transition-colors"
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
      >
        {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </div>
  )
}
