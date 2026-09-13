'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  ArrowUpRight,
  AtSign,
  ExternalLink,
  FileDown,
  Phone,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { caseStudies, identity, navItems } from '@/content'
import { scrollToTarget } from '@/lib/scroll'
import { track } from '@/lib/analytics'

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const itemClass =
  'mono flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8125rem] text-ink-2 data-[selected=true]:bg-accent-soft data-[selected=true]:text-ink'

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) {
      node.showModal()
      // showModal focuses the dialog itself, so the search field is claimed here.
      requestAnimationFrame(() => input.current?.focus())
    }
    if (!open && node.open) node.close()
  }, [open])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(timer)
  }, [toast])

  const close = () => onOpenChange(false)

  const copy = async (value: string, message: string, event: 'email_copy' | 'phone_copy') => {
    close()
    try {
      await navigator.clipboard.writeText(value)
      setToast(message)
      track(event)
    } catch {
      setToast('Clipboard is blocked in this browser')
    }
  }

  const goToSection = (href: string) => {
    close()
    requestAnimationFrame(() => scrollToTarget(href))
  }

  const goToRoute = (href: string) => {
    close()
    router.push(href)
  }

  return (
    <>
      <dialog
        ref={dialog}
        aria-label="Command palette"
        onClose={close}
        onClick={(event) => {
          if (event.target === dialog.current) close()
        }}
        className="bg-transparent p-0 backdrop:bg-black/60 open:mx-auto open:mt-[12vh] open:mb-auto"
      >
        <div className="lit w-[min(94vw,36rem)] overflow-hidden rounded-2xl">
          <Command label="Command palette" loop className="flex flex-col">
            <Command.Input
              ref={input}
              autoFocus
              placeholder="Search sections, case studies and actions"
              className="border-edge text-ink placeholder:text-ink-3 w-full border-b bg-transparent px-4 py-4 text-[0.9375rem] outline-none"
            />
            <Command.List className="max-h-[min(60vh,24rem)] overflow-y-auto p-2">
              <Command.Empty className="mono text-ink-3 px-3 py-6 text-center text-[0.8125rem]">
                Nothing matches that.
              </Command.Empty>

              <Command.Group
                heading="Navigate"
                className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                {navItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`section ${item.label}`}
                    onSelect={() => goToSection(item.href)}
                    className={itemClass}
                  >
                    <ArrowUpRight aria-hidden size={15} />
                    {item.label}
                  </Command.Item>
                ))}
                {caseStudies.map((study) => (
                  <Command.Item
                    key={study.slug}
                    value={`case study ${study.name}`}
                    onSelect={() => goToRoute(`/work/${study.slug}`)}
                    className={itemClass}
                  >
                    <SquareArrowOutUpRight aria-hidden size={15} />
                    {study.name}
                    <span className="label ml-auto normal-case">Case study</span>
                  </Command.Item>
                ))}
                <Command.Item
                  value="resume page"
                  onSelect={() => goToRoute('/resume')}
                  className={itemClass}
                >
                  <SquareArrowOutUpRight aria-hidden size={15} />
                  Resume, plain HTML
                </Command.Item>
                <Command.Item
                  value="writing index"
                  onSelect={() => goToRoute('/writing')}
                  className={itemClass}
                >
                  <SquareArrowOutUpRight aria-hidden size={15} />
                  Writing
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Actions"
                className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                <Command.Item
                  value="download resume pdf"
                  onSelect={() => {
                    close()
                    track('resume_download', { source: 'palette' })
                    window.location.href = identity.resumePath
                  }}
                  className={itemClass}
                >
                  <FileDown aria-hidden size={15} />
                  Download resume, PDF
                </Command.Item>
                <Command.Item
                  value={`copy email ${identity.email}`}
                  onSelect={() => void copy(identity.email, 'Email copied', 'email_copy')}
                  className={itemClass}
                >
                  <AtSign aria-hidden size={15} />
                  Copy email
                  <span className="text-ink-3 ml-auto">{identity.email}</span>
                </Command.Item>
                <Command.Item
                  value={`copy phone ${identity.phone}`}
                  onSelect={() => void copy(identity.phone, 'Phone number copied', 'phone_copy')}
                  className={itemClass}
                >
                  <Phone aria-hidden size={15} />
                  Copy phone number
                  <span className="text-ink-3 ml-auto">{identity.phone}</span>
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Links"
                className="[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                <Command.Item
                  value="linkedin profile"
                  onSelect={() => {
                    close()
                    window.open(identity.linkedinUrl, '_blank', 'noopener,noreferrer')
                  }}
                  className={itemClass}
                >
                  <ExternalLink aria-hidden size={15} />
                  LinkedIn
                </Command.Item>
                <Command.Item
                  value="github profile"
                  onSelect={() => {
                    close()
                    window.open(identity.githubUrl, '_blank', 'noopener,noreferrer')
                  }}
                  className={itemClass}
                >
                  <ExternalLink aria-hidden size={15} />
                  GitHub
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      </dialog>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4"
      >
        {toast ? (
          <span className="lit mono text-ink rounded-full px-4 py-2 text-[0.75rem] tracking-[0.08em]">
            {toast}
          </span>
        ) : null}
      </div>
    </>
  )
}
