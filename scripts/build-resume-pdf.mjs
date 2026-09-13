/**
 * Prints /resume to public/ as the downloadable PDF, so the file people
 * download and the page crawlers read can never drift apart.
 *
 * Usage: npm run build && npm start, then `npm run resume:pdf`
 * (or pass a base URL: `node scripts/build-resume-pdf.mjs http://localhost:3000`)
 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const baseUrl = process.argv[2] ?? process.env.RESUME_BASE_URL ?? 'http://127.0.0.1:3000'
const outFile = path.join(process.cwd(), 'public', 'Ajay-Mekala-AI-ML-Engineer-Resume.pdf')

mkdirSync(path.dirname(outFile), { recursive: true })

// PLAYWRIGHT_CHROMIUM_PATH lets a CI image reuse a Chromium it already has.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH
const isLocal = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])/.test(baseUrl)

const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  // A proxy in the environment would swallow the localhost asset requests and
  // print an unstyled page, which is silent and easy to miss.
  ...(isLocal ? { args: ['--no-proxy-server'] } : {}),
})
const page = await browser.newPage()

await page.goto(`${baseUrl}/resume`, { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'print', colorScheme: 'light' })
await page.evaluate(() => document.fonts.ready)

await page.pdf({
  path: outFile,
  format: 'Letter',
  printBackground: false,
  margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
})

await browser.close()
console.warn(`Wrote ${outFile}`)
