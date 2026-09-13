import { caseStudies, caseStudyBySlug, identity } from '@/content'
import { OG_CONTENT_TYPE, OG_SIZE, renderCard } from '@/og/card'

export const alt = 'Case study'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-static'

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export default async function CaseStudyOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = caseStudyBySlug(slug)

  return renderCard({
    eyebrow: study ? study.eyebrow : identity.title,
    title: study ? study.name : identity.name,
    byline: `${identity.name}, ${identity.title}`,
    metrics: (study?.metrics ?? []).slice(0, 3).map((metric) => ({
      value: metric.value,
      label: metric.label,
      tone: metric.tone,
    })),
  })
}
