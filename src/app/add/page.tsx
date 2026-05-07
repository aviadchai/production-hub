'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { projects } from '@/lib/mock-data'
import { ExternalLink, Check } from 'lucide-react'
import { toast } from 'sonner'

const mockScenes: Record<string, string[]> = {
  '1': ['Opening — Skyline', 'Product in Action', 'Closing — CTA'],
  '2': ['Intro', 'Core Message', 'Outro'],
  '3': ['Instagram', 'TikTok', 'LinkedIn'],
  '4': ['Hook', 'Demo', 'CTA'],
}

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

  const [prompt, setPrompt] = useState(params.get('prompt') || '')
  const [model, setModel] = useState(params.get('model') || 'other')
  const [projectId, setProjectId] = useState(params.get('projectId') || projects[0].id)
  const [scene, setScene] = useState(params.get('scene') || '')
  const [saved, setSaved] = useState(false)

  const artlistUrl = params.get('artlistUrl') || ''
  const videoSrc = params.get('videoSrc') || ''
  const width = params.get('width') || ''
  const height = params.get('height') || ''

  const scenes = mockScenes[projectId] || []

  const handleSave = () => {
    if (!prompt.trim()) { toast.error('Please enter a prompt'); return }
    toast.success('Prompt added successfully!')
    setSaved(true)
    setTimeout(() => router.push(`/projects/${projectId}`), 1500)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Check className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <p className="font-semibold">Prompt added!</p>
          <p className="text-sm text-muted-foreground mt-1">Redirecting to project...</p>
        </div>
      </div>
    )
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

        <div className="grid grid-cols-2 gap-3">
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
          <div className="space-y-1.5">
            <Label className="text-xs">Project</Label>
            <select
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setScene('') }}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
            >
              {projects.filter(p => p.status === 'active').map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Scene</Label>
          <select
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">— Select scene —</option>
            {scenes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" size="sm" className="h-8" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="sm" className="h-8 flex-1" onClick={handleSave}>
          Save to Project
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
