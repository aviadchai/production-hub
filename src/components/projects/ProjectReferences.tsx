'use client'

import { useState, useRef, useCallback } from 'react'
import { Plus, ImageIcon, X, Link, Upload, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { referenceCategories } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface Reference {
  id: string
  project_id: string
  category: string
  title: string
  image_url: string | null
  notes: string | null
}

function ImageUploadZone({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [dragging, setDragging] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const [tab, setTab] = useState<'upload' | 'url'>('upload')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUrlError('Only image files are supported')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUrlError('Image must be under 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') onChange(result)
    }
    reader.readAsDataURL(file)
    setUrlError('')
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    try {
      new URL(trimmed)
      onChange(trimmed)
      setUrlError('')
    } catch {
      setUrlError('Enter a valid URL (starting with https://)')
    }
  }

  return (
    <div className="space-y-2">
      {/* Tab switcher */}
      <div className="flex gap-1 text-xs">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors',
            tab === 'upload' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Upload className="h-3 w-3" />Upload
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors',
            tab === 'url' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Link className="h-3 w-3" />Paste URL
        </button>
      </div>

      {tab === 'upload' && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors',
              dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80 hover:bg-secondary/30',
              value && 'border-solid border-border'
            )}
          >
            {value ? (
              <img src={value} alt="preview" className="max-h-32 rounded-lg object-contain" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground text-center">
                  Drag & drop an image here, or <span className="text-foreground">click to browse</span>
                </p>
                <p className="text-[10px] text-muted-foreground/60">PNG, JPG, GIF · max 5 MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Remove image
            </button>
          )}
        </>
      )}

      {tab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
              placeholder="https://..."
              className="h-8 text-sm font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <Button type="button" size="sm" className="h-8 text-xs shrink-0" onClick={handleUrlSubmit}>
              Set
            </Button>
          </div>
          {value && tab === 'url' && (
            <img src={value} alt="preview" className="max-h-24 rounded-lg object-contain border border-border" />
          )}
        </div>
      )}

      {urlError && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {urlError}
        </div>
      )}
    </div>
  )
}

export function ProjectReferences({ projectId }: { projectId: string }) {
  const [refs, setRefs] = useState<Reference[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category: 'Talent', title: '', notes: '', image_url: '' })

  const addRef = () => {
    if (!form.title.trim()) return
    setRefs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        project_id: projectId,
        category: form.category,
        title: form.title,
        image_url: form.image_url || null,
        notes: form.notes || null,
      },
    ])
    setForm({ category: 'Talent', title: '', notes: '', image_url: '' })
    setOpen(false)
  }

  const removeRef = (id: string) => setRefs((prev) => prev.filter((r) => r.id !== id))

  const grouped = referenceCategories
    .map((cat) => ({ cat, items: refs.filter((r) => r.category === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">References</h3>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground">
          <Plus className="h-3 w-3" />Add
        </Button>
      </div>

      {refs.length === 0 ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full border border-dashed border-border rounded-lg py-6 text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors flex flex-col items-center gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Add talent, locations, style references...
        </button>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ cat, items }) => (
            <div key={cat} className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">{cat}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {items.map((ref) => (
                  <div key={ref.id} className="group relative rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 hover:bg-secondary/50 transition-colors">
                    <div className="aspect-video rounded bg-secondary/60 flex items-center justify-center mb-2 overflow-hidden">
                      {ref.image_url ? (
                        <img src={ref.image_url} alt={ref.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <p className="text-xs font-medium truncate">{ref.title}</p>
                    {ref.notes && <p className="text-[10px] text-muted-foreground line-clamp-2">{ref.notes}</p>}
                    <button
                      onClick={() => removeRef(ref.id)}
                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 rounded bg-background/80 flex items-center justify-center"
                    >
                      <X className="h-2.5 w-2.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => { setForm(f => ({ ...f, category: cat })); setOpen(true) }}
                  className="aspect-auto rounded-lg border border-dashed border-border/50 p-3 flex items-center justify-center text-muted-foreground/40 hover:text-muted-foreground hover:border-border transition-colors min-h-[80px]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Plus className="h-3 w-3" />Add reference
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-sm">Add Reference</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                {referenceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Dan — Lead Actor"
                className="h-8 text-sm"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Image <span className="text-muted-foreground">(optional)</span></Label>
              <ImageUploadZone
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Notes <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any notes..."
                className="text-sm resize-none min-h-[60px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="h-7 text-xs" onClick={addRef} disabled={!form.title.trim()}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
