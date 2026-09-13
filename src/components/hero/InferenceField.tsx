'use client'

import { useEffect, useRef } from 'react'
import { FRAGMENT, VERTEX } from './inference-field-shaders'

type InferenceFieldProps = {
  /** Field strength as the design calls it: 0.3 in the hero, 0.15 at the foot.
   *  Multiplied by GAIN below to land at that apparent density on screen. */
  opacity: number
  /** A single frame is drawn and the loop never starts. */
  staticFrame: boolean
  pointer: boolean
}

const POINT_COUNT = 40000
const MAX_DPR = 1.5
const FRAME_MS = 1000 / 30

/** A single point contributes a fraction of its alpha once the soft edge and
 *  the per point variation are applied, so the strength is scaled back up. */
const GAIN = 2

/** sRGB form of the accent tokens, so the field matches the theme exactly. */
const ACCENT_DARK: [number, number, number] = [0.0, 0.8439, 0.8502]
const ACCENT_LIGHT: [number, number, number] = [0.0, 0.5471, 0.558]

export default function InferenceField({ opacity, staticFrame, pointer }: InferenceFieldProps) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = host.current
    if (!container) return

    let disposed = false
    let cleanup: (() => void) | undefined

    const boot = async () => {
      const { Renderer, Geometry, Program, Mesh } = await import('ogl')
      if (disposed) return

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const renderer = new Renderer({
        dpr,
        alpha: true,
        antialias: false,
        depth: false,
        webgl: 1,
        premultipliedAlpha: false,
      })
      const gl = renderer.gl
      gl.clearColor(0, 0, 0, 0)
      gl.canvas.setAttribute('aria-hidden', 'true')
      gl.canvas.style.width = '100%'
      gl.canvas.style.height = '100%'
      gl.canvas.style.display = 'block'
      container.appendChild(gl.canvas)

      const positions = new Float32Array(POINT_COUNT * 3)
      const seeds = new Float32Array(POINT_COUNT)
      for (let i = 0; i < POINT_COUNT; i += 1) {
        positions[i * 3] = Math.random() * 2.3 - 1.15
        positions[i * 3 + 1] = Math.random() * 2.2 - 1.1
        positions[i * 3 + 2] = Math.random() * 2 - 1
        seeds[i] = Math.random()
      }

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        seed: { size: 1, data: seeds },
      })

      const isLight = document.documentElement.getAttribute('data-theme') === 'light'

      const program = new Program(gl, {
        vertex: VERTEX,
        fragment: FRAGMENT,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        cullFace: false,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1] },
          uPointer: { value: [-9999, -9999] },
          uPointerActive: { value: 0 },
          uDpr: { value: dpr },
          uAspect: { value: 1 },
          uColor: { value: isLight ? ACCENT_LIGHT : ACCENT_DARK },
          uOpacity: { value: opacity * GAIN },
        },
      })

      const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program })

      /** Points build up against the near black surface and stay honest on white. */
      const applyBlend = (light: boolean) => {
        if (light) program.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        else program.setBlendFunc(gl.SRC_ALPHA, gl.ONE)
      }
      applyBlend(isLight)

      const resize = () => {
        const rect = container.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width))
        const height = Math.max(1, Math.round(rect.height))
        renderer.setSize(width, height)
        program.uniforms.uResolution.value = [width * dpr, height * dpr]
        program.uniforms.uAspect.value = width / height
      }

      resize()
      const observer = new ResizeObserver(resize)
      observer.observe(container)

      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const rect = container.getBoundingClientRect()
        program.uniforms.uPointer.value = [
          (event.clientX - rect.left) * dpr,
          (rect.height - (event.clientY - rect.top)) * dpr,
        ]
        program.uniforms.uPointerActive.value = 1
      }

      const onPointerLeave = () => {
        program.uniforms.uPointerActive.value = 0
      }

      if (pointer) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('pointerleave', onPointerLeave)
      }

      const themeObserver = new MutationObserver(() => {
        const light = document.documentElement.getAttribute('data-theme') === 'light'
        program.uniforms.uColor.value = light ? ACCENT_LIGHT : ACCENT_DARK
        applyBlend(light)
        if (staticFrame) renderer.render({ scene: mesh })
      })
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      })

      if (staticFrame) {
        program.uniforms.uTime.value = 12
        renderer.render({ scene: mesh })
        cleanup = () => {
          observer.disconnect()
          themeObserver.disconnect()
          gl.canvas.remove()
        }
        return
      }

      let frame = 0
      let last = 0
      let running = true
      const start = performance.now()

      const loop = (now: number) => {
        frame = requestAnimationFrame(loop)
        if (!running) return
        if (now - last < FRAME_MS) return
        last = now
        program.uniforms.uTime.value = (now - start) / 1000
        renderer.render({ scene: mesh })
      }

      frame = requestAnimationFrame(loop)

      const onVisibility = () => {
        running = document.visibilityState === 'visible'
      }
      document.addEventListener('visibilitychange', onVisibility)

      cleanup = () => {
        cancelAnimationFrame(frame)
        observer.disconnect()
        themeObserver.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
        gl.canvas.remove()
      }
    }

    void boot()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [opacity, pointer, staticFrame])

  return <div ref={host} aria-hidden className="absolute inset-0" />
}
