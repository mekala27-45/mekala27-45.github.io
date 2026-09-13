import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export type PostHeading = { depth: 2 | 3; text: string; id: string }

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string
  draft: boolean
  readingMinutes: number
  headings: PostHeading[]
}

export type Post = PostMeta & { body: string }

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

/** Matches the ids rehype-slug produces for these headings. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
}

function parseHeadings(body: string): PostHeading[] {
  const headings: PostHeading[] = []
  let inFence = false
  for (const line of body.split('\n')) {
    if (line.startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{2,3})\s+(.*)$/.exec(line)
    if (!match) continue
    const [, hashes = '', text = ''] = match
    headings.push({ depth: hashes.length === 2 ? 2 : 3, text, id: slugify(text) })
  }
  return headings
}

function readPost(fileName: string): Post {
  const raw = readFileSync(path.join(POSTS_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)
  const words = content.split(/\s+/).filter(Boolean).length

  return {
    slug: fileName.replace(/\.mdx$/, ''),
    title: String(data.title ?? fileName),
    description: String(data.description ?? ''),
    date: String(data.date ?? ''),
    draft: data.draft === true,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    headings: parseHeadings(content),
    body: content,
  }
}

export function getAllPosts(): Post[] {
  if (!existsSync(POSTS_DIR)) return []
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** The index shows published posts only. Drafts still build, so the template
 *  is exercised and publishing is a one line change in the frontmatter. */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((post) => !post.draft)
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}
