import { caseStudies, toCardData } from '@/content'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { PlatformSequence } from '@/components/systems/PlatformSequence'
import { CaseStudyCard } from '@/components/systems/CaseStudyCard'

export function Systems() {
  return (
    <section id="systems" aria-labelledby="systems-heading" className="section-pad">
      <div className="shell">
        <SectionHeader
          index="02"
          label="SYSTEMS IN PRODUCTION"
          heading="The platform, and the two pricing systems on it"
          headingId="systems-heading"
          lede="Promotion and clearance pricing at Walmart run on one Azure Databricks platform. This is the path a prediction takes through it, stage by stage."
        />
      </div>

      <div className="shell-bleed">
        <PlatformSequence />
      </div>

      <div className="shell mt-24 md:mt-32">
        <h3 className="label mb-8">CASE STUDIES</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.map((study, index) => (
            <Reveal key={study.slug} as="div" delay={(index % 2) * 80} className="h-full">
              <CaseStudyCard study={toCardData(study)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
