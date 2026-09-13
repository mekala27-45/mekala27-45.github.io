import { expect, test } from '@playwright/test'

/**
 * Snapshots run on the gradient fallback rather than the particle field, so
 * the images are deterministic. Reduced motion holds every reveal at its
 * final state.
 */
test.use({ reducedMotion: 'reduce' })

const SECTIONS = ['profile', 'systems', 'evaluation', 'experience', 'capabilities', 'contact']

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 2 })
  })
})

test('hero', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await expect(page).toHaveScreenshot('hero.png', { animations: 'disabled' })
})

for (const id of SECTIONS) {
  test(`section ${id}`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(700)
    await expect(page).toHaveScreenshot(`section-${id}.png`, { animations: 'disabled' })
  })
}

test('case study page', async ({ page }) => {
  await page.goto('/work/promotions-ai', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await expect(page).toHaveScreenshot('case-study.png', { animations: 'disabled' })
})

test('resume page', async ({ page }) => {
  await page.goto('/resume', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await expect(page).toHaveScreenshot('resume.png', { animations: 'disabled', fullPage: true })
})

test('light theme hero', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await expect(page).toHaveScreenshot('hero-light.png', { animations: 'disabled' })
})
