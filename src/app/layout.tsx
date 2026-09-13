import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { fontVariables } from '@/lib/fonts'
import { themeScript } from '@/lib/theme-script'
import { identity, seo, SITE_URL } from '@/content'
import '@/content/validate'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/sections/Footer'
import { RevealEngine } from '@/components/system/RevealEngine'
import { SmoothScroll } from '@/components/system/SmoothScroll'
import { ScrollDepth } from '@/components/system/ScrollDepth'
import { PersonSchema } from '@/components/system/PersonSchema'
import { MotionProvider } from '@/components/system/MotionProvider'
import './globals.css'

const Analytics = dynamic(() => import('@vercel/analytics/next').then((mod) => mod.Analytics))
const SpeedInsights = dynamic(() =>
  import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
)

/** The insight endpoints only exist on Vercel, so anywhere else the scripts
 *  would be two 404s in the console and a Best Practices hit in Lighthouse. */
const analyticsEnabled = process.env.STATIC_EXPORT !== 'true' && Boolean(process.env.VERCEL_ENV)

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.title, template: '%s' },
  description: seo.description,
  applicationName: identity.name,
  authors: [{ name: identity.name, url: SITE_URL }],
  creator: identity.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    title: seo.title,
    description: seo.description,
    url: SITE_URL,
    siteName: seo.title,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#07090e' },
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <PersonSchema />
      </head>
      <body className="bg-canvas text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="grain" aria-hidden />
        <MotionProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
        <RevealEngine />
        <SmoothScroll />
        <ScrollDepth />
        {analyticsEnabled ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  )
}
