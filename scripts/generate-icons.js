import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svg = readFileSync(join(root, 'resources', 'icon.svg'))

const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
]

const resBase = join(root, 'android', 'app', 'src', 'main', 'res')

async function run() {
  // 1. Generate resources/icon.png at 1024x1024
  await sharp(svg)
    .resize(1024, 1024)
    .png()
    .toFile(join(root, 'resources', 'icon.png'))
  console.log('✓ resources/icon.png')

  // 2. Generate each Android mipmap size
  for (const { dir, size } of androidSizes) {
    const outDir = join(resBase, dir)
    mkdirSync(outDir, { recursive: true })

    await sharp(svg).resize(size, size).png().toFile(join(outDir, 'ic_launcher.png'))
    await sharp(svg).resize(size, size).png().toFile(join(outDir, 'ic_launcher_round.png'))
    console.log(`✓ ${dir} (${size}x${size})`)
  }

  console.log('\nAll icons generated.')
}

run().catch(err => { console.error(err); process.exit(1) })
