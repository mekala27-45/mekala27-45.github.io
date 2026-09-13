import { trustBar } from '@/content'
import { Marquee } from '@/components/primitives/Marquee'

export function TrustBar() {
  return (
    <section
      aria-label="Organizations the work has shipped for"
      className="bg-sunken border-edge border-y"
    >
      <div className="shell-bleed py-7">
        <p className="label mb-4 text-[0.6875rem]">{trustBar.label}</p>
      </div>
      <div className="pb-7">
        <Marquee items={trustBar.organizations} />
      </div>
    </section>
  )
}
