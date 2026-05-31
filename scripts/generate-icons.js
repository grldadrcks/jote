import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svg = readFileSync(join(root, 'resources', 'icon.svg'))
const fgSvg = readFileSync(join(root, 'resources', 'icon-foreground.svg'))

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48,  fgSize: 108 },
  { dir: 'mipmap-hdpi',    size: 72,  fgSize: 162 },
  { dir: 'mipmap-xhdpi',   size: 96,  fgSize: 216 },
  { dir: 'mipmap-xxhdpi',  size: 144, fgSize: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
]

const resBase = join(root, 'android', 'app', 'src', 'main', 'res')

async function run() {
  await sharp(svg).resize(1024, 1024).png().toFile(join(root, 'resources', 'icon.png'))
  console.log('✓ resources/icon.png')

  for (const { dir, size, fgSize } of androidSizes) {
    const outDir = join(resBase, dir)
    mkdirSync(outDir, { recursive: true })

    await sharp(svg).resize(size, size).png().toFile(join(outDir, 'ic_launcher.png'))
    await sharp(svg).resize(size, size).png().toFile(join(outDir, 'ic_launcher_round.png'))
    await sharp(fgSvg).resize(fgSize, fgSize).png().toFile(join(outDir, 'ic_launcher_foreground.png'))
    console.log(`✓ ${dir} (icon: ${size}px, foreground: ${fgSize}px)`)
  }

  console.log('\nAll icons generated.')
}

run().catch(err => { console.error(err); process.exit(1) })
