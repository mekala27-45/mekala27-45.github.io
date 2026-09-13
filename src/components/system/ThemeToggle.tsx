'use client'

import { useEffect, useRef, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { track } from '@/lib/analytics'
import { runThemeTransition } from '@/lib/view-transition'

type Theme = 'dark' | 'light'

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const button = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    setTheme(current === 'light' ? 'light' : 'dark')
  }, [])

  const apply = (next: Theme) => {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // A blocked storage API should not stop the theme from changing.
    }
    setTheme(next)
  }

  const onToggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    track('theme_toggle', { theme: next })

    const node = button.current
    if (reduced || !node) {
      apply(next)
      return
    }

    const rect = node.getBoundingClientRect()
    const started = runThemeTransition({
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      apply: () => apply(next),
    })

    if (!started) apply(next)
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={onToggle}
      className={className}
      aria-label={theme === 'dark' ? 'Switch to the light theme' : 'Switch to the dark theme'}
    >
      {theme === 'dark' ? <Sun aria-hidden size={16} /> : <Moon aria-hidden size={16} />}
    </button>
  )
}
