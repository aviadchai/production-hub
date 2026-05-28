const HUB_URL = 'https://production-hub-omega-five.vercel.app'

// Defaults for all settings
const DEFAULTS = {
  buttonMode: 'hover',
  showInsertPrompt: true,
  showSaveToLibrary: true,
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const isArtlist = tab?.url?.includes('toolkit.artlist.io')

  // ── Auth check ──────────────────────────────────────────────────────────────
  try {
    const res = await fetch(`${HUB_URL}/api/auth/me`, { credentials: 'include' })
    const data = res.ok ? await res.json() : null

    const dot  = document.getElementById('auth-dot')
    const name = document.getElementById('auth-name')
    const link = document.getElementById('auth-link')

    if (data?.authenticated) {
      dot.className    = 'dot dot-green'
      name.textContent = data.displayName || data.username || 'Signed in'
      link.style.display  = 'inline'
      link.textContent = 'Sign out'
      link.href        = `${HUB_URL}/login`
    } else {
      dot.className    = 'dot dot-red'
      name.textContent = 'Not signed in'
      link.style.display  = 'inline'
      link.textContent = 'Sign in →'
      link.href        = `${HUB_URL}/login`
    }
  } catch {
    document.getElementById('auth-name').textContent = 'Could not connect'
  }

  // ── "Save current video" shortcut ──────────────────────────────────────────
  if (isArtlist && tab) {
    const btn = document.getElementById('save-now-btn')
    btn.style.display = 'flex'
    btn.disabled = false
    btn.addEventListener('click', async () => {
      btn.disabled = true
      btn.textContent = 'Opening…'
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'showPanel' })
        window.close()
      } catch {
        btn.textContent = '⚠ Reload the Artlist page first'
        setTimeout(() => { btn.disabled = false; btn.innerHTML = '🎬 Save current video' }, 2500)
      }
    })
  }

  // ── Load all settings ───────────────────────────────────────────────────────
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS))
  const settings = { ...DEFAULTS, ...stored }

  // Apply button mode selection
  applyModeSelected(settings.buttonMode)

  // Apply toggle states
  setToggle('showInsertPrompt', settings.showInsertPrompt)
  setToggle('showSaveToLibrary', settings.showSaveToLibrary)

  // ── Button mode click handlers ──────────────────────────────────────────────
  document.querySelectorAll('.mode-option').forEach(el => {
    el.addEventListener('click', () => {
      const mode = el.getAttribute('data-mode')
      chrome.storage.local.set({ buttonMode: mode })
      applyModeSelected(mode)
      if (isArtlist && tab) {
        chrome.tabs.sendMessage(tab.id, { action: 'setMode', mode }).catch(() => {})
      }
    })
  })

  // ── Feature toggle click handlers ───────────────────────────────────────────
  document.querySelectorAll('.toggle-row').forEach(el => {
    el.addEventListener('click', () => {
      const key = el.getAttribute('data-toggle')
      const current = el.querySelector('.switch').classList.contains('on')
      const next = !current
      chrome.storage.local.set({ [key]: next })
      setToggle(key, next)
      if (isArtlist && tab) {
        chrome.tabs.sendMessage(tab.id, { action: 'setSetting', key, value: next }).catch(() => {})
      }
    })
  })
}

function applyModeSelected(mode) {
  document.querySelectorAll('.mode-option').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('data-mode') === mode)
  })
}

function setToggle(key, value) {
  const sw = document.getElementById(`toggle-${key}`)
  if (!sw) return
  sw.classList.toggle('on', !!value)
}

init()
