/**
 * Runs a Lighthouse mobile audit against a local production build and writes
 * the report into lighthouse/. Start the server first:
 *   npm run build && npm start
 *   npm run lighthouse
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const url = process.argv[2] ?? process.env.LIGHTHOUSE_URL ?? 'http://127.0.0.1:3000/'
const outDir = path.join(process.cwd(), 'lighthouse')
mkdirSync(outDir, { recursive: true })

const chrome = await launch({
  chromeFlags: [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--no-proxy-server',
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
})

try {
  const result = await lighthouse(
    url,
    { port: chrome.port, output: ['json', 'html'], logLevel: 'error' },
    undefined,
  )
  if (!result) throw new Error('Lighthouse returned no result')

  const { categories } = result.lhr
  const scores = Object.fromEntries(
    Object.entries(categories).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]),
  )
  const metrics = {
    LCP: result.lhr.audits['largest-contentful-paint']?.displayValue,
    TBT: result.lhr.audits['total-blocking-time']?.displayValue,
    CLS: result.lhr.audits['cumulative-layout-shift']?.displayValue,
    FCP: result.lhr.audits['first-contentful-paint']?.displayValue,
    SpeedIndex: result.lhr.audits['speed-index']?.displayValue,
  }

  writeFileSync(path.join(outDir, 'report.json'), result.report[0] ?? '')
  writeFileSync(path.join(outDir, 'report.html'), result.report[1] ?? '')
  writeFileSync(
    path.join(outDir, 'summary.json'),
    JSON.stringify({ url, scores, metrics, generatedAt: new Date().toISOString() }, null, 2),
  )

  console.warn(JSON.stringify({ scores, metrics }, null, 2))
} finally {
  await chrome.kill()
}
