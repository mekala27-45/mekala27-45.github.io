'use client'

import { useRef, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

/** Replaces `pre` in the MDX mapping so every code block gets a copy control. */
export function CodeBlock({ children }: { children?: ReactNode }) {
  const node = useRef<HTMLPreElement>(null)
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="group/code relative">
      <pre
        ref={node}
        className="border-edge overflow-x-auto rounded-xl border bg-[var(--code-bg)] p-4"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={() => void copy(node.current?.innerText ?? '')}
        className="border-edge-control bg-canvas text-ink-3 hover:text-accent absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-lg border opacity-0 transition-opacity group-hover/code:opacity-100 focus-visible:opacity-100"
        aria-label={copied ? 'Code copied' : 'Copy code'}
      >
        {copied ? <Check aria-hidden size={14} /> : <Copy aria-hidden size={14} />}
      </button>
    </div>
  )
}
