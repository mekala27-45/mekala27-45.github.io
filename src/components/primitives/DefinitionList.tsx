import type { SpecRow } from '@/content/schema'

type DefinitionListProps = {
  rows: readonly SpecRow[]
}

export function DefinitionList({ rows }: DefinitionListProps) {
  return (
    <dl className="divide-edge divide-y">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3.5 first:pt-0">
          <dt className="label pt-0.5">{row.label}</dt>
          <dd className="text-ink text-[0.9375rem] leading-relaxed">
            {row.values.map((value) => (
              <span key={value} className="block">
                {value}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}
