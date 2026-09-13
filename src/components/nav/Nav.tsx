'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'
import * as m from 'motion/react-m'
import { Menu } from 'lucide-react'
import { identity, navItems } from '@/content'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useActiveSection } from '@/hooks/useActiveSection'
import { scrollToTarget } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { buttonClasses } from '@/components/primitives/Button'
import { ThemeToggle } from '@/components/system/ThemeToggle'

/** Neither overlay is part of the first load. They arrive when first opened. */
const CommandPalette = dynamic(() => import('./CommandPalette').then((mod) => mod.CommandPalette), {
  ssr: false,
})
const MobileSheet = dynamic(() => import('./MobileSheet').then((mod) => mod.MobileSheet), {
  ssr: false,
})

const SECTION_IDS = navItems.map((item) => item.id)

export function Nav() {
  const { scrollY } = useScroll()
  const progress = useScrollProgress()
  const active = useActiveSection(SECTION_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteMounted, setPaletteMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K')

  useMotionValueEvent(scrollY, 'change', (value) => {
    setScrolled(value > 80)
  })

  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) {
      setShortcutLabel('⌘ K')
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setPaletteMounted(true)
        setPaletteOpen((open) => {
          if (!open) track('palette_open', { source: 'keyboard' })
          return !open
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header
        data-scrolled={scrolled ? 'true' : 'false'}
        className="group/nav fixed inset-x-0 top-0 z-50 h-16"
      >
        <div
          aria-hidden
          className="border-edge absolute inset-0 border-b opacity-0 transition-opacity duration-300 group-data-[scrolled=true]/nav:opacity-100"
          style={{
            backgroundColor: 'color-mix(in oklch, var(--canvas) 72%, transparent)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          }}
        />

        <div className="shell-bleed relative flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollToTarget('top')}
            className="mono text-ink hover:text-accent -ml-1 flex h-11 items-center px-1 text-sm tracking-[0.2em] transition-colors"
            aria-label="Back to the top"
          >
            {identity.monogram}
          </button>

          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={item.href}
                      aria-current={isActive ? 'true' : undefined}
                      className="mono text-ink-3 hover:text-ink relative z-10 flex h-11 items-center rounded-full px-3 text-[0.75rem] tracking-[0.1em] uppercase transition-colors data-[active=true]:text-ink"
                      data-active={isActive ? 'true' : 'false'}
                    >
                      {item.label}
                    </a>
                    {isActive ? (
                      <m.span
                        layoutId="nav-active"
                        aria-hidden
                        className="bg-accent-soft border-accent/30 absolute inset-0 rounded-full border"
                        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.6 }}
                      />
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="border-edge-control text-ink-2 hover:text-accent hover:border-accent grid size-11 place-items-center rounded-full border transition-colors" />

            <button
              type="button"
              onClick={() => {
                track('palette_open', { source: 'chip' })
                setPaletteMounted(true)
                setPaletteOpen(true)
              }}
              className="border-edge-control text-ink-3 hover:text-ink hover:border-edge-strong mono hidden h-11 items-center gap-2 rounded-full border px-3 text-[0.6875rem] tracking-[0.1em] transition-colors md:flex"
            >
              <span aria-hidden>{shortcutLabel}</span>
              <span className="sr-only">Open the command palette</span>
            </button>

            <a
              href={identity.resumePath}
              download={identity.resumeFileName}
              onClick={() => track('resume_download', { source: 'nav' })}
              className={buttonClasses('primary', 'md', 'h-11 px-4 text-[0.6875rem]')}
            >
              Resume
            </a>

            <button
              type="button"
              onClick={() => {
                setMenuMounted(true)
                setMenuOpen(true)
              }}
              className="border-edge-control text-ink grid size-11 place-items-center rounded-full border lg:hidden"
              aria-label="Open menu"
            >
              <Menu aria-hidden size={18} />
            </button>
          </div>
        </div>

        <m.div
          aria-hidden
          className="bg-accent absolute inset-x-0 bottom-0 h-[2px] origin-left"
          style={{ scaleX: progress }}
        />
      </header>

      {paletteMounted ? <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} /> : null}
      {menuMounted ? <MobileSheet open={menuOpen} onOpenChange={setMenuOpen} /> : null}
    </>
  )
}
