// Injected into toolkit.artlist.io

const HUB_URL = 'https://production-hub-omega-five.vercel.app'
const EXTENSION_VERSION = '2.5.0'
let projects = []
let savedPrompts = []
let isAuthenticated = false
let buttonMode = 'hover'        // 'hover' | 'fab' | 'off'
let showInsertPrompt = true     // show ⚡ Insert Prompt button near textarea
let showSaveToLibrary = true    // (website-side, read by PromptCard)

console.log('[Prompt Manager] content script loaded on', location.href, '| version', EXTENSION_VERSION)
// Let the web app detect which extension version is installed
document.documentElement.setAttribute('data-pm-ext-version', EXTENSION_VERSION)

// ── Version check — show banner if outdated ───────────────────────────────────
async function checkForUpdate() {
  try {
    const res = await fetch(`${HUB_URL}/api/extension/version`, { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    if (data.version && data.version !== EXTENSION_VERSION) {
      showUpdateBanner(data.version, data.downloadUrl)
    }
  } catch(e) {
    console.log('[Prompt Manager] version check failed (non-critical):', e.message)
  }
}

function showUpdateBanner(newVersion, downloadUrl) {
  if (document.getElementById('pm-update-banner')) return
  const banner = document.createElement('div')
  banner.id = 'pm-update-banner'
  banner.style.cssText = `
    position:fixed;top:0;left:0;right:0;z-index:2147483647;
    background:linear-gradient(90deg,#1a1a2e,#16213e);
    color:#fff;padding:10px 20px;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:13px;font-weight:500;
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    border-bottom:1px solid rgba(255,255,255,0.1);
    box-shadow:0 2px 20px rgba(0,0,0,0.5);
  `
  banner.innerHTML = `
    <span style="display:flex;align-items:center;gap:8px">
      <span style="font-size:16px">🔄</span>
      <span>A new version of <strong>Prompt Manager extension</strong> is available (v${esc(newVersion)}).
        Your version is v${EXTENSION_VERSION}.</span>
    </span>
    <span style="display:flex;align-items:center;gap:10px;shrink:0">
      <a href="${esc(downloadUrl)}" target="_blank"
         style="background:#fff;color:#000;text-decoration:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:700;white-space:nowrap">
        Update →
      </a>
      <button id="pm-banner-close"
              style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;line-height:1;padding:0 4px">
        ×
      </button>
    </span>
  `
  document.body.appendChild(banner)
  document.getElementById('pm-banner-close').addEventListener('click', () => banner.remove())
}

async function initExtension() {
  // Step 1: auth check — isolated so data-load errors don't reset auth state
  try {
    console.log('[Prompt Manager] checking auth...')
    const res = await fetch(`${HUB_URL}/api/auth/me`, { credentials: 'include' })
    console.log('[Prompt Manager] auth response status:', res.status)
    if (!res.ok) { isAuthenticated = false; console.log('[Prompt Manager] not authenticated'); return }
    isAuthenticated = true
    console.log('[Prompt Manager] authenticated ✓')
  } catch(e) {
    console.log('[Prompt Manager] auth fetch failed:', e.message)
    isAuthenticated = false
    return
  }

  // Step 2: load data — failures here do NOT affect isAuthenticated
  try {
    const [projRes, promptRes] = await Promise.all([
      fetch(`${HUB_URL}/api/extension/projects`, { credentials: 'include' }),
      fetch(`${HUB_URL}/api/saved-prompts`, { credentials: 'include' }),
    ])
    if (projRes.ok) projects = await projRes.json()
    if (promptRes.ok) savedPrompts = await promptRes.json()
    console.log('[Prompt Manager] loaded', projects.length, 'projects,', savedPrompts.length, 'prompts')
  } catch(e) {
    console.log('[Prompt Manager] data fetch failed (non-critical):', e.message)
  }
}

initExtension()
// Check for updates in parallel (non-blocking)
checkForUpdate()

// ── Load all settings from storage + listen for changes ──────────────────────
chrome.storage.local.get(['buttonMode', 'showInsertPrompt', 'showSaveToLibrary'], (result) => {
  buttonMode       = result.buttonMode       ?? 'hover'
  showInsertPrompt = result.showInsertPrompt ?? true
  showSaveToLibrary = result.showSaveToLibrary ?? true
  applyButtonMode()
})

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return
  if (changes.buttonMode)       { buttonMode       = changes.buttonMode.newValue;       applyButtonMode() }
  if (changes.showInsertPrompt) { showInsertPrompt = changes.showInsertPrompt.newValue }
  if (changes.showSaveToLibrary) { showSaveToLibrary = changes.showSaveToLibrary.newValue }
})

