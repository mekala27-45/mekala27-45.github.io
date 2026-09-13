import type { MetadataRoute } from 'next'
import { caseStudies, SITE_URL } from '@/content'
import { getPublishedPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...caseStudies.map((study) => ({
      url: `${SITE_URL}/work/${study.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getPublishedPosts().map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
