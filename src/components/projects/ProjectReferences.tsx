'use client'

import { useState } from 'react'
import { Plus, ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { projectReferences, referenceCategories } from '@/lib/mock-data'

interface Reference {
  id: string
  project_id: string
  category: string
  title: string
  image_url: string | null
  notes: string | null
}

export function ProjectReferences({ projectId }: { projectId: string }) {
  const [refs, setRefs] = useState<Reference[]>(
    projectReferences.filter((r) => r.project_id === projectId)
  )
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category: 'Talent', title: '', notes: '' })

  const addRef = () => {
    if (!form.title.trim()) return
    setRefs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        project_id: projectId,
        category: form.category,
        title: form.title,
        image_url: null,
        notes: form.notes || null,
      },
    ])
    setForm({ category: 'Talent', title: '', notes: '' })
    setOpen(false)
  }

  const removeRef = (id: string) => setRefs((prev) => prev.filter((r) => r.id !== id))

  const grouped = referenceCategories
    .map((cat) => ({ cat, items: refs.filter((r) => r.category === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          References
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-6 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
          Add
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
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                {cat}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {items.map((ref) => (
                  <div
                    key={ref.id}
                    className="group relative rounded-lg border border-border bg-secondary/30 p-3 space-y-1.5 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="aspect-video rounded bg-secondary/60 flex items-center justify-center mb-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                    <p className="text-xs font-medium truncate">{ref.title}</p>
                    {ref.notes && (
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{ref.notes}</p>
                    )}
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
            <Plus className="h-3 w-3" />
            Add reference
          </button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Add Reference</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
              >
                {referenceCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
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
              <Label className="text-xs">Notes (optional)</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any notes about this reference..."
                className="text-sm resize-none min-h-[60px]"
              />
            </div>

            <div className="border border-dashed border-border rounded-lg p-4 text-center text-xs text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors">
              <ImageIcon className="h-4 w-4 mx-auto mb-1 opacity-40" />
              Click to upload image
              <p className="text-[10px] mt-0.5 opacity-60">Image upload coming in next version</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-7 text-xs" onClick={addRef} disabled={!form.title.trim()}>
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