// ── Re-check auth + reload data (called after login popup closes) ─────────────
async function recheckAndReload() {
  try {
    const res = await fetch(`${HUB_URL}/api/auth/me`, { credentials: 'include' })
    if (!res.ok) { isAuthenticated = false; return false }
    isAuthenticated = true
    const [projRes, promptRes] = await Promise.all([
      fetch(`${HUB_URL}/api/extension/projects`, { credentials: 'include' }),
      fetch(`${HUB_URL}/api/saved-prompts`, { credentials: 'include' }),
    ]).catch(() => [null, null])
    if (projRes?.ok) projects = await projRes.json()
    if (promptRes?.ok) savedPrompts = await promptRes.json()
    console.log('[Prompt Manager] re-auth OK, projects:', projects.length)
    return true
  } catch(e) {
    console.log('[Prompt Manager] re-auth failed:', e.message)
    isAuthenticated = false
    return false
  }
}

// Open login popup and wait for it to close, then re-check auth
function openLoginAndWait(onSuccess) {
  const popup = window.open(`${HUB_URL}/login`, '_blank', 'width=440,height=540,left=200,top=100')
  if (!popup) { window.open(`${HUB_URL}/login`, '_blank'); return }
  const timer = setInterval(async () => {
    if (popup.closed) {
      clearInterval(timer)
      const ok = await recheckAndReload()
      if (ok && onSuccess) onSuccess()
    }
  }, 800)
}

// ── Hover button: Save to Prompt Manager ─────────────────────────────────────
const saveBtn = document.createElement('button')
saveBtn.textContent = '🎬 Save to Prompt Manager'
saveBtn.style.cssText = `
  position:fixed;z-index:2147483647;
  background:rgba(10,10,10,0.92);color:#fff;
  border:1px solid rgba(255,255,255,0.22);border-radius:8px;
  padding:7px 15px;font-size:13px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  font-weight:600;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,0.6);
  backdrop-filter:blur(6px);
  display:none;pointer-events:auto;
`
document.body.appendChild(saveBtn)

// ── FAB: fixed corner button ──────────────────────────────────────────────────
const fabBtn = document.createElement('button')
fabBtn.title = 'Save to Prompt Manager'
fabBtn.style.cssText = `
  position:fixed;z-index:2147483647;
  bottom:22px;right:22px;
  width:48px;height:48px;border-radius:50%;
  background:rgba(10,10,10,0.92);color:#fff;
  border:1px solid rgba(255,255,255,0.22);
  cursor:pointer;font-size:20px;line-height:1;
  box-shadow:0 4px 24px rgba(0,0,0,0.7);
  backdrop-filter:blur(6px);
  display:none;pointer-events:auto;
  transition:transform 0.15s,box-shadow 0.15s;
`
fabBtn.textContent = '🎬'
fabBtn.addEventListener('mouseenter', () => {
  fabBtn.style.transform = 'scale(1.1)'
  fabBtn.style.boxShadow = '0 6px 32px rgba(0,0,0,0.85)'
})
fabBtn.addEventListener('mouseleave', () => {
  fabBtn.style.transform = 'scale(1)'
  fabBtn.style.boxShadow = '0 4px 24px rgba(0,0,0,0.7)'
})
document.body.appendChild(fabBtn)

// ── Mode application ──────────────────────────────────────────────────────────
function applyButtonMode() {
  if (buttonMode === 'fab') {
    fabBtn.style.display = 'flex'
    fabBtn.style.alignItems = 'center'
    fabBtn.style.justifyContent = 'center'
    saveBtn.style.display = 'none'
    saveBtnVisible = false
  } else if (buttonMode === 'off') {
    fabBtn.style.display = 'none'
    saveBtn.style.display = 'none'
    saveBtnVisible = false
  } else {
    // 'hover' — FAB hidden, hover interval handles saveBtn
    fabBtn.style.display = 'none'
  }
}

