'use client'

import { useState } from 'react'
import { Copy, Heart, MessageCircle, Check, BookMarked, Pencil, X, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArtlistEmbed } from './ArtlistEmbed'
import { CommentsDrawer } from './CommentsDrawer'
import { aiModelLabels, timeAgo } from '@/lib/mock-data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Prompt {
  id: string
  prompt_text: string
  notes: string | null
  ai_model: string
  artlist_video_url: string | null
  artlist_video_src: string | null
  asset_width: number | null
  asset_height: number | null
  asset_ratio: string | null
  asset_fps: number | null
  asset_duration: number | null
  asset_title: string | null
  created_by: string | null
  created_by_name: string
  created_at: string
  is_favorited: boolean
  comment_count: number
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)
  const [favorited, setFavorited] = useState(prompt.is_favorited)
  const [commentCount, setCommentCount] = useState(prompt.comment_count)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [savedToLib, setSavedToLib] = useState(false)

  // Edit state
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(prompt.prompt_text)
  const [editNotes, setEditNotes] = useState(prompt.notes ?? '')
  const [currentText, setCurrentText] = useState(prompt.prompt_text)
  const [currentNotes, setCurrentNotes] = useState(prompt.notes)
  const [saving, setSaving] = useState(false)
  const [deleted, setDeleted] = useState(false)

  const handleSaveToLibrary = async () => {
    const title = currentText.slice(0, 60).trim() + (currentText.length > 60 ? '...' : '')
    const res = await fetch('/api/saved-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, prompt_text: currentText }),
    })
    if (res.ok) {
      setSavedToLib(true)
      toast.success('Saved to Prompt Library')
      setTimeout(() => setSavedToLib(false), 3000)
    } else {
      toast.error('Failed to save')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentText)
    setCopied(true)
    toast.success('Prompt copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFavorite = async () => {
    const next = !favorited
    setFavorited(next)
    toast.success(next ? 'Added to favorites' : 'Removed from favorites')

    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promptId: prompt.id }),
    })
    if (!res.ok) {
      setFavorited(!next)
      toast.error('Failed to update favorite')
    }
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    const res = await fetch(`/api/prompts/${prompt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_text: editText, notes: editNotes || null }),
    })
    setSaving(false)
    if (res.ok) {
      setCurrentText(editText)
      setCurrentNotes(editNotes || null)
      setEditing(false)
      toast.success('Prompt updated')
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Failed to update')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this prompt? This cannot be undone.')) return
    const res = await fetch(`/api/prompts/${prompt.id}`, { method: 'DELETE' })
    if (res.ok) {
      setDeleted(true)
      toast.success('Prompt deleted')
    } else {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Failed to delete')
    }
  }

  if (deleted) return null

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-border/80 transition-colors">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-5 space-y-3 min-w-0">
            {/* Metadata badges */}
            <div className="flex items-start gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] h-5 shrink-0">
                {aiModelLabels[prompt.ai_model] || prompt.ai_model}
              </Badge>
              {prompt.asset_width && prompt.asset_height && (
                <Badge variant="secondary" className="text-[10px] h-5 font-mono shrink-0">
                  {prompt.asset_width}×{prompt.asset_height}
                </Badge>
              )}
              {prompt.asset_ratio && (
                <Badge variant="secondary" className="text-[10px] h-5 font-mono shrink-0">
                  {prompt.asset_ratio}
                </Badge>
              )}
              {prompt.asset_fps && (
                <Badge variant="secondary" className="text-[10px] h-5 font-mono shrink-0">
                  {prompt.asset_fps}fps
                </Badge>
              )}
              {prompt.asset_duration && (
                <Badge variant="secondary" className="text-[10px] h-5 font-mono shrink-0">
                  {prompt.asset_duration}s
                </Badge>
              )}
              <p className="text-xs text-muted-foreground">
                {prompt.created_by_name} · {timeAgo(prompt.created_at)}
              </p>
            </div>

            {prompt.asset_title && (
              <p className="text-xs font-medium text-foreground/70">{prompt.asset_title}</p>
            )}

            {/* Prompt text — edit mode or display mode */}
            {editing ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-sm font-mono leading-relaxed bg-secondary/40 border border-border rounded-lg px-3 py-2.5 resize-y min-h-[120px] focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Prompt text..."
                  autoFocus
                />
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full text-xs leading-relaxed bg-secondary/40 border border-border rounded-lg px-3 py-2 resize-y min-h-[48px] focus:outline-none focus:ring-1 focus:ring-ring text-muted-foreground"
                  placeholder="Notes (optional)..."
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditing(false); setEditText(currentText); setEditNotes(currentNotes ?? '') }}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className={cn(
                  'text-sm leading-relaxed font-mono whitespace-pre-wrap',
                  currentText ? 'text-foreground/90' : 'text-muted-foreground/40 italic'
                )}>
                  {currentText || 'No prompt text'}
                </p>

                {currentNotes && (
                  <p className="text-xs text-muted-foreground border-l-2 border-border pl-3 leading-relaxed whitespace-pre-wrap">
                    {currentNotes}
                  </p>
                )}
              </>
            )}

            {/* Action buttons */}
            {!editing && (
              <div className="flex items-center gap-1 pt-1 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavorite}
                  className={cn(
                    'h-7 gap-1.5 text-xs',
                    favorited ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Heart className={cn('h-3.5 w-3.5', favorited && 'fill-current')} />
                  {favorited ? 'Saved' : 'Save'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveToLibrary}
                  className={cn('h-7 gap-1.5 text-xs', savedToLib ? 'text-emerald-400' : 'text-muted-foreground hover:text-foreground')}
                >
                  <BookMarked className={cn('h-3.5 w-3.5', savedToLib && 'fill-current')} />
                  {savedToLib ? 'Saved' : 'Library'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommentsOpen(true)}
                  className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {commentCount > 0 ? commentCount : 'Comment'}
                </Button>

                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setEditing(true); setEditText(currentText); setEditNotes(currentNotes ?? '') }}
                    className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    title="Edit prompt"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive"
                    title="Delete prompt"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {prompt.artlist_video_url && (
            <div className="lg:w-72 xl:w-80 p-4 border-t lg:border-t-0 lg:border-l border-border bg-background/30 shrink-0">
              <ArtlistEmbed url={prompt.artlist_video_url} videoSrc={prompt.artlist_video_src} />
            </div>
          )}
        </div>
      </div>

      <CommentsDrawer
        promptId={prompt.id}
        open={commentsOpen}
        onOpenChange={(open) => {
          setCommentsOpen(open)
          if (!open) {
            fetch(`/api/comments/${prompt.id}`)
              .then((r) => r.json())
              .then((data) => setCommentCount(data.length))
              .catch(() => {})
          }
        }}
      />
    </>
  )
}
