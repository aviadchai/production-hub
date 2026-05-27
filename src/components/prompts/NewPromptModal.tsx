'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AI_MODELS = ['sora', 'runway', 'veo', 'kling', 'other']

interface Scene { id: string; title: string }

export function NewPromptModal({ projectId, scenes }: { projectId: string; scenes: Scene[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [promptText, setPromptText] = useState('')
  const [model, setModel] = useState('other')
  const [notes, setNotes] = useState('')

  const reset = () => {
    setTitle(''); setPromptText(''); setModel('other'); setNotes(''); setError('')
  }

  const close = () => { setOpen(false); reset() }

  const submit = async () => {
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true); setError('')

    const res = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        newSceneTitle: title.trim(),
        prompt: promptText,
        model,
        notes,
      }),
    })

    setLoading(false)
    if (res.ok) {
      close()
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to save')
    }
  }

  return (
    <>
      <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />Add Item
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={close} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Add Item</h2>
              <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Opening scene, Hero shot..."
                className="h-8 text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Prompt / Description <span className="text-muted-foreground">(optional)</span></Label>
              <textarea
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                placeholder="AI prompt, video description, or any notes..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">AI Model</Label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {AI_MODELS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Notes <span className="text-muted-foreground">(optional)</span></Label>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes..." className="h-8 text-sm" />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={close}>Cancel</Button>
              <Button size="sm" className="flex-1 h-8 text-xs" onClick={submit} disabled={loading}>
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add Item'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
