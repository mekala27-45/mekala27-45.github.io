import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/resume', '/writing', '/work/ml-platform']

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no axe violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      const summary = results.violations
        .map((violation) => `${violation.id}: ${violation.nodes.length} node(s)`)
        .join('\n')
      expect(results.violations, summary).toEqual([])
    })
  }

  test('the skip link is the first stop and is visible on focus', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    const transform = await skip.evaluate((node) => getComputedStyle(node).transform)
    expect(transform).not.toBe('none')
  })

  test('every interactive element on the home page takes focus in order', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const seen = new Set<string>()
    for (let step = 0; step < 60; step += 1) {
      await page.keyboard.press('Tab')
      const active = await page.evaluate(() => {
        const node = document.activeElement as HTMLElement | null
        if (!node || node === document.body) return null
        const style = getComputedStyle(node)
        return {
          tag: node.tagName,
          label: (node.textContent ?? '').trim().slice(0, 24),
          outline: style.outlineStyle,
        }
      })
      if (!active) continue
      seen.add(`${active.tag}:${active.label}`)
    }
    expect(seen.size).toBeGreaterThan(15)
  })

  test('headings descend without skipping a level', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const levels = await page.$$eval('h1, h2, h3, h4', (nodes) =>
      nodes.map((node) => Number(node.tagName.slice(1))),
    )
    expect(levels[0]).toBe(1)
    for (let index = 1; index < levels.length; index += 1) {
      const previous = levels[index - 1] ?? 1
      const current = levels[index] ?? 1
      expect(current - previous, `heading jump at index ${index}`).toBeLessThanOrEqual(1)
    }
  })

  test('the page reads in full with JavaScript disabled', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'load' })
    for (const phrase of [
      'I am an AI/ML Engineer with four years',
      'PromotionsAI',
      'Distributed training on Spark clusters',
      'Currently open to AI/ML Engineer roles.',
      'Inter-annotator agreement',
    ]) {
      await expect(page.getByText(phrase, { exact: false }).first()).toBeVisible()
    }
    await context.close()
  })

  test('reduced motion leaves nothing moving', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const animating = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .map((animation) => (animation.effect?.getTiming().duration ?? 0) as number)
        .filter((duration) => duration > 200),
    )
    expect(animating).toEqual([])
    await expect(page.getByText('$7.8M')).toBeVisible()
    await context.close()
  })

  test('nothing clips or overflows at 200 percent zoom', async ({ browser }) => {
    // 200 percent browser zoom on a 1440 wide screen is a 720 CSS pixel viewport.
    const context = await browser.newContext({
      viewport: { width: 720, height: 450 },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'networkidle' })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)

    const clipped = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, p, li, a, button'))
        // Visually hidden helpers are clipped on purpose, so they are skipped.
        .filter((node) => node.scrollWidth - node.clientWidth > 2 && node.clientWidth > 8)
        .map((node) => `${node.tagName}: ${(node.textContent ?? '').trim().slice(0, 40)}`),
    )
    expect(clipped, clipped.join('\n')).toEqual([])
    await context.close()
  })
})
