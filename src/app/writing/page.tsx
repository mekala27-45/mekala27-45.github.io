import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { identity, plannedPosts, writingEmptyState } from '@/content'
import { getPublishedPosts } from '@/lib/posts'
import { Reveal } from '@/components/primitives/Reveal'

export const metadata: Metadata = {
  title: `Writing, ${identity.name}`,
  description:
    'Notes on running pricing models in production and on authoring benchmarks that frontier agents fail.',
  alternates: { canonical: '/writing' },
}

export default function WritingIndexPage() {
  const posts = getPublishedPosts()

  return (
    <div className="pt-28 pb-24">
      <div className="shell max-w-[56rem]">
        <p className="label mb-5">06 / WRITING</p>
        <h1 className="text-section font-display font-semibold">
          {posts.length > 0 ? 'Writing' : writingEmptyState}
        </h1>
        <p className="text-lede text-ink-2 mt-5 max-w-[60ch]">
          Two posts are drafted. Both come out of the systems described on this site rather than
          from a reading list.
        </p>

        {posts.length > 0 ? (
          <ul className="divide-edge mt-12 flex flex-col divide-y">
            {posts.map((post) => (
              <Reveal as="li" key={post.slug}>
                <Link href={`/writing/${post.slug}`} className="group/post block py-7">
                  <p className="mono text-ink-3 mb-3 flex gap-3 text-[0.75rem] tracking-[0.08em]">
                    <time dateTime={post.date}>{post.date}</time>
                    <span aria-hidden>|</span>
                    <span>{post.readingMinutes} min read</span>
                  </p>
                  <h2 className="font-display text-ink group-hover/post:text-accent text-[1.375rem] leading-snug font-semibold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-ink-2 mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {plannedPosts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 80}>
                <article className="border-edge flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-dashed p-6">
                  <p className="label">DRAFT</p>
                  <h2 className="font-display text-ink-2 text-[1.125rem] leading-snug font-semibold">
                    {post.title}
                  </h2>
                  <p className="mono text-ink-3 mt-auto text-[0.6875rem] tracking-[0.08em] uppercase">
                    Not published yet
                  </p>
                </article>
              </Reveal>
            ))}
          </ul>
        )}

        <Link
          href="/"
          className="mono text-accent mt-12 inline-flex h-11 items-center gap-2 text-[0.75rem] tracking-[0.08em] uppercase"
        >
          Back to the site
          <ArrowRight aria-hidden size={14} />
        </Link>
      </div>
    </div>
  )
}
