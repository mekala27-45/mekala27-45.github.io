import type { Metadata } from 'next'
import Link from 'next/link'
import {
  aboutParagraphs,
  capabilities,
  capabilityGroups,
  education,
  identity,
  roles,
  seo,
} from '@/content'
import { buttonClasses } from '@/components/primitives/Button'

export const metadata: Metadata = {
  title: `Resume, ${identity.name}`,
  description: seo.description,
  alternates: { canonical: '/resume' },
  openGraph: { title: `Resume, ${identity.name}`, description: seo.description, url: '/resume' },
}

/** The marker syntax only exists for the styled About column. */
const plain = (text: string) => text.replace(/\*\*|##/g, '')

export default function ResumePage() {
  return (
    <div className="resume-doc pt-28 pb-24">
      <div className="shell max-w-[52rem]">
        <div className="no-print mb-10 flex flex-wrap items-center gap-3">
          <Link href="/" className={buttonClasses('quiet', 'md')}>
            Back to the site
          </Link>
          <a
            href={identity.resumePath}
            download={identity.resumeFileName}
            className={buttonClasses('primary', 'md')}
          >
            Download PDF
          </a>
        </div>

        <header className="border-edge border-b pb-6">
          <h1 className="font-display text-[clamp(2rem,5vw,2.75rem)] leading-none font-semibold tracking-[-0.03em]">
            {identity.name}
          </h1>
          <p className="text-ink-2 mt-3 text-[1.0625rem]">
            {identity.title} | {identity.subtitle}
          </p>
          <p className="mono text-ink-3 mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem]">
            <span>{identity.location}</span>
            <span aria-hidden>|</span>
            <a href={identity.phoneHref} className="hover:text-accent">
              {identity.phone}
            </a>
            <span aria-hidden>|</span>
            <a href={`mailto:${identity.email}`} className="hover:text-accent">
              {identity.email}
            </a>
          </p>
          <p className="mono text-ink-3 mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem]">
            <a href={identity.linkedinUrl} className="hover:text-accent">
              {identity.linkedin}
            </a>
            <span aria-hidden>|</span>
            <a href={identity.githubUrl} className="hover:text-accent">
              {identity.github}
            </a>
          </p>
          <p className="text-ink-3 mt-3 text-[0.875rem]">{identity.workAuth}</p>
        </header>

        <section aria-labelledby="resume-summary" className="mt-10">
          <h2 id="resume-summary" className="label mb-4">
            SUMMARY
          </h2>
          <div className="flex flex-col gap-3">
            {aboutParagraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-ink-2 text-[0.9375rem] leading-relaxed"
              >
                {plain(paragraph)}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="resume-skills" className="mt-10">
          <h2 id="resume-skills" className="label mb-4">
            TECHNICAL SKILLS
          </h2>
          <dl className="flex flex-col gap-3">
            {capabilityGroups.map((group) => (
              <div key={group}>
                <dt className="text-ink text-[0.875rem] font-semibold">{group}</dt>
                <dd className="text-ink-2 text-[0.9375rem] leading-relaxed">
                  {capabilities
                    .filter((item) => item.group === group)
                    .map((item) => item.name)
                    .join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="resume-experience" className="mt-10">
          <h2 id="resume-experience" className="label mb-4">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="flex flex-col gap-8">
            {roles.map((role) => (
              <article key={role.id} className="resume-role">
                <h3 className="text-ink text-[1.0625rem] font-semibold">
                  {role.title} | {role.company} | {role.location}
                </h3>
                <p className="mono text-ink-3 mt-1 text-[0.8125rem]">{role.dates}</p>
                {role.clients ? (
                  <p className="text-ink-2 mt-2 text-[0.875rem]">
                    Clients: {role.clients.join(', ')}
                  </p>
                ) : null}
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                  {role.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 32)}
                      className="text-ink-2 text-[0.9375rem] leading-relaxed"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="text-ink-3 mt-3 text-[0.8125rem]">
                  <span className="font-semibold">Tools:</span> {role.tech.join(', ')}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="resume-education" className="mt-10">
          <h2 id="resume-education" className="label mb-4">
            EDUCATION
          </h2>
          <ul className="flex flex-col gap-3">
            {education.map((entry) => (
              <li key={entry.degree}>
                <p className="text-ink text-[0.9375rem] font-semibold">{entry.degree}</p>
                <p className="text-ink-2 text-[0.9375rem]">
                  {entry.school}, {entry.location} | {entry.date}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
