'use client'

import { AtSign, Check } from 'lucide-react'
import { identity } from '@/content'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { track } from '@/lib/analytics'

/** Opens the mail client and copies the address, because one of the two always
 *  fails on somebody's machine. */
export function EmailTarget() {
  const { copied, copy } = useCopyToClipboard()

  return (
    <a
      href={`mailto:${identity.email}`}
      onClick={() => {
        void copy(identity.email)
        track('email_copy', { source: 'contact' })
      }}
      className="lit spotlight group/target flex min-h-[3.5rem] items-center gap-4 rounded-[var(--radius-card)] p-4 sm:p-5"
    >
      <AtSign aria-hidden size={18} className="text-accent shrink-0" />
      <span className="min-w-0">
        <span className="label block">EMAIL</span>
        <span className="mono text-ink block truncate text-[0.8125rem]">{identity.email}</span>
      </span>
      <span className="mono text-ink-3 ml-auto shrink-0 text-[0.6875rem] tracking-[0.08em] uppercase">
        {copied ? (
          <span className="text-accent inline-flex items-center gap-1.5">
            <Check aria-hidden size={13} /> Copied
          </span>
        ) : (
          'Copy'
        )}
      </span>
    </a>
  )
}
