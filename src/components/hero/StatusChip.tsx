import { statusChip } from '@/content'

export function StatusChip() {
  return (
    <p className="border-edge text-ink-2 inline-flex max-w-full flex-wrap self-start items-center gap-x-2.5 gap-y-1 rounded-full border px-3.5 py-2">
      <span className="status-dot" aria-hidden />
      <span className="mono text-[0.6875rem] tracking-[0.08em] uppercase sm:text-xs">
        {statusChip.primary}
      </span>
      {statusChip.secondary.map((item) => (
        <span key={item} className="inline-flex items-center gap-2.5">
          <span aria-hidden className="bg-edge-strong hidden size-1 rounded-full sm:inline-block" />
          <span className="mono text-ink-3 text-[0.6875rem] tracking-[0.08em] uppercase sm:text-xs">
            {item}
          </span>
        </span>
      ))}
    </p>
  )
}