let mouseX = 0, mouseY = 0
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY }, true)

function findVideoUnderMouse() {
  for (const v of document.querySelectorAll('video')) {
    const r = v.getBoundingClientRect()
    if (r.width < 50 || r.height < 30) continue
    if (mouseX >= r.left && mouseX <= r.right && mouseY >= r.top && mouseY <= r.bottom) {
      return { rect: r, video: v }
    }
  }
  return null
}

let saveBtnVisible = false
setInterval(() => {
  // Only drive hover button in 'hover' mode
  if (buttonMode !== 'hover') {
    if (saveBtnVisible) { saveBtn.style.display = 'none'; saveBtnVisible = false }
    return
  }
  if (activePanel) { if (saveBtnVisible) { saveBtn.style.display = 'none'; saveBtnVisible = false } return }
  const overVideo = findVideoUnderMouse()
  if (overVideo) {
    const { rect } = overVideo
    saveBtn.textContent = isAuthenticated ? '🎬 Save to Prompt Manager' : '🎬 Sign in to Prompt Manager'
    saveBtn.style.opacity = isAuthenticated ? '1' : '0.6'
    saveBtn.style.top  = (rect.top + 12) + 'px'
    saveBtn.style.left = (rect.right - 220) + 'px'
    if (!saveBtnVisible) { saveBtn.style.display = 'block'; saveBtnVisible = true }
  } else if (saveBtnVisible) {
    saveBtn.style.display = 'none'; saveBtnVisible = false
  }
}, 200)

function handleSaveClick() {
  if (!isAuthenticated) {
    openLoginAndWait(() => showSavePanel())
    return
  }
  recheckAndReload().then(() => showSavePanel())
}

saveBtn.addEventListener('click', e => {
  e.preventDefault(); e.stopPropagation()
  saveBtn.style.display = 'none'; saveBtnVisible = false
  handleSaveClick()
})

fabBtn.addEventListener('click', e => {
  e.preventDefault(); e.stopPropagation()
  handleSaveClick()
})

// ── Floating button: Insert Prompt (near textarea) ───────────────────────────
const promptSaverBtn = document.createElement('button')
promptSaverBtn.textContent = '⚡ Insert Prompt'
promptSaverBtn.style.cssText = `
  position:fixed;z-index:2147483647;
  background:rgba(10,10,10,0.92);color:#fff;
  border:1px solid rgba(255,255,255,0.22);border-radius:8px;
  padding:6px 13px;font-size:12px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  font-weight:600;cursor:pointer;
  box-shadow:0 4px 20px rgba(0,0,0,0.6);
  backdrop-filter:blur(6px);
  display:none;pointer-events:auto;
  transition:opacity 0.15s;
`
document.body.appendChild(promptSaverBtn)

let promptSaverBtnVisible = false
let lastTextareaRect = null

setInterval(() => {
  // Hide if disabled in settings
  if (!showInsertPrompt) {
    if (promptSaverBtnVisible) { promptSaverBtn.style.display = 'none'; promptSaverBtnVisible = false }
    return
  }
  if (activePanel || activeSaverPanel) return
  // Use findInsertTarget (no text requirement) so button appears even on empty fields
  const target = findInsertTarget()
  if (!target) {
    if (promptSaverBtnVisible) { promptSaverBtn.style.display = 'none'; promptSaverBtnVisible = false }
    return
  }
  const r = target.getBoundingClientRect()
  if (r.width < 100) {
    if (promptSaverBtnVisible) { promptSaverBtn.style.display = 'none'; promptSaverBtnVisible = false }
    return
  }
  promptSaverBtn.style.top = Math.max(8, r.top - 36) + 'px'
  promptSaverBtn.style.left = r.left + 'px'
  if (!promptSaverBtnVisible) { promptSaverBtn.style.display = 'block'; promptSaverBtnVisible = true }
}, 300)

// Returns true if element is inside chrome (nav/header/footer/aside)
function isInChrome(el) {
  return !!el.closest('nav, header, footer, aside, [role="navigation"], [role="banner"], [role="complementary"]')
}

