'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { X } from 'lucide-react'
import { identity, navItems } from '@/content'
import { scrollToTarget } from '@/lib/scroll'
import { track } from '@/lib/analytics'
import { buttonClasses } from '@/components/primitives/Button'

type MobileSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Native dialog, so the focus trap, the escape key and the inert background
 * are the browser's job rather than a hand rolled one.
 */
export function MobileSheet({ open, onOpenChange }: MobileSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  const close = () => onOpenChange(false)

  return (
    <dialog
      ref={dialog}
      aria-label="Site menu"
      onClose={close}
      className="bg-canvas open:fixed open:inset-0 open:m-0 h-full max-h-none w-full max-w-none p-0 lg:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-5">
          <span className="mono text-ink text-sm tracking-[0.18em]">{identity.monogram}</span>
          <button
            type="button"
            onClick={close}
            className="border-edge-control text-ink grid size-11 place-items-center rounded-full border"
            aria-label="Close menu"
          >
            <X aria-hidden size={18} />
          </button>
        </div>

        <nav aria-label="Sections" className="flex-1 overflow-y-auto px-5 pt-6">
          <ul className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.id} className="sheet-item" style={{ '--i': index } as CSSProperties}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault()
                    close()
                    setTimeout(() => scrollToTarget(item.href), 60)
                  }}
                  className="border-edge text-ink hover:text-accent flex min-h-14 items-center justify-between border-b text-[1.375rem] font-medium"
                >
                  {item.label}
                  <span className="label">{String(index + 1).padStart(2, '0')}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-edge flex flex-col gap-3 border-t px-5 py-6">
          <a
            href={`mailto:${identity.email}`}
            className="mono text-ink-2 hover:text-accent inline-flex min-h-11 items-center text-[0.8125rem]"
          >
            {identity.email}
          </a>
          <a
            href={identity.phoneHref}
            className="mono text-ink-2 hover:text-accent inline-flex min-h-11 items-center text-[0.8125rem]"
          >
            {identity.phone}
          </a>
          <a
            href={identity.resumePath}
            download={identity.resumeFileName}
            onClick={() => track('resume_download', { source: 'mobile_sheet' })}
            className={buttonClasses('primary', 'md', 'mt-2 w-full')}
          >
            Download resume
          </a>
        </div>
      </div>
    </dialog>
  )
}
