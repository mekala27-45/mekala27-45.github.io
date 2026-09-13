import { evaluationClients, evaluationMetrics } from '@/content'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { MetricStrip } from '@/components/primitives/MetricStrip'
import dynamic from 'next/dynamic'

/** Server rendered for crawlers and for a page without JavaScript, with its
 *  client bundle split out of the entry chunk. */
const RatingWidget = dynamic(() =>
  import('@/components/evaluation/RatingWidget').then((mod) => mod.RatingWidget),
)

export function EvaluationLab() {
  return (
    <section
      id="evaluation"
      aria-labelledby="evaluation-heading"
      className="bg-sunken border-edge section-pad below-fold border-y"
    >
      <div className="shell">
        <SectionHeader
          index="03"
          label="FRONTIER MODEL EVALUATION"
          heading="Where the newest models still break"
          headingId="evaluation-heading"
          lede="Three comparisons from the contract work, in the shape the work actually takes. Pick the stronger response and the annotation opens."
        />

        <Reveal>
          <RatingWidget />
        </Reveal>

        <Reveal className="mt-16">
          <MetricStrip metrics={evaluationMetrics} />
        </Reveal>

        <div className="mt-16">
          <h3 className="label mb-6">CLIENTS</h3>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {evaluationClients.map((client, index) => (
              <Reveal as="li" key={client.name} delay={(index % 3) * 60}>
                <p className="mono text-ink text-[0.875rem] tracking-[0.06em]">{client.name}</p>
                <p className="text-ink-3 mt-1 text-[0.8125rem] leading-relaxed">
                  {client.contribution}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
