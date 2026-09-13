import localFont from 'next/font/local'

/**
 * Three self-hosted variable faces, latin subset only, preloaded.
 * Everything is served from the same origin so there is no third-party
 * connection on the critical path and no layout shift on swap.
 */

export const display = localFont({
  src: '../fonts/archivo-latin-var.woff2',
  variable: '--face-display',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const body = localFont({
  src: '../fonts/inter-latin-var.woff2',
  variable: '--face-body',
  display: 'swap',
  weight: '100 900',
  style: 'normal',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const mono = localFont({
  src: '../fonts/jetbrains-mono-latin-var.woff2',
  variable: '--face-mono',
  display: 'swap',
  weight: '100 800',
  style: 'normal',
  preload: true,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

export const fontVariables = [display.variable, body.variable, mono.variable].join(' ')