// Returns true if element looks like a search box
function isSearchInput(el) {
  const hint = [el.placeholder, el.getAttribute('aria-label'), el.name, el.id, el.className]
    .join(' ').toLowerCase()
  return hint.includes('search') || hint.includes('find') || hint.includes('חיפוש')
}

// findInsertTarget — finds the textarea to POSITION the ⚡ button next to.
// Does NOT require content — the field may be empty (user will insert into it).
function findInsertTarget() {
  const selectors = [
    '[data-testid*="prompt" i]',
    '[aria-label*="prompt" i]',
    '[placeholder*="prompt" i]',
    '[id*="prompt" i]',
    '[class*="prompt" i] textarea',
    '[class*="prompt" i] [contenteditable]',
    'textarea',
    '[contenteditable="true"]',
  ]
  for (const sel of selectors) {
    try {
      for (const el of document.querySelectorAll(sel)) {
        if (isInChrome(el) || isSearchInput(el)) continue
        const r = el.getBoundingClientRect()
        if (r.width > 100 && r.top >= -100 && r.bottom <= window.innerHeight + 300) return el
      }
    } catch {}
  }
  return null
}

// findMainTextarea — finds a textarea that has actual prompt TEXT in it (for extraction).
function findMainTextarea() {
  const selectors = [
    '[data-testid*="prompt" i]',
    '[aria-label*="prompt" i]',
    '[placeholder*="prompt" i]',
    '[id*="prompt" i]',
    '[class*="prompt" i] textarea',
    '[class*="prompt" i] [contenteditable]',
    'textarea',
    '[contenteditable="true"]',
  ]
  for (const sel of selectors) {
    try {
      for (const el of document.querySelectorAll(sel)) {
        if (isInChrome(el) || isSearchInput(el)) continue
        const r = el.getBoundingClientRect()
        const text = (el.value || el.innerText || el.textContent || '').trim()
        if (r.width > 80 && looksLikePrompt(text)) {
          console.log('[PM] textarea with prompt | sel:', sel, '| text:', text.slice(0, 60))
          return el
        }
      }
    } catch {}
  }
  return null
}

promptSaverBtn.addEventListener('click', e => {
  e.preventDefault(); e.stopPropagation()
  showSaverPanel()
})

// ── Extension icon click → Save panel / settings ─────────────────────────────
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'showPanel') showSavePanel()
  if (msg.action === 'setMode') {
    buttonMode = msg.mode
    applyButtonMode()
  }
  if (msg.action === 'setSetting') {
    if (msg.key === 'showInsertPrompt') showInsertPrompt = msg.value
    if (msg.key === 'showSaveToLibrary') showSaveToLibrary = msg.value
  }
})

// ── Data extraction ───────────────────────────────────────────────────────────

// Words that indicate a UI element, not a real prompt
const UI_WORDS = ['generate', 'cancel', 'download', 'share', 'save', 'upload',
  'sign in', 'log in', 'menu', 'settings', 'video & image', 'image generation',
  'video generation', 'try again', 'back', 'next', 'close', 'open']

function looksLikePrompt(text) {
  if (!text || text.length < 40) return false         // too short for a real prompt
  if (text.length > 3000) return false                // suspiciously long
  const lower = text.toLowerCase()
  // Reject if it's mostly UI labels
  for (const w of UI_WORDS) {
    if (lower.startsWith(w) && text.length < 80) return false
  }
  return true
}

// Find text in a sibling/child of a "Prompt" label element
function findPromptNearLabel() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
  while (walker.nextNode()) {
    const el = walker.currentNode
    // Skip interactive chrome
    if (el.closest('nav,header,footer,button,[role="button"],[role="navigation"]')) continue
    const ownText = (el.childNodes[0]?.textContent || '').trim().toLowerCase()
    if (ownText === 'prompt' || ownText === 'prompt:' || ownText === 'the prompt') {
      // Check next sibling, parent's next sibling, or nearby p/span
      const candidates = [
        el.nextElementSibling,
        el.parentElement?.nextElementSibling,
        el.parentElement?.parentElement?.querySelector('p, [class*="text"], [class*="content"]'),
      ]
      for (const c of candidates) {
        if (!c || c === el) continue
        const t = (c.innerText || c.textContent || '').trim()
        if (looksLikePrompt(t)) {
          console.log('[PM] prompt found near "Prompt" label | text:', t.slice(0, 80))
          return t
        }
      }
    }
  }
  return ''
}

