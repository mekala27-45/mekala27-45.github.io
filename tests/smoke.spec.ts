import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  '/',
  '/resume',
  '/writing',
  '/work/promotions-ai',
  '/work/clearance-ai',
  '/work/ml-platform',
  '/work/evaluation',
]

/** Collects anything the browser complains about during a page's life. */
function watchForNoise(page: Page): string[] {
  const noise: string[] = []
  page.on('pageerror', (error) => noise.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      noise.push(`${message.type()}: ${message.text()}`)
    }
  })
  return noise
}

test.describe('smoke', () => {
  for (const route of ROUTES) {
    test(`${route} renders without console noise`, async ({ page }) => {
      const noise = watchForNoise(page)
      const response = await page.goto(route, { waitUntil: 'networkidle' })
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      expect(noise, noise.join('\n')).toEqual([])
    })
  }

  test('home states the name, the role and a headline number', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('AjayMekala')
    await expect(page.getByText('AI/ML ENGINEER').first()).toBeVisible()
    await expect(page.getByText('$7.8M')).toBeVisible()
  })

  test('the resume downloads as a PDF', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('a[download]').first()
    const href = await link.getAttribute('href')
    expect(href).toBe('/Ajay-Mekala-AI-ML-Engineer-Resume.pdf')
    const head = await page.request.get(href ?? '')
    expect(head.status()).toBe(200)
    expect(head.headers()['content-type']).toContain('pdf')
  })

  test('the command palette opens, filters and navigates', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('ControlOrMeta+k')
    const palette = page.getByRole('dialog', { name: 'Command palette' })
    await expect(palette).toBeVisible()
    await page.keyboard.type('clearance')
    await expect(palette.getByText('ClearanceAI')).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/work\/clearance-ai/)
    await expect(page.locator('h1')).toHaveText('ClearanceAI')
  })

  test('the evaluation widget reveals the annotation after a choice', async ({ page }) => {
    await page.goto('/')
    const widget = page.locator('#evaluation')
    await widget.scrollIntoViewIfNeeded()
    await expect(widget.getByText('WHICH RESPONSE IS STRONGER')).toBeVisible()

    // The widget is code split, so on a slow machine the markup is present and
    // clickable before its handler is attached and the first click is swallowed.
    // Retrying the click is the only reliable signal that hydration has landed.
    await expect(async () => {
      await widget.getByRole('button', { name: /CANDIDATE B/ }).click()
      await expect(widget.getByText('FAILURE MODE IN THE WEAKER ANSWER')).toBeVisible({
        timeout: 2000,
      })
    }).toPass({ timeout: 30_000 })

    await expect(widget.getByText('Stronger').first()).toBeVisible()
  })

  test('the capability filter reorders and announces a count', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#capabilities')
    await section.scrollIntoViewIfNeeded()

    // Same code splitting as the evaluation widget: retry until the filter
    // actually takes, rather than assuming the first click is heard.
    await expect(async () => {
      await section.getByRole('button', { name: 'Evaluation', exact: true }).click()
      await expect(section.getByText(/10 capabilities in Evaluation/)).toBeVisible({
        timeout: 2000,
      })
    }).toPass({ timeout: 30_000 })
  })

  test('every section heading is reachable from the page', async ({ page }) => {
    await page.goto('/')
    for (const id of [
      'profile',
      'systems',
      'evaluation',
      'experience',
      'capabilities',
      'writing',
      'contact',
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
  })

  test('no horizontal scrolling at any tested width', async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(0)
    }
  })

  test('no tap target is smaller than 44 pixels', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('a, button, [role="button"]'))
        .filter((node) => {
          const rect = node.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) return false
          const style = getComputedStyle(node)
          if (style.visibility === 'hidden' || style.display === 'contents') return false
          // Links inside a paragraph are exempt, the rule is about controls.
          if (node.closest('p')) return false
          return rect.height < 44
        })
        .map((node) => `${node.tagName} ${(node.textContent ?? '').trim().slice(0, 30)}`),
    )
    expect(small, small.join('\n')).toEqual([])
  })

  test('sitemap and robots are served', async ({ page }) => {
    const sitemap = await page.request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('/work/ml-platform')
    const robots = await page.request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Sitemap:')
  })

  test('the Open Graph card renders at 1200 by 630', async ({ page }) => {
    const image = await page.request.get('/opengraph-image')
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/png')
    const body = await image.body()
    // PNG header: width and height are big endian uint32 at byte 16 and 20.
    expect(body.readUInt32BE(16)).toBe(1200)
    expect(body.readUInt32BE(20)).toBe(630)
  })
})
