import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import remarkGfm from 'remark-gfm'
import { identity } from '@/content'
import { getAllPosts, getPost } from '@/lib/posts'
import { ReadingProgress } from '@/components/writing/ReadingProgress'
import { TableOfContents } from '@/components/writing/TableOfContents'
import { CodeBlock } from '@/components/writing/CodeBlock'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: `${post.title}, ${identity.name}`,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article' },
    robots: post.draft ? { index: false, follow: false } : undefined,
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { content } = await compileMDX({
    source: post.body,
    components: { pre: CodeBlock },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
              defaultColor: false,
            },
          ],
        ],
      },
    },
  })

  return (
    <article className="pt-28 pb-24">
      <ReadingProgress />

      <div className="shell max-w-[72rem]">
        <Link
          href="/writing"
          className="mono text-ink-3 hover:text-accent mb-8 inline-flex h-11 items-center gap-2 text-[0.75rem] tracking-[0.08em] uppercase transition-colors"
        >
          <ArrowLeft aria-hidden size={14} />
          Writing
        </Link>

        <header className="border-edge border-b pb-8">
          {post.draft ? <p className="label text-warm mb-4">DRAFT, NOT PUBLISHED</p> : null}
          <h1 className="font-display max-w-[24ch] text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="mono text-ink-3 mt-5 flex flex-wrap gap-3 text-[0.75rem] tracking-[0.08em]">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden>|</span>
            <span>{post.readingMinutes} min read</span>
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="post-body lg:col-span-8">{content}</div>
          <aside className="order-first lg:order-last lg:col-span-4">
            <TableOfContents headings={post.headings} />
          </aside>
        </div>
      </div>
    </article>
  )
}
