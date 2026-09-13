import { ExternalLink, FileDown } from 'lucide-react'
import { contact, identity } from '@/content'
import { resumeFileSize } from '@/lib/resume-meta'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { FieldBackdrop } from '@/components/hero/FieldBackdrop'
import { EmailTarget } from '@/components/contact/EmailTarget'
import { buttonClasses } from '@/components/primitives/Button'

const links = [
  { label: 'LINKEDIN', value: identity.linkedin, href: identity.linkedinUrl },
  { label: 'GITHUB', value: identity.github, href: identity.githubUrl },
]

export function Contact() {
  const size = resumeFileSize()

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-sunken border-edge section-pad relative overflow-hidden border-t"
    >
      <FieldBackdrop opacity={0.15} pointer={false} />

      <div className="shell relative">
        <SectionHeader
          index="07"
          label="CONTACT"
          heading={contact.headline}
          headingId="contact-heading"
          lede={contact.want}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Reveal>
            <EmailTarget />
          </Reveal>
          {links.map((link, index) => (
            <Reveal key={link.label} delay={(index + 1) * 70}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lit spotlight flex min-h-[3.5rem] items-center gap-4 rounded-[var(--radius-card)] p-4 sm:p-5"
              >
                <ExternalLink aria-hidden size={18} className="text-accent shrink-0" />
                <span className="min-w-0">
                  <span className="label block">{link.label}</span>
                  <span className="mono text-ink block truncate text-[0.8125rem]">
                    {link.value}
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={identity.resumePath}
            download={identity.resumeFileName}
            className={buttonClasses('primary', 'lg', 'w-full sm:flex-1')}
          >
            <FileDown aria-hidden size={16} />
            Download resume, PDF
          </a>
          <div className="flex items-center gap-3">
            {size ? <span className="mono text-ink-3 text-[0.75rem]">{size}</span> : null}
            <button
              type="button"
              // Native popover: no focus trap of my own, no extra JavaScript.
              popoverTarget="resume-preview"
              className={buttonClasses('quiet', 'md')}
            >
              Preview
            </button>
          </div>
        </Reveal>

        <div
          id="resume-preview"
          popover="auto"
          className="lit m-auto w-[min(92vw,30rem)] rounded-[var(--radius-card)] p-6"
        >
          <p className="label mb-4">RESUME, AT A GLANCE</p>
          <p className="text-ink text-[1.0625rem] leading-snug font-semibold">{identity.name}</p>
          <p className="text-ink-2 mt-1 text-[0.9375rem]">{identity.title}, Walmart</p>
          <p className="text-ink-2 mt-4 text-[0.9375rem] leading-relaxed">
            Production ML at Walmart, four years of frontier model evaluation on contract, ETL and
            forecasting at Tech Mahindra, and an MS in Data Science finishing in May 2026.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/resume" className={buttonClasses('ghost', 'md')}>
              Read it as a web page
            </a>
            <a
              href={identity.resumePath}
              download={identity.resumeFileName}
              className={buttonClasses('primary', 'md')}
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
