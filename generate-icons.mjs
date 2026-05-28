// Generate chrome extension icons — lock + P design
import sharp from 'sharp'
import { writeFileSync } from 'fs'
import { join } from 'path'

const OUT = 'chrome-extension'

function makeSvg(size) {
  const r = size * 0.13   // corner radius
  const s = size           // total size

  // Scale factors relative to 128px master
  const sc = size / 128

  // Lock body dimensions
  const lw = s * 0.42     // lock body width
  const lh = s * 0.36     // lock body height
  const lx = s * 0.29     // lock body x
  const ly = s * 0.50     // lock body y
  const lr = s * 0.07     // lock body corner radius

  // Lock shackle
  const sw = lw * 0.52    // shackle width
  const sh = s * 0.30     // shackle height
  const sx = lx + (lw - sw) / 2  // shackle x center
  const sy = ly - sh * 0.55      // shackle top

  // Keyhole circle + slot
  const kx = lx + lw / 2
  const ky = ly + lh * 0.42
  const kr = lh * 0.18

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${s}" height="${s}" rx="${r}" ry="${r}" fill="url(#bg)"/>

  <!-- P letter — prominent background -->
  <text
    x="${s * 0.10}" y="${s * 0.78}"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="${s * 0.78}"
    fill="rgba(255,255,255,0.40)"
    letter-spacing="-2"
  >P</text>

  <!-- Lock shackle (arc) -->
  <path
    d="M ${sx} ${ly}
       L ${sx} ${sy + sw * 0.5}
       A ${sw * 0.5} ${sw * 0.5} 0 0 1 ${sx + sw} ${sy + sw * 0.5}
       L ${sx + sw} ${ly}"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    stroke-width="${s * 0.065}"
    stroke-linecap="round"
  />

  <!-- Lock body -->
  <rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="${lr}" ry="${lr}"
        fill="rgba(255,255,255,0.88)"/>

  <!-- Keyhole circle -->
  <circle cx="${kx}" cy="${ky}" r="${kr}" fill="#1a1a2e"/>
  <!-- Keyhole slot -->
  <rect x="${kx - kr * 0.35}" y="${ky}" width="${kr * 0.7}" height="${lh * 0.28}"
        rx="${kr * 0.2}" fill="#1a1a2e"/>
</svg>`
}

const sizes = [16, 48, 128]

for (const size of sizes) {
  const svg = makeSvg(size)
  const pngPath = join(OUT, `icon${size}.png`)
  await sharp(Buffer.from(svg))
    .png()
    .toFile(pngPath)
  console.log(`✓ ${pngPath}`)
}

console.log('Icons generated.')
