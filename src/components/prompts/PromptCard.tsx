'use client'

import { useState } from 'react'
import { Copy, Heart, MessageCircle, Check, BookMarked } from 'lucide-react'
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

  const handleSaveToLibrary = async () => {
    const title = prompt.prompt_text.slice(0, 60).trim() + (prompt.prompt_text.length > 60 ? '...' : '')
    const res = await fetch('/api/saved-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, prompt_text: prompt.prompt_text }),
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
    await navigator.clipboard.writeText(prompt.prompt_text)
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

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-border/80 transition-colors">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-5 space-y-3 min-w-0">
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

            <p className={cn(
              "text-sm leading-relaxed font-mono",
              prompt.prompt_text ? "text-foreground/90" : "text-muted-foreground/40 italic"
            )}>
              {prompt.prompt_text || "No prompt text"}
            </p>

            {prompt.notes && (
              <p className="text-xs text-muted-foreground border-l-2 border-border pl-3 leading-relaxed">
                {prompt.notes}
              </p>
            )}

            <div className="flex items-center gap-1 pt-1">
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
            </div>
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
