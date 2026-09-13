import { footer, identity } from '@/content'

/** Evaluated at build time, so the date is the date the site last shipped. */
const BUILT_AT = new Date().toISOString().slice(0, 10)
const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-edge border-t">
      <div className="shell flex flex-col gap-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="mono text-ink text-sm tracking-[0.2em]">{identity.monogram}</span>
          <p className="label normal-case">{footer.builtWith}</p>
          <a
            href={identity.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-ink-3 hover:text-accent inline-flex h-11 items-center text-[0.75rem] tracking-[0.08em] transition-colors"
          >
            Source
          </a>
        </div>
        <div className="border-edge flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-6">
          <p className="mono text-ink-3 text-[0.6875rem] tracking-[0.08em]">
            &copy; {YEAR} {identity.name}
          </p>
          <p className="mono text-ink-3 text-[0.6875rem] tracking-[0.08em]">{identity.location}</p>
          <p className="mono text-ink-3 text-[0.6875rem] tracking-[0.08em]">
            LAST UPDATED <time dateTime={BUILT_AT}>{BUILT_AT}</time>
          </p>
        </div>
      </div>
    </footer>
  )
}
