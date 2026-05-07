const PRODUCTION_HUB_URL = 'https://production-hub-alpha.vercel.app'

const mockProjects = [
  { id: '1', name: 'Q2 2025 Campaign', scenes: ['Opening — Skyline', 'Product in Action', 'Closing — CTA'] },
  { id: '2', name: 'Brand Reel 2025', scenes: ['Intro', 'Core Message', 'Outro'] },
  { id: '3', name: 'Social Media Pack', scenes: ['Instagram', 'TikTok', 'LinkedIn'] },
]

const modelLabels = { sora: 'Sora', runway: 'Runway', veo: 'Veo', kling: 'Kling', other: 'Other' }

let extractedData = null

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const body = document.getElementById('main-body')
  const badge = document.getElementById('status-badge')

  const isArtlist = tab?.url?.includes('toolkit.artlist.io')

  if (!isArtlist) {
    badge.textContent = 'Not on Artlist'
    badge.style.color = '#666'
    body.innerHTML = `
      <div class="not-artlist">
        <strong>Go to Artlist Toolkit</strong>
        Open a generated video or image on<br>toolkit.artlist.io to use this extension.
      </div>
      <div class="actions" style="padding: 0 0 4px">
        <button class="btn-primary" onclick="chrome.tabs.create({url:'https://toolkit.artlist.io'})">
          Open Artlist Toolkit
        </button>
      </div>
    `
    return
  }

  badge.textContent = 'Artlist'
  badge.style.color = '#4ade80'

  try {
    extractedData = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' })
  } catch {
    extractedData = {}
  }

  renderForm(body, extractedData || {})
}

function renderForm(body, data) {
  const projectOptions = mockProjects
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join('')

  const firstProject = mockProjects[0]
  const sceneOptions = firstProject.scenes
    .map((s) => `<option value="${s}">${s}</option>`)
    .join('')

  const videoStatus = data.videoSrc
    ? `<div class="video-found"><div class="dot"></div>Video URL found — can embed directly</div>`
    : `<div class="no-video">⚠ No direct video URL — Artlist link will be saved</div>`

  body.innerHTML = `
    <div class="field">
      <label>Prompt</label>
      <textarea id="prompt-text" placeholder="Paste or edit the prompt...">${data.promptText || ''}</textarea>
    </div>

    <div class="row">
      <div class="field">
        <label>AI Model</label>
        <select id="ai-model">
          ${Object.entries(modelLabels).map(([v, l]) => `<option value="${v}" ${data.aiModel === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
      <div class="field">
        <label>Dimensions</label>
        <input type="text" value="${data.width || ''}×${data.height || ''}" readonly style="color:#666" />
      </div>
    </div>

    ${videoStatus}

    <div class="field">
      <label>Add to Project</label>
      <select id="project-select">${projectOptions}</select>
    </div>

    <div class="field">
      <label>Scene</label>
      <select id="scene-select">${sceneOptions}</select>
    </div>

    <div class="actions">
      <button class="btn-secondary" id="btn-copy">Copy Prompt</button>
      <button class="btn-primary" id="btn-add">Add to Hub →</button>
    </div>
  `

  // Update scenes when project changes
  document.getElementById('project-select').addEventListener('change', (e) => {
    const project = mockProjects.find((p) => p.id === e.target.value)
    const sceneSelect = document.getElementById('scene-select')
    sceneSelect.innerHTML = project.scenes
      .map((s) => `<option value="${s}">${s}</option>`)
      .join('')
  })

  document.getElementById('btn-copy').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt-text').value
    if (!prompt) return
    await navigator.clipboard.writeText(prompt)
    const btn = document.getElementById('btn-copy')
    btn.textContent = 'Copied ✓'
    btn.style.color = '#4ade80'
    setTimeout(() => { btn.textContent = 'Copy Prompt'; btn.style.color = '' }, 2000)
  })

  document.getElementById('btn-add').addEventListener('click', () => {
    const prompt = document.getElementById('prompt-text').value
    const model = document.getElementById('ai-model').value
    const projectId = document.getElementById('project-select').value
    const scene = document.getElementById('scene-select').value

    const params = new URLSearchParams({
      addPrompt: '1',
      projectId,
      scene,
      model,
      artlistUrl: data.url || '',
      ...(data.videoSrc ? { videoSrc: data.videoSrc } : {}),
      prompt: prompt.slice(0, 500),
    })

    chrome.tabs.create({ url: `${PRODUCTION_HUB_URL}/projects/${projectId}?${params}` })

    // Show success
    body.innerHTML = `
      <div class="success">
        ✓ Opening Production Hub<br>
        <span style="color:#666;font-size:11px;margin-top:4px;display:block">
          "${scene}" in ${mockProjects.find(p => p.id === projectId)?.name}
        </span>
      </div>
    `
  })
}

init()
