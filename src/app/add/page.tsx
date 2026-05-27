'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState, useEffect, useRef } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const modelOptions = [
  { value: 'sora', label: 'Sora' },
  { value: 'runway', label: 'Runway' },
  { value: 'veo', label: 'Veo' },
  { value: 'kling', label: 'Kling' },
  { value: 'other', label: 'Other' },
]

function AddForm() {
  const params = useSearchParams()
  const router = useRouter()
  const autoSave = params.get('autoSave') === '1'
  const savedRef = useRef(false)

  const [prompt, setPrompt] = useState(params.get('prompt') || '')
  const [model, setModel] = useState(params.get('model') || 'other')
  const [projectId] = useState(params.get('projectId') || '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const artlistUrl  = params.get('artlistUrl')  || ''
  const videoSrc    = params.get('videoSrc')    || ''
  const width       = params.get('width')       || ''
  const height      = params.get('height')      || ''
  const fps         = params.get('fps')         || ''
  const duration    = params.get('duration')    || ''
  const assetTitle  = params.get('assetTitle')  || ''

  // Auto-save flow when opened from extension
  useEffect(() => {
    if (!autoSave || savedRef.current) return
    savedRef.current = true
    setStatus('saving')

    fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        prompt:     params.get('prompt')     || '',
        model:      params.get('model')      || 'other',
        artlistUrl, videoSrc, width, height,
        ratio:      params.get('ratio')      || '',
        fps, duration, assetTitle,
      }),
    })
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}))
          setErrorMsg(d.error || `HTTP ${r.status}`)
          throw new Error()
        }
        setStatus('saved')
        setTimeout(() => window.close(), 1200)
      })
      .catch(() => {
        setStatus('error')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (autoSave) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        {status === 'saving' && (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Saving...</p>
          </>
        )}
        {status === 'saved' && (
          <>
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold">Saved!</p>
              <p className="text-sm text-muted-foreground mt-1">This window will close...</p>
            </div>
          </>
        )}
        {status === 'error' && (
          <div className="text-sm text-destructive space-y-1">
            <p>Failed to save.</p>
            {errorMsg && <p className="text-xs opacity-70 font-mono">{errorMsg}</p>}
          </div>
        )}
      </div>
    )
  }

  const handleSave = async () => {
    if (!prompt.trim()) { toast.error('Please enter a prompt'); return }
    if (!projectId) { toast.error('No project selected'); return }
    setStatus('saving')

    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, prompt, model, artlistUrl, videoSrc, width, height, ratio: params.get('ratio') || '', fps, duration, assetTitle }),
    })

    if (!res.ok) {
      setStatus('error')
      toast.error('Failed to save')
      return
    }

    setStatus('saved')
    toast.success('Prompt added!')
    setTimeout(() => router.push(`/projects/${projectId}`), 1000)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Add from Artlist</h1>
        <p className="text-sm text-muted-foreground">Review and save to your project</p>
      </div>

      {artlistUrl && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card text-xs">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
          <span className="text-muted-foreground truncate flex-1">{artlistUrl}</span>
          <a href={artlistUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
        </div>
      )}

      {videoSrc && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-400">
          ✓ Direct video URL captured
        </div>
      )}

      {width && height && (
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded bg-secondary border border-border">{width}×{height}</span>
          {params.get('ratio') && (
            <span className="px-2 py-1 rounded bg-secondary border border-border">{params.get('ratio')}</span>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="The prompt used to generate this content..."
            className="min-h-[120px] text-sm font-mono resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">AI Model</Label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
          >
            {modelOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="sm" className="h-8" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="sm" className="h-8 flex-1" onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Save to Project'}
        </Button>
      </div>
    </div>
  )
}

export default function AddPage() {
  return (
    <AppLayout title="Add from Artlist">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <AddForm />
      </Suspense>
    </AppLayout>
  )
}
