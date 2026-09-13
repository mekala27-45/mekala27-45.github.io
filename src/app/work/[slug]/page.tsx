import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { caseStudies, caseStudyBySlug, identity, seo } from '@/content'
import type { CaseStudy } from '@/content/schema'
import { MorphTitle } from '@/components/system/MorphTitle'
import { Reveal } from '@/components/primitives/Reveal'
import { buttonClasses } from '@/components/primitives/Button'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudyBySlug(slug)
  if (!study) return { title: seo.title }

  const title = `${study.name}, ${identity.name}`
  return {
    title,
    description: study.thesis,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title, description: study.thesis, url: `/work/${study.slug}` },
    twitter: { card: 'summary_large_image', title, description: study.thesis },
  }
}

const SECTIONS: ReadonlyArray<{ key: keyof CaseStudy['narrative']; heading: string }> = [
  { key: 'context', heading: 'Context' },
  { key: 'constraints', heading: 'Constraints' },
  { key: 'built', heading: 'What I built' },
  { key: 'architecture', heading: 'Architecture' },
  { key: 'results', heading: 'Results' },
  { key: 'differently', heading: 'What I would do differently' },
]

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const study = caseStudyBySlug(slug)
  if (!study) notFound()

  return (
    <article className="pb-24">
      <header className="border-edge bg-sunken border-b pt-28 pb-14">
        <div className="shell">
          <Link
            href="/#systems"
            className="mono text-ink-3 hover:text-accent mb-8 inline-flex h-11 items-center gap-2 text-[0.75rem] tracking-[0.08em] uppercase transition-colors"
          >
            <ArrowLeft aria-hidden size={14} />
            All systems
          </Link>
          <p className="label mb-4">{study.eyebrow}</p>
          <MorphTitle
            morphId={study.slug}
            id="case-study-title"
            className="text-section font-display font-semibold"
          >
            {study.name}
          </MorphTitle>
          <p className="text-lede text-ink-2 mt-5 max-w-[62ch]">{study.thesis}</p>
          <ul className="mt-8 flex flex-wrap gap-1.5">
            {study.tech.map((item) => (
              <li
                key={item}
                className="mono border-edge text-ink-3 rounded border px-2 py-1 text-[0.6875rem]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="shell grid gap-12 pt-16 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-12 lg:col-span-8">
          {SECTIONS.map(({ key, heading }) => (
            <Reveal as="section" key={key}>
              <h2 className="text-headline font-display mb-5 font-semibold">{heading}</h2>
              <div className="prose-block flex flex-col gap-4">
                {study.narrative[key].map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          ))}

          <div className="border-edge flex flex-wrap gap-3 border-t pt-10">
            <Link href="/#systems" className={buttonClasses('ghost', 'md')}>
              Back to the systems
            </Link>
            <a
              href={identity.resumePath}
              download={identity.resumeFileName}
              className={buttonClasses('primary', 'md')}
            >
              Download resume
            </a>
          </div>
        </div>

        <aside className="lg:col-span-4" aria-labelledby="impact-heading">
          <div className="lg:sticky lg:top-24">
            <h2 id="impact-heading" className="label mb-6">
              IMPACT
            </h2>
            <ul className="divide-edge flex flex-col divide-y">
              {study.metrics.map((metric) => (
                <li key={metric.label} className="py-5 first:pt-0">
                  <p
                    className={
                      metric.tone === 'warm'
                        ? 'text-warm font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] tabular-nums'
                        : 'text-ink font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] tabular-nums'
                    }
                  >
                    {metric.value}
                  </p>
                  <p className="label mt-2.5 leading-[1.4]">{metric.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