// Find prompt text that appears in the same visual container as the video
function findPromptNearVideo(videoEl) {
  if (!videoEl) return ''
  // Walk up until we find a container that holds both video and substantial text
  let container = videoEl.parentElement
  for (let i = 0; i < 6 && container; i++) {
    const texts = [...container.querySelectorAll('p, [class*="prompt" i], [class*="text" i]')]
    for (const el of texts) {
      if (el.closest('nav,header,footer,button')) continue
      const t = (el.innerText || el.textContent || '').trim()
      if (looksLikePrompt(t)) {
        console.log('[PM] prompt found near video | text:', t.slice(0, 80))
        return t
      }
    }
    container = container.parentElement
  }
  return ''
}

function extractData() {
  const url = window.location.href
  const p = new URLSearchParams(window.location.search)

  // ── Video ──────────────────────────────────────────────────────────────────
  let bestVideo = null
  for (const v of document.querySelectorAll('video')) {
    const r = v.getBoundingClientRect()
    if (r.width >= 80 && r.height >= 50) {
      if (!bestVideo || r.width * r.height > bestVideo.area) {
        bestVideo = { el: v, area: r.width * r.height }
      }
    }
  }
  const videoSrc = bestVideo ? (bestVideo.el.currentSrc || bestVideo.el.src || '') : ''
  const duration = bestVideo && isFinite(bestVideo.el.duration) ? Math.round(bestVideo.el.duration) : 0

  // ── Prompt — 6 strategies, best signal wins ────────────────────────────────
  let prompt = ''
  let promptSource = ''

  // 1. __NEXT_DATA__ — Next.js embeds all page data here (highest reliability)
  if (!prompt) {
    try {
      const nd = document.getElementById('__NEXT_DATA__')
      if (nd) {
        const json = nd.textContent
        // Search for any key that looks like a prompt field with substantial text
        const keys = ['prompt', 'promptText', 'prompt_text', 'userPrompt', 'generationPrompt']
        for (const key of keys) {
          const re = new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.){40,1000})"`)
          const m = json.match(re)
          if (m) {
            const t = m[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
            if (looksLikePrompt(t)) { prompt = t; promptSource = `next-data[${key}]`; break }
          }
        }
      }
    } catch(e) { console.log('[PM] next-data parse error:', e.message) }
  }

  // 2. URL param
  if (!prompt) {
    const urlPrompt = p.get('prompt') || p.get('assetPrompt')
    if (urlPrompt) {
      const t = decodeURIComponent(urlPrompt)
      if (looksLikePrompt(t)) { prompt = t; promptSource = 'url-param' }
    }
  }

  // 3. data-prompt attribute anywhere on page
  if (!prompt) {
    for (const el of document.querySelectorAll('[data-prompt]')) {
      const t = (el.getAttribute('data-prompt') || '').trim()
      if (looksLikePrompt(t)) { prompt = t; promptSource = 'data-prompt'; break }
    }
  }

  // 4. Textarea / input with prompt content
  if (!prompt) {
    const textarea = findMainTextarea()
    if (textarea) {
      const t = (textarea.value || textarea.innerText || textarea.textContent || '').trim()
      if (looksLikePrompt(t)) { prompt = t; promptSource = 'textarea' }
    }
  }

  // 5. Text sibling of a "Prompt" label element
  if (!prompt) {
    const t = findPromptNearLabel()
    if (t) { prompt = t; promptSource = 'label-sibling' }
  }

  // 6. Any substantial text in the same container as the video
  if (!prompt && bestVideo) {
    const t = findPromptNearVideo(bestVideo.el)
    if (t) { prompt = t; promptSource = 'near-video' }
  }

  console.log('[PM] prompt source:', promptSource || 'none', '| text:', prompt.slice(0, 120) || '(empty)')

  // ── AI model ───────────────────────────────────────────────────────────────
  // Look for model name in the visible page text, prioritise area near the video
  const searchArea = bestVideo?.el?.closest('[class*="panel"],[class*="sidebar"],[class*="detail"],[class*="info"]')
    || document.body
  const areaText = (searchArea.innerText || '').toLowerCase()
  let model = 'other'
  for (const m of ['sora', 'runway', 'veo', 'kling']) {
    if (areaText.includes(m)) { model = m; break }
  }

  // ── FPS ────────────────────────────────────────────────────────────────────
  let fps = ''
  const fpsMatch = (searchArea.innerText || document.body.innerText).match(/\b(\d{2,3})\s*fps\b/i)
  if (fpsMatch) fps = fpsMatch[1]
  if (!fps && p.get('assetFps')) fps = p.get('assetFps')
  if (!fps && p.get('fps'))      fps = p.get('fps')

  // ── Asset title ────────────────────────────────────────────────────────────
  let assetTitle = ''
  const h1 = document.querySelector('h1')
  if (h1?.innerText?.trim()) assetTitle = h1.innerText.trim()
  if (!assetTitle && document.title) {
    assetTitle = document.title.replace(/\s*[|–\-].*$/, '').trim()
  }

  // Dimensions — prefer URL params
  const width  = p.get('assetWidth')  || p.get('width')  || ''
  const height = p.get('assetHeight') || p.get('height') || ''
  const ratio  = p.get('assetAspectRatio') || p.get('ratio') || ''

  return { url, videoSrc, prompt, model, duration, fps, assetTitle,
           assetId: p.get('assetId') || '', width, height, ratio }
}

