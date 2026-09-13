import { Fragment, type ReactNode } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|##[^#]+##)/g

/**
 * Two markers only: `**system**` for a named system or organisation, and
 * `##figure##` for a number. Nothing else in the content layer carries markup.
 */
export function renderRich(text: string): ReactNode {
  const parts = text.split(TOKEN).filter((part) => part.length > 0)

  return parts.map((part, index) => {
    const key = `${index}-${part.slice(0, 8)}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('##') && part.endsWith('##')) {
      return <b key={key}>{part.slice(2, -2)}</b>
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}
