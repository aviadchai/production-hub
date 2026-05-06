'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { comments as allComments, timeAgo } from '@/lib/mock-data'
import { Send } from 'lucide-react'

interface CommentsDrawerProps {
  promptId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommentsDrawer({ promptId, open, onOpenChange }: CommentsDrawerProps) {
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(
    allComments.filter((c) => c.prompt_id === promptId)
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setLocalComments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        prompt_id: promptId,
        author_name: 'אביד חי',
        body: newComment.trim(),
        created_at: new Date().toISOString(),
      },
    ])
    setNewComment('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-96 flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="text-base">תגובות ({localComments.length})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {localComments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              אין תגובות עדיין. הוסף את הראשונה!
            </p>
          )}
          {localComments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                  {comment.author_name.charAt(0)}
                </div>
                <span className="text-xs font-medium">{comment.author_name}</span>
                <span className="text-[10px] text-muted-foreground mr-auto">
                  {timeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-sm text-foreground/90 pr-8 leading-relaxed">{comment.body}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-border space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="כתוב תגובה..."
            className="resize-none min-h-[80px] text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e)
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">Ctrl+Enter לשליחה</p>
            <Button type="submit" size="sm" className="gap-2 h-7 text-xs" disabled={!newComment.trim()}>
              <Send className="h-3 w-3" />
              שלח
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
