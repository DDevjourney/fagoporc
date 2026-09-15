/**
 * Genera las imágenes optimizadas de src/assets/ a partir de los originales
 * del cliente en docs/originales/ (fuera del build y del repo).
 *
 *   node scripts/optimize-images.js
 *
 * Cada entrada declara el ancho real al que se muestra la imagen; se exporta
 * a 2x para pantallas de alta densidad. El hero sale en dos anchos para el
 * srcset de los HTML.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../docs/originales')
const OUT = resolve(__dirname, '../src/assets')

const JOBS = [
  // Miniaturas de patógenos: se muestran a 120px máx → 240px.
  { in: 'img-ecolli.jpeg', out: 'img-ecolli.webp', width: 240, height: 240, quality: 80 },
  { in: 'img-salmonella.jpeg', out: 'img-salmonella.webp', width: 240, height: 240, quality: 80 },
  // Hero a ancho completo: dos anchos para srcset.
  { in: 'img-hero.webp', out: 'img-hero-800.webp', width: 800, quality: 75 },
  { in: 'img-hero.webp', out: 'img-hero.webp', width: 1600, quality: 75 },
  // Logos: se muestran a ≤ 240px de ancho → 480px.
  { in: 'logo-piensos-costa.png', out: 'logo-piensos-costa.webp', width: 480, quality: 85, lossless: true },
  { in: 'Logos_Fagoporc-02-cropped.png', out: 'logo-fagoporc.png', width: 480, png: true },
]

for (const job of JOBS) {
  let img = sharp(resolve(SRC, job.in)).resize({
    width: job.width,
    height: job.height,
    fit: job.height ? 'cover' : 'inside',
    withoutEnlargement: true,
  })
  img = job.png
    ? img.png({ compressionLevel: 9, palette: true })
    : img.webp({ quality: job.quality, effort: 6, lossless: job.lossless ?? false })
  const info = await img.toFile(resolve(OUT, job.out))
  console.log(`${job.out.padEnd(28)} ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`)
}