// ── Save panel ────────────────────────────────────────────────────────────────
let activePanel = null

function showSavePanel() {
  if (activePanel || activeSaverPanel) { closeAll(); return }
  const data = extractData()

  const overlay = mkOverlay()
  const panel = document.createElement('div')
  panel.style.cssText = panelCss('340px')

  const opts = projects.map(p => `<option value="${esc(p.id)}">${esc(p.department_name)} — ${esc(p.name)}</option>`).join('')
  const hasVideo = !!data.videoSrc
  const hasPrompt = !!data.prompt
  const noProjects = projects.length === 0

  // Meta tags (dimensions, fps, duration)
  const metaTags = [
    data.width && data.height ? `${data.width}×${data.height}` : '',
    data.ratio || '',
    data.fps ? `${data.fps}fps` : '',
    data.duration ? `${data.duration}s` : '',
  ].filter(Boolean)

  const modelOpts = ['sora','runway','veo','kling','other']
    .map(m => `<option value="${m}" ${data.model===m?'selected':''}>${m.charAt(0).toUpperCase()+m.slice(1)}</option>`).join('')

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:9px">
        <span style="font-size:18px">🎬</span>
        <span style="font-weight:700;font-size:14px">Save to Prompt Manager</span>
      </div>
      <button id="ph-close" style="background:none;border:none;color:#555;cursor:pointer;font-size:22px;line-height:1;padding:0 4px">×</button>
    </div>

    ${metaTags.length ? `<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px">${metaTags.map(t=>`<span style="background:#222;border:1px solid rgba(255,255,255,0.1);border-radius:5px;padding:2px 7px;font-size:10px;font-family:monospace;color:#aaa">${esc(t)}</span>`).join('')}</div>` : ''}

    <div style="margin-bottom:10px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
        <label style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.07em">Prompt</label>
        <span style="font-size:10px;color:${hasPrompt ? '#4ade80' : '#f87171'}">${hasPrompt ? '✓ detected' : '⚠ not detected — type manually'}</span>
      </div>
      <textarea id="ph-prompt" style="width:100%;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:9px 11px;color:#fff;font-size:12px;font-family:monospace;line-height:1.5;resize:vertical;min-height:80px;max-height:180px;outline:none;box-sizing:border-box"
        placeholder="Paste or type the prompt here…">${esc(data.prompt)}</textarea>
    </div>

    <div style="display:flex;gap:8px;margin-bottom:14px">
      <div style="flex:1">
        <label style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.07em;display:block;margin-bottom:5px">AI Model</label>
        <select id="ph-model" style="width:100%;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:9px;padding:8px 10px;color:#fff;font-size:12px;outline:none;cursor:pointer">
          ${modelOpts}
        </select>
      </div>
      ${hasVideo ? `<div style="display:flex;align-items:flex-end;padding-bottom:1px"><span style="background:#0d1f12;border:1px solid #1a3a22;border-radius:8px;padding:7px 10px;font-size:11px;color:#4ade80;white-space:nowrap">🎥 Video found</span></div>` : ''}
    </div>

    ${noProjects ? `
    <div style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;text-align:center;margin-bottom:16px">
      <div style="font-size:22px;margin-bottom:8px">📁</div>
      <div style="font-size:12px;color:#888;margin-bottom:12px">No projects found.<br>Open Prompt Manager to browse or create one.</div>
      <a href="${HUB_URL}/projects" target="_blank" style="display:inline-block;background:#fff;color:#000;text-decoration:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:700">Open Prompt Manager →</a>
    </div>
    ` : `
    <div style="margin-bottom:14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
        <label style="font-size:10px;color:#555;text-transform:uppercase;letter-spacing:0.07em">Project</label>
        <a id="ph-open" href="${HUB_URL}/projects" target="_blank" style="font-size:10px;color:#555;text-decoration:none" onmouseover="this.style.color='#aaa'" onmouseout="this.style.color='#555'">Open in Prompt Manager ↗</a>
      </div>
      <select id="ph-project" style="width:100%;background:#111;border:1px solid rgba(255,255,255,0.12);border-radius:9px;padding:9px 11px;color:#fff;font-size:13px;outline:none;cursor:pointer;appearance:auto">
        <option value="">— Select project —</option>${opts}
      </select>
    </div>
    <button id="ph-save" style="width:100%;background:#fff;color:#000;border:none;border-radius:9px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">Save to Prompt Manager →</button>
    `}
  `

  document.body.appendChild(overlay)
  document.body.appendChild(panel)
  activePanel = { overlay, panel }

  panel.querySelector('#ph-close').addEventListener('click', closeAll)
  overlay.addEventListener('click', closeAll)

  if (!noProjects) {
    panel.querySelector('#ph-project').addEventListener('change', (e) => {
      const id = e.target.value
      const link = panel.querySelector('#ph-open')
      link.href = id ? `${HUB_URL}/projects/${id}` : `${HUB_URL}/projects`
      link.style.color = id ? '#4ade80' : '#555'
    })

    panel.querySelector('#ph-save').addEventListener('click', () => {
      const projectId = panel.querySelector('#ph-project').value
      if (!projectId) { panel.querySelector('#ph-project').style.borderColor = 'rgba(239,68,68,0.6)'; return }

      // Read editable fields — user may have corrected them
      const finalPrompt = panel.querySelector('#ph-prompt').value.trim()
      const finalModel  = panel.querySelector('#ph-model').value

      const saveEl = panel.querySelector('#ph-save')
      saveEl.textContent = 'Saving…'; saveEl.style.opacity = '0.6'; saveEl.disabled = true

      const qs = new URLSearchParams({
        artlistUrl: data.url, assetId: data.assetId,
        width: data.width, height: data.height, ratio: data.ratio,
        model: finalModel, prompt: finalPrompt.slice(0, 800),
        projectId, autoSave: '1',
      })
      if (data.videoSrc)    qs.set('videoSrc',    data.videoSrc)
      if (data.fps)         qs.set('fps',         data.fps)
      if (data.duration)    qs.set('duration',    String(data.duration))
      if (data.assetTitle)  qs.set('assetTitle',  data.assetTitle.slice(0, 120))
      window.open(`${HUB_URL}/add?${qs}`, '_blank', 'width=480,height=320')

      setTimeout(() => {
        saveEl.textContent = '✓ Saved!'; saveEl.style.background = '#4ade80'; saveEl.style.opacity = '1'
        setTimeout(closeAll, 900)
      }, 600)
    })
  }
}

// ── Insert Prompt panel ───────────────────────────────────────────────────────
let activeSaverPanel = null

function showSaverPanel() {
  if (activePanel || activeSaverPanel) { closeAll(); return }

  if (!isAuthenticated) {
    openLoginAndWait(() => showSaverPanel())
    return
  }

  // Refresh saved prompts on every open
  fetch(`${HUB_URL}/api/saved-prompts`, { credentials: 'include' })
    .then(r => { if (!r.ok) throw new Error('not ok'); return r.json() })
    .then(d => { savedPrompts = Array.isArray(d) ? d : []; renderSaverPanel() })
    .catch(() => renderSaverPanel())
}

function renderSaverPanel() {
  const overlay = mkOverlay()
  const panel = document.createElement('div')
  panel.style.cssText = panelCss('400px')

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:9px">
        <span style="font-size:18px">⚡</span>
        <span style="font-weight:700;font-size:14px">Insert Prompt</span>
      </div>
      <button id="ps-close" style="background:none;border:none;color:#555;cursor:pointer;font-size:22px;line-height:1;padding:0 4px">×</button>
    </div>
    <input id="ps-search" placeholder="Search prompts..." style="width:100%;background:#111;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;color:#fff;font-size:12px;outline:none;margin-bottom:12px;box-sizing:border-box" />
    <div id="ps-list" style="max-height:320px;overflow-y:auto">
      ${renderPromptList(savedPrompts)}
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.07);font-size:10px;color:#555;text-align:center">
      Manage prompts at <a href="${HUB_URL}/saved-prompts" target="_blank" style="color:#888;text-decoration:underline">Prompt Manager ↗</a>
    </div>
  `

  document.body.appendChild(overlay)
  document.body.appendChild(panel)
  activeSaverPanel = { overlay, panel }

  panel.querySelector('#ps-close').addEventListener('click', closeAll)
  overlay.addEventListener('click', closeAll)

  const searchEl = panel.querySelector('#ps-search')
  searchEl.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase()
    const filtered = savedPrompts.filter(p => p.title.toLowerCase().includes(q) || p.prompt_text.toLowerCase().includes(q))
    panel.querySelector('#ps-list').innerHTML = renderPromptList(filtered)
    bindPromptClicks(panel)
  })

  bindPromptClicks(panel)
}

