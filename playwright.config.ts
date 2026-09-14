import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100)
const baseURL = `http://127.0.0.1:${PORT}`

/** Set when the machine already has a Chromium, for example a CI image. */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...(executablePath ? { launchOptions: { executablePath, args: ['--no-proxy-server'] } } : {}),
  },
  projects: [
    {
      name: 'mobile-390',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'tablet-834',
      use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 } },
    },
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
