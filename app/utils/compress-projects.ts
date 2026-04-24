import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import { compressImages } from './img-compress'

const cwd = fileURLToPath(new URL('../../public/projects', import.meta.url))

const files = (
  await fg('**/*.{jpg,jpeg,png,webp}', {
    caseSensitiveMatch: false,
    absolute: true,
    cwd
  })
).sort((a, b) => a.localeCompare(b))

if (files.length === 0) {
  console.warn(`No images found in ${cwd}`)
  process.exit(0)
}

await compressImages(files)
