'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Copy, Trash2, Plus, Check, BookMarked, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SavedPrompt {
  id: string
  title: string
  prompt_text: string
  created_at: string
}

export default function SavedPromptsPage() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ title: '', prompt_text: '' })
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/saved-prompts')
      .then((r) => r.json())
      .then((data) => { setPrompts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!form.title.trim() || !form.prompt_text.trim()) return
    setSaving(true)
    const res = await fetch('/api/saved-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newPrompt = await res.json()
      setPrompts((prev) => [newPrompt, ...prev])
      setForm({ title: '', prompt_text: '' })
      setAddOpen(false)
      toast.success('Prompt saved to library')
    } else {
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/saved-prompts/${id}`, { method: 'DELETE' })
    setPrompts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Removed from library')
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <AppLayout title="Prompt Library">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Prompt Library
            </h1>
            <p className="text-sm text-muted-foreground">
              Saved prompts — reuse them on Artlist via the extension
            </p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Prompt
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl space-y-3">
            <BookMarked className="h-8 w-8 mx-auto text-muted-foreground/30" />
            <div>
              <p className="font-medium text-sm">No saved prompts yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Save prompts here and use them directly from the Artlist extension
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add your first prompt
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.map((p) => (
              <div
                key={p.id}
                className="group rounded-xl border border-border bg-card p-5 space-y-3 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-xs font-mono text-muted-foreground leading-relaxed line-clamp-4">
                  {p.prompt_text}
                </p>

                <button
                  onClick={() => handleCopy(p.id, p.prompt_text)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs transition-colors',
                    copiedId === p.id
                      ? 'text-emerald-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {copiedId === p.id
                    ? <><Check className="h-3.5 w-3.5" /> Copied</>
                    : <><Copy className="h-3.5 w-3.5" /> Copy</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm">Add to Prompt Library</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder='e.g. "Cinematic golden hour drone"'
                  className="h-8 text-sm"
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Prompt</Label>
                <Textarea
                  value={form.prompt_text}
                  onChange={(e) => setForm((f) => ({ ...f, prompt_text: e.target.value }))}
                  placeholder="Paste the full prompt text..."
                  className="min-h-[140px] text-sm font-mono resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={handleAdd}
                disabled={!form.title.trim() || !form.prompt_text.trim() || saving}
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
