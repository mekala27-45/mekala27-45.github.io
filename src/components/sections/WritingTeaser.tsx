import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { plannedPosts, writingEmptyState } from '@/content'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'

export function WritingTeaser() {
  return (
    <section id="writing" aria-labelledby="writing-heading" className="section-pad below-fold">
      <div className="shell">
        <SectionHeader
          index="06"
          label="WRITING"
          heading={writingEmptyState}
          headingId="writing-heading"
          lede="Two posts are drafted. Both come out of work described above rather than from a reading list."
        />

        <ul className="grid gap-4 md:grid-cols-2">
          {plannedPosts.map((post, index) => (
            <Reveal as="li" key={post.slug} delay={index * 80}>
              <article className="border-edge text-ink-3 flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-dashed p-6">
                <p className="label">DRAFT</p>
                <h3 className="font-display text-ink-2 text-[1.125rem] leading-snug font-semibold">
                  {post.title}
                </h3>
                <p className="mono mt-auto text-[0.6875rem] tracking-[0.08em] uppercase">
                  Not published yet
                </p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Link
          href="/writing"
          className="mono text-accent mt-8 inline-flex h-11 items-center gap-2 text-[0.75rem] tracking-[0.08em] uppercase"
        >
          Go to the writing index
          <ArrowRight aria-hidden size={14} />
        </Link>
      </div>
    </section>
  )
}
