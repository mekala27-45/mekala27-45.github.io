type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

/**
 * Defers non-critical setup past hydration so it does not compete with the
 * first interaction. Returns a cancel function.
 */
export function whenIdle(task: () => void, timeout = 1200): () => void {
  if (typeof window === 'undefined') return () => {}
  const host = window as IdleWindow

  if (typeof host.requestIdleCallback === 'function') {
    const handle = host.requestIdleCallback(task, { timeout })
    return () => host.cancelIdleCallback?.(handle)
  }

  const timer = setTimeout(task, 200)
  return () => clearTimeout(timer)
}

const INTENT_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown', 'scroll'] as const

/**
 * Waits for the first sign that someone intends to move through the page.
 * The smooth scroller and the pinned sequence are useless before that, so
 * neither library is fetched or run during the initial load.
 */
export function whenIntentToScroll(task: () => void, fallbackMs = 4000): () => void {
  if (typeof window === 'undefined') return () => {}

  let done = false
  const run = () => {
    if (done) return
    done = true
    cleanup()
    task()
  }

  const timer = setTimeout(run, fallbackMs)
  const cleanup = () => {
    clearTimeout(timer)
    for (const event of INTENT_EVENTS) window.removeEventListener(event, run)
  }

  for (const event of INTENT_EVENTS) {
    window.addEventListener(event, run, { once: true, passive: true })
  }

  return cleanup
}
