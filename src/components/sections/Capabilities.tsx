import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import dynamic from 'next/dynamic'

const CapabilityMatrix = dynamic(() =>
  import('@/components/capabilities/CapabilityMatrix').then((mod) => mod.CapabilityMatrix),
)

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="section-pad below-fold"
    >
      <div className="shell">
        <SectionHeader
          index="05"
          label="CAPABILITIES"
          heading="Marked by daily use, not by years"
          headingId="capabilities-heading"
          lede="Filter by group and the matching capabilities move to the front. Nothing is hidden, because the shape of the whole list is part of the answer."
        />
        <Reveal>
          <CapabilityMatrix />
        </Reveal>
      </div>
    </section>
  )
}
