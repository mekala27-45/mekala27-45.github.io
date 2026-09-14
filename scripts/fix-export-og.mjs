/**
 * Static hosts type a file by its extension. The Open Graph routes export as
 * files with no extension, so GitHub Pages serves them as
 * application/octet-stream and no platform will render the card.
 *
 * This renames each one to .png and rewrites the metadata that points at it.
 * Runs automatically as part of `npm run export`.
 */
import { readdirSync, renameSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import path from 'node:path'

const OUT = path.join(process.cwd(), 'out')
const TARGET = 'opengraph-image'
const REWRITABLE = new Set(['.html', '.txt', '.xml', '.json'])

function walk(dir) {
  const found = []
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) found.push(...walk(full))
    else found.push(full)
  }
  return found
}

const files = walk(OUT)

const images = files.filter((file) => path.basename(file) === TARGET)
if (images.length === 0) {
  console.error(`No ${TARGET} files found in out/. The export may have changed shape.`)
  process.exit(1)
}

for (const image of images) {
  renameSync(image, `${image}.png`)
}

// `/opengraph-image` and `/opengraph-image?<hash>` both become `/opengraph-image.png`.
const reference = /\/opengraph-image(\?[A-Za-z0-9]+)?/g
let rewritten = 0

for (const file of files) {
  if (!REWRITABLE.has(path.extname(file))) continue
  const before = readFileSync(file, 'utf8')
  if (!before.includes(TARGET)) continue
  const after = before.replace(reference, '/opengraph-image.png')
  if (after !== before) {
    writeFileSync(file, after)
    rewritten += 1
  }
}

console.warn(
  `Open Graph: renamed ${images.length} image${images.length === 1 ? '' : 's'} to .png, ` +
    `rewrote ${rewritten} file${rewritten === 1 ? '' : 's'}.`,
)
