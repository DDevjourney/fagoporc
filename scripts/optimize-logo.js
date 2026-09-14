import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname, '../src/assets/Logos_Fagoporc-02-cropped.png')
const outWebp = resolve(__dirname, '../src/assets/logo-fagoporc.webp')
const outPng = resolve(__dirname, '../src/assets/logo-fagoporc.png')

const targetWidth = 480

const meta = await sharp(src).metadata()
console.log(`Source: ${meta.width}×${meta.height}, ~${Math.round((meta.size || 0) / 1024)} KB`)

await sharp(src)
  .resize({ width: targetWidth, withoutEnlargement: true })
  .webp({ quality: 85, effort: 6 })
  .toFile(outWebp)

await sharp(src)
  .resize({ width: targetWidth, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true })
  .toFile(outPng)

const { size: webpSize } = await sharp(outWebp).metadata()
const { size: pngSize } = await sharp(outPng).metadata()
console.log(`Output WebP: ${targetWidth}px, ~${Math.round(webpSize / 1024)} KB`)
console.log(`Output PNG (fallback): ${targetWidth}px, ~${Math.round(pngSize / 1024)} KB`)
