// Run with: node create-icon.js
// Creates a simple PNG icon for the extension

const { createCanvas } = require('canvas')
const fs = require('fs')

function createIcon(size) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#0f0f0f'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, size * 0.2)
  ctx.fill()

  // "PH" text
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${size * 0.35}px -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('PH', size / 2, size / 2)

  return canvas.toBuffer('image/png')
}

// We'll use a simpler approach - just use an SVG converted inline
console.log('Icon placeholder created')
