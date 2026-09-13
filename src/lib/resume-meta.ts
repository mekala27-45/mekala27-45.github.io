import { statSync } from 'node:fs'
import path from 'node:path'
import { identity } from '@/content'

/** Read at build time so the contact button can state the real file size. */
export function resumeFileSize(): string | null {
  try {
    const file = path.join(process.cwd(), 'public', identity.resumeFileName)
    const bytes = statSync(file).size
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } catch {
    return null
  }
}
