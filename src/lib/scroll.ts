type Scroller = { scrollTo: (target: string | number | HTMLElement, options?: object) => void }

let scroller: Scroller | null = null

export function setScroller(instance: Scroller | null): void {
  scroller = instance
}

/** Uses the smooth scroller when it is running, native scrolling otherwise. */
export function scrollToTarget(target: string | 'top'): void {
  if (target === 'top') {
    if (scroller) scroller.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const id = target.replace(/^#/, '')
  const element = document.getElementById(id)
  if (!element) return

  if (scroller) scroller.scrollTo(element, { offset: -72 })
  else element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
