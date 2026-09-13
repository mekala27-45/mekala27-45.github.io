'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Result = {
  copied: boolean
  copy: (value: string) => Promise<boolean>
}

/** Copies, flips to a confirmed state for 1.5s, then resets. */
export function useCopyToClipboard(resetMs = 1500): Result {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const copy = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), resetMs)
        return true
      } catch {
        return false
      }
    },
    [resetMs],
  )

  return { copied, copy }
}
