import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

/**
 * STATIC_EXPORT=true produces a fully static /out directory for GitHub Pages.
 * The default build targets Vercel, where image optimization and analytics run.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport ? { output: 'export' as const, images: { unoptimized: true } } : {}),
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

export default withBundleAnalyzer(nextConfig)
