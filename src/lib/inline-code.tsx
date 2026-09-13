import { Fragment, type ReactNode } from 'react'

const SEGMENT = /(`[^`]+`)/g

/** Renders backtick spans in content strings as real inline code. */
export function renderInlineCode(text: string): ReactNode {
  const parts = text.split(SEGMENT).filter((part) => part.length > 0)

  return parts.map((part, index) => {
    const key = `${index}-${part.slice(0, 10)}`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={key}
          className="bg-sunken border-edge text-ink rounded border px-1 py-0.5 text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}
