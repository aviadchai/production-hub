export const dynamic = 'force-dynamic'

import { AppLayout } from '@/components/layout/AppLayout'
import { PromptCard } from '@/components/prompts/PromptCard'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'

export default async function FavoritesPage() {
  type PromptRow = {
    id: string; scene_id: string; prompt_text: string; notes: string | null
    ai_model: string; artlist_video_url: string | null; artlist_video_src: string | null
    created_by: string | null; created_at: string
    is_favorited: boolean; comment_count: number; created_by_name: string
  }

  let prompts: PromptRow[] = []

  try {
    const supabase = db()
    const { data: favs } = await supabase.from('favorites').select('prompt_id').eq('user_id', CURRENT_USER_EMAIL)
    const promptIds = (favs ?? []).map((f) => f.prompt_id)

    if (promptIds.length > 0) {
      const [{ data: rawPrompts }, { data: commentRows }] = await Promise.all([
        supabase.from('prompts').select('*').in('id', promptIds).order('created_at', { ascending: false }),
        supabase.from('comments').select('prompt_id').in('prompt_id', promptIds),
      ])

      const commentCountMap: Record<string, number> = {}
      for (const c of commentRows ?? []) {
        commentCountMap[c.prompt_id] = (commentCountMap[c.prompt_id] || 0) + 1
      }

      prompts = (rawPrompts ?? []).map((p) => ({
        ...p, is_favorited: true, comment_count: commentCountMap[p.id] || 0, created_by_name: p.created_by || 'Unknown',
      }))
    }
  } catch {
    // Supabase not configured yet
  }

  return (
    <AppLayout title="Favorites">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{prompts.length} saved prompts</p>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            <p className="font-medium mb-1">No favorites yet</p>
            <p className="text-xs">Click the heart on any prompt to save it here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
