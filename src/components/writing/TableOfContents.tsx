'use client'

import type { PostHeading } from '@/lib/posts'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/cn'

export function TableOfContents({ headings }: { headings: readonly PostHeading[] }) {
  const ids = headings.map((heading) => heading.id)
  const active = useActiveSection(ids)

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="label mb-4">ON THIS PAGE</p>
      <ul className="border-edge flex flex-col gap-1 border-l">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                '-ml-px block border-l py-1.5 text-[0.8125rem] leading-snug transition-colors',
                heading.depth === 3 ? 'pl-7' : 'pl-4',
                active === heading.id
                  ? 'border-accent text-ink'
                  : 'text-ink-3 hover:text-ink border-transparent',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
