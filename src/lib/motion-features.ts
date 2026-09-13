/**
 * Loaded lazily by LazyMotion after first paint. Keeping the feature bundle
 * out of the entry chunk is worth roughly 50KB gzipped on the home route.
 * domMax is needed because the nav indicator uses a shared layout animation.
 */
export { domMax as default } from 'motion/react'