function renderPromptList(list) {
  if (!list.length) return `<div style="text-align:center;padding:24px 0;color:#555;font-size:12px">No saved prompts yet.<br><a href="${HUB_URL}/saved-prompts" target="_blank" style="color:#888;text-decoration:underline;margin-top:8px;display:inline-block">Add prompts at Prompt Manager ↗</a></div>`
  return list.map(p => `
    <div data-prompt="${esc(p.prompt_text)}" style="background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:10px 12px;margin-bottom:8px;cursor:pointer;transition:border-color 0.15s" onmouseover="this.style.borderColor='rgba(255,255,255,0.2)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
      <div style="font-size:12px;font-weight:600;color:#ddd;margin-bottom:4px">${esc(p.title)}</div>
      <div style="font-size:10.5px;color:#666;line-height:1.4;overflow:hidden;max-height:36px">${esc(p.prompt_text.slice(0,120))}${p.prompt_text.length > 120 ? '…' : ''}</div>
    </div>
  `).join('')
}

function bindPromptClicks(panel) {
  panel.querySelectorAll('[data-prompt]').forEach(el => {
    el.addEventListener('click', () => {
      const text = el.getAttribute('data-prompt')
      insertPromptIntoTextarea(text)
      closeAll()
    })
  })
}

function insertPromptIntoTextarea(text) {
  const el = findMainTextarea()
  if (!el) return

  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
    if (nativeSetter) {
      nativeSetter.call(el, text)
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    } else {
      el.value = text
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  } else {
    el.focus()
    document.execCommand('selectAll', false, null)
    document.execCommand('insertText', false, text)
  }
  el.focus()
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function panelCss(width) {
  return `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2147483647;background:#181818;border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:22px;width:${width};max-width:92vw;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;box-shadow:0 32px 80px rgba(0,0,0,0.9);color:#fff;`
}

function mkOverlay() {
  const el = document.createElement('div')
  el.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,0.5);backdrop-filter:blur(3px);'
  document.body.appendChild(el)
  return el
}

function statusBox(active) {
  return `flex:1;background:#111;border:1px solid ${active ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'};border-radius:8px;padding:10px 12px;text-align:center`
}

function closeAll() {
  if (activePanel) { activePanel.overlay.remove(); activePanel.panel.remove(); activePanel = null }
  if (activeSaverPanel) { activeSaverPanel.overlay.remove(); activeSaverPanel.panel.remove(); activeSaverPanel = null }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
