// Runs inside toolkit.artlist.io — has full access to the authenticated page

function extractArtlistData() {
  const url = window.location.href
  const params = new URLSearchParams(window.location.search)

  const assetId = params.get('assetId') || ''
  const width = params.get('assetWidth') || '1280'
  const height = params.get('assetHeight') || '720'
  const ratio = params.get('assetAspectRatio') || '16:9'

  // Try to grab direct video URL from any <video> element
  const video = document.querySelector('video')
  const videoSrc = video?.currentSrc || video?.src || null

  // Try to find the prompt text — look for large textarea or visible text blocks
  let promptText = null

  const textareas = Array.from(document.querySelectorAll('textarea'))
  for (const ta of textareas) {
    if (ta.value && ta.value.trim().length > 30) {
      promptText = ta.value.trim()
      break
    }
  }

  // Fallback: look for input fields with prompt-like content
  if (!promptText) {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'))
    for (const input of inputs) {
      if (input.value && input.value.trim().length > 30) {
        promptText = input.value.trim()
        break
      }
    }
  }

  // Fallback: look for visible text that looks like a prompt (long sentence)
  if (!promptText) {
    const candidates = Array.from(document.querySelectorAll('p, span'))
    for (const el of candidates) {
      const text = el.innerText?.trim()
      if (text && text.length > 60 && text.length < 1500 && !el.closest('nav,header,footer')) {
        promptText = text
        break
      }
    }
  }

  // Detect AI model from page text
  const pageText = document.body.innerText.toLowerCase()
  const modelMap = {
    'sora': 'sora',
    'runway': 'runway',
    'veo': 'veo',
    'kling': 'kling',
    'gen-3': 'runway',
    'gen-4': 'runway',
    'luma': 'other',
    'pika': 'other',
  }
  let aiModel = 'other'
  for (const [keyword, model] of Object.entries(modelMap)) {
    if (pageText.includes(keyword)) {
      aiModel = model
      break
    }
  }

  return { url, assetId, width, height, ratio, videoSrc, promptText, aiModel }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    sendResponse(extractArtlistData())
  }
})
