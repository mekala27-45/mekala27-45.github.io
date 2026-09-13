type ViewTransition = { ready: Promise<void>; finished: Promise<void> }

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}

export const MORPH_NAME = 'case-study-title'

/** Set while a route transition is in flight, read by the destination title. */
let pendingMorph: string | null = null

export function supportsViewTransitions(): boolean {
  return (
    typeof document !== 'undefined' &&
    typeof (document as DocumentWithViewTransition).startViewTransition === 'function'
  )
}

export function claimMorph(id: string): boolean {
  if (pendingMorph !== id) return false
  pendingMorph = null
  return true
}

type RouteTransitionOptions = {
  morphId: string
  morphFrom: HTMLElement | null
  navigate: () => void
  /** Resolves when the destination route has rendered. */
  settled: Promise<void>
}

/**
 * Cross-document style transition for a client side route change. The source
 * title is named just before the snapshot and unnamed again afterwards, so a
 * named element never sits on the page interfering with the theme switch.
 */
export function runRouteTransition({
  morphId,
  morphFrom,
  navigate,
  settled,
}: RouteTransitionOptions): boolean {
  const doc = document as DocumentWithViewTransition
  if (typeof doc.startViewTransition !== 'function') return false

  pendingMorph = morphId
  const root = document.documentElement
  root.dataset.vtMode = 'route'
  if (morphFrom) morphFrom.style.viewTransitionName = MORPH_NAME

  const transition = doc.startViewTransition(() => {
    navigate()
    return settled
  })

  const cleanup = () => {
    if (morphFrom) morphFrom.style.removeProperty('view-transition-name')
    delete root.dataset.vtMode
    pendingMorph = null
  }

  void transition.finished.then(cleanup, cleanup)
  return true
}

type ThemeTransitionOptions = {
  origin: { x: number; y: number }
  apply: () => void
}

/** Circular reveal out of the toggle button. */
export function runThemeTransition({ origin, apply }: ThemeTransitionOptions): boolean {
  const doc = document as DocumentWithViewTransition
  if (typeof doc.startViewTransition !== 'function') return false

  const root = document.documentElement
  root.dataset.vtMode = 'theme'

  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  )

  const transition = doc.startViewTransition(apply)

  void transition.ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 520,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })

  const cleanup = () => {
    delete root.dataset.vtMode
  }
  void transition.finished.then(cleanup, cleanup)
  return true
}
