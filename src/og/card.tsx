import { readFileSync } from 'node:fs'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 } as const
export const OG_CONTENT_TYPE = 'image/png'

/** Subset instances of the site faces. Satori cannot read woff2. */
const fontFile = (name: string) =>
  readFileSync(path.join(process.cwd(), 'src', 'og', 'fonts', name))

type CardMetric = { value: string; label: string; tone?: 'accent' | 'warm' }

type CardProps = {
  eyebrow: string
  title: string
  /** The line under the title. A case study card names the person, because
   *  that is what a shared link has to identify. */
  byline: string
  metrics: readonly CardMetric[]
}

const CANVAS = '#07090e'
const ACCENT = '#00d7d9'
const INK = '#f3f4f6'
const INK_3 = '#8b929e'
const WARM = '#f9ad26'

/** One shared card so every route renders the same object with its own copy. */
export function renderCard({ eyebrow, title, byline, metrics }: CardProps): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: CANVAS,
        backgroundImage: `radial-gradient(900px 520px at 12% 0%, rgba(0,215,217,0.20), transparent 62%), radial-gradient(700px 420px at 96% 108%, rgba(0,215,217,0.12), transparent 60%)`,
        padding: '64px 72px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1200,
          height: 4,
          background: ACCENT,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div
          style={{
            fontFamily: 'JetBrains',
            fontSize: 22,
            letterSpacing: 3.2,
            color: ACCENT,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontFamily: 'Archivo',
            fontSize: title.length > 26 ? 74 : 92,
            lineHeight: 1.02,
            letterSpacing: -2.6,
            color: INK,
            maxWidth: 960,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains',
            fontSize: 22,
            letterSpacing: 2.2,
            color: INK_3,
            textTransform: 'uppercase',
          }}
        >
          {byline}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 56 }}>
        {metrics.map((metric) => (
          <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                fontFamily: 'Archivo',
                fontSize: 46,
                color: metric.tone === 'warm' ? WARM : INK,
                letterSpacing: -1.4,
              }}
            >
              {metric.value}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains',
                fontSize: 17,
                letterSpacing: 2,
                color: INK_3,
                textTransform: 'uppercase',
                maxWidth: 260,
              }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Archivo', data: fontFile('archivo-600.ttf'), weight: 600, style: 'normal' },
        { name: 'JetBrains', data: fontFile('jetbrains-500.ttf'), weight: 500, style: 'normal' },
      ],
    },
  )
}
