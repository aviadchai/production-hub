import { AppLayout } from '@/components/layout/AppLayout'
import { PromptCard } from '@/components/prompts/PromptCard'
import { Button } from '@/components/ui/button'
import { AssignMembersButton } from '@/components/projects/AssignMembersButton'
import { ProjectReferences } from '@/components/projects/ProjectReferences'
import { NewPromptModal } from '@/components/prompts/NewPromptModal'
import { deptColors } from '@/lib/mock-data'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Layers, Film, Plus } from 'lucide-react'
import { DeleteProjectButton } from '@/components/projects/DeleteProjectButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params

  let project: { id: string; name: string; description: string | null; department_slug: string; department_name: string; status: string; scene_count: number; prompt_count: number } | null = null
  let scenes: { id: string; title: string; order_index: number }[] = []
  let prompts: {
    id: string; scene_id: string; prompt_text: string; notes: string | null
    ai_model: string; artlist_video_url: string | null; artlist_video_src: string | null
    created_by: string | null; created_at: string
    is_favorited: boolean; comment_count: number; created_by_name: string
  }[] = []

  try {
    const supabase = db()

    const { data: proj } = await supabase.from('project_stats').select('*').eq('id', id).maybeSingle()
    if (!proj) notFound()
    project = proj

    const { data: sceneRows } = await supabase.from('scenes').select('*').eq('project_id', id).order('order_index')
    scenes = sceneRows ?? []

    const sceneIds = scenes.map((s) => s.id)
    if (sceneIds.length > 0) {
      const [{ data: rawPrompts }, { data: favs }] = await Promise.all([
        supabase.from('prompts').select('*').in('scene_id', sceneIds).order('created_at'),
        supabase.from('favorites').select('prompt_id').eq('user_id', CURRENT_USER_EMAIL),
      ])

      const promptIds = (rawPrompts ?? []).map((p) => p.id)
      const { data: commentRows } = promptIds.length > 0
        ? await supabase.from('comments').select('prompt_id').in('prompt_id', promptIds)
        : { data: [] }

      const favSet = new Set((favs ?? []).map((f) => f.prompt_id))
      const commentCountMap: Record<string, number> = {}
      for (const c of commentRows ?? []) {
        commentCountMap[c.prompt_id] = (commentCountMap[c.prompt_id] || 0) + 1
      }

      prompts = (rawPrompts ?? []).map((p) => ({
        ...p, is_favorited: favSet.has(p.id), comment_count: commentCountMap[p.id] || 0, created_by_name: p.created_by || 'Unknown',
      }))
    }
  } catch {
    if (!project) notFound()
  }

  if (!project) notFound()

  const colors = deptColors[project.department_slug] ?? deptColors['production']

  return (
    <AppLayout title={project.name}>
      <div className="space-y-8 max-w-5xl">
        <div className={`rounded-xl bg-gradient-to-br ${colors.gradientStrong} border ${colors.border} p-5 space-y-3`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${colors.badge}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                  {project.department_name}
                </span>
                {project.status === 'archived' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Archived</span>
                )}
              </div>
              <h1 className="text-xl font-bold">{project.name}</h1>
              {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <DeleteProjectButton projectId={id} />
              <NewPromptModal projectId={id} scenes={scenes} />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap border-t border-white/5 pt-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Layers className="h-3 w-3" />{project.scene_count} scenes
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Film className="h-3 w-3" />{project.prompt_count} prompts
            </span>
            <div className="ml-auto">
              <AssignMembersButton initialMembers={['1', '2']} />
            </div>
          </div>
        </div>

        <ProjectReferences projectId={id} />

        {scenes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            No scenes yet. Add a prompt from Artlist using the extension.
          </div>
        ) : (
          <div className="space-y-8">
            {scenes.map((scene, idx) => {
              const scenePrompts = prompts.filter((p) => p.scene_id === scene.id)
              return (
                <div key={scene.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground/50 w-5 text-center">{idx + 1}</span>
                    <h2 className="text-sm font-semibold">{scene.title}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-muted-foreground">{scenePrompts.length} prompts</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                      <Plus className="h-3 w-3" />Add
                    </Button>
                  </div>

                  {scenePrompts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-lg ml-8">
                      No prompts in this scene
                    </div>
                  ) : (
                    <div className="space-y-3 ml-8">
                      {scenePrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
