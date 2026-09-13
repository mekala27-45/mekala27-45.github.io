import { education, roles } from '@/content'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { TimelineFrame } from '@/components/experience/TimelineFrame'

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="section-pad">
      <div className="shell">
        <SectionHeader
          index="04"
          label="EXPERIENCE"
          heading="Four years, newest first"
          headingId="experience-heading"
        />

        <TimelineFrame>
          <ol className="flex flex-col gap-4">
            {roles.map((role) => (
              <li key={role.id} className="timeline-item relative">
                <span aria-hidden className="timeline-dot" />
                <Reveal className="lit rounded-[var(--radius-card)] p-5 sm:p-7">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div>
                      <h3 className="font-display text-ink text-[1.375rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[1.5rem]">
                        {role.title}
                      </h3>
                      <p className="text-ink-2 mt-1 text-[0.9375rem]">
                        {role.company}, {role.location}
                      </p>
                    </div>
                    <p className="mono text-ink-3 shrink-0 text-[0.75rem] tracking-[0.08em] sm:pt-1">
                      {role.dates}
                    </p>
                  </div>

                  {role.clients ? (
                    <p className="mono text-ink-3 mt-3 text-[0.75rem] leading-relaxed">
                      Clients: {role.clients.join(', ')}
                    </p>
                  ) : null}

                  <ul className="mt-5 flex flex-col gap-3">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet.slice(0, 32)}
                        className="text-ink-2 relative pl-5 text-[0.9375rem] leading-relaxed before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-2.5 before:bg-[var(--edge-strong)]"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {role.tech.map((item) => (
                      <li
                        key={item}
                        className="mono border-edge text-ink-3 rounded border px-1.5 py-0.5 text-[0.6875rem]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </TimelineFrame>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {education.map((entry) => (
            <Reveal key={entry.degree} className="lit rounded-[var(--radius-card)] p-5">
              <p className="label mb-3">EDUCATION</p>
              <h3 className="text-ink text-[1.0625rem] leading-snug font-semibold">
                {entry.degree}
              </h3>
              <p className="text-ink-2 mt-1 text-[0.9375rem]">
                {entry.school}, {entry.location}
              </p>
              <p className="mono text-ink-3 mt-2 text-[0.75rem] tracking-[0.08em]">{entry.date}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
