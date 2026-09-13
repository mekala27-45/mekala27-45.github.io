import { heroMetrics, identity, seo } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderCard } from '@/og/card'

export const alt = seo.title
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-static'

export default function OpengraphImage() {
  return renderCard({
    eyebrow: identity.title,
    title: identity.name,
    byline: identity.subtitle,
    metrics: heroMetrics.slice(0, 3).map((metric) => ({
      value: metric.value,
      label: metric.label,
      tone: metric.tone,
    })),
  })
}
