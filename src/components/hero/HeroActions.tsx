'use client'

import * as m from 'motion/react-m'
import { hero, identity } from '@/content'
import { useMagnetic } from '@/hooks/useMagnetic'
import { buttonClasses } from '@/components/primitives/Button'
import { scrollToTarget } from '@/lib/scroll'
import { track } from '@/lib/analytics'

export function HeroActions() {
  const primary = useMagnetic()
  const secondary = useMagnetic()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <m.a
        ref={primary.ref}
        href={hero.primaryCta.href}
        onPointerMove={primary.onPointerMove}
        onPointerLeave={primary.onPointerLeave}
        onClick={(event) => {
          event.preventDefault()
          scrollToTarget(hero.primaryCta.href)
        }}
        style={{ x: primary.x, y: primary.y }}
        className={buttonClasses('primary', 'lg')}
      >
        {hero.primaryCta.label}
      </m.a>

      <m.a
        ref={secondary.ref}
        href={identity.resumePath}
        download={identity.resumeFileName}
        onPointerMove={secondary.onPointerMove}
        onPointerLeave={secondary.onPointerLeave}
        onClick={() => track('resume_download', { source: 'hero' })}
        style={{ x: secondary.x, y: secondary.y }}
        className={buttonClasses('ghost', 'lg')}
      >
        {hero.secondaryCta.label}
      </m.a>
    </div>
  )
}
