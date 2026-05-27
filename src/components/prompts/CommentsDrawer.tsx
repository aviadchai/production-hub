'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { timeAgo } from '@/lib/mock-data'
import { Send, Loader2 } from 'lucide-react'

interface Comment {
  id: string
  prompt_id: string
  author_name: string
  body: string
  created_at: string
}

interface CommentsDrawerProps {
  promptId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommentsDrawer({ promptId, open, onOpenChange }: CommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/comments/${promptId}`)
      .then((r) => r.json())
      .then((data) => { setComments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [open, promptId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || sending) return
    setSending(true)

    const res = await fetch(`/api/comments/${promptId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: newComment.trim() }),
    })

    if (res.ok) {
      const comment = await res.json()
      setComments((prev) => [...prev, comment])
      setNewComment('')
    }
    setSending(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96 flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="text-base">Comments ({comments.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                    {comment.author_name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium">{comment.author_name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 pl-8 leading-relaxed">{comment.body}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-border space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="resize-none min-h-[80px] text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">Ctrl+Enter to send</p>
            <Button type="submit" size="sm" className="gap-2 h-7 text-xs" disabled={!newComment.trim() || sending}>
              {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              Send
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
