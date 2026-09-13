import { aboutParagraphs, identity, specRows } from '@/content'
import { renderRich } from '@/lib/rich-text'
import { Reveal } from '@/components/primitives/Reveal'
import { DefinitionList } from '@/components/primitives/DefinitionList'
import { CopyRow } from '@/components/primitives/CopyRow'

export function About() {
  return (
    <section id="profile" aria-labelledby="profile-heading" className="section-pad below-fold">
      <div className="shell">
        <h2 id="profile-heading" className="label mb-5">
          01 / PROFILE
        </h2>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="prose-block flex flex-col gap-6 lg:col-span-7">
            {aboutParagraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
                <p>{renderRich(paragraph)}</p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Reveal>
                <div className="lit rounded-[var(--radius-card)] p-6">
                  <p className="label mb-5">SPECIFICATION</p>
                  <DefinitionList rows={specRows} />
                  <div className="border-edge mt-5 border-t pt-2">
                    <CopyRow
                      label="EMAIL"
                      value={identity.email}
                      href={`mailto:${identity.email}`}
                      event="email_copy"
                    />
                    <CopyRow
                      label="PHONE"
                      value={identity.phone}
                      href={identity.phoneHref}
                      event="phone_copy"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
