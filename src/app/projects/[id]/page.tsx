import { AppLayout } from '@/components/layout/AppLayout'
import { PromptCard } from '@/components/prompts/PromptCard'
import { Badge } from '@/components/ui/badge'
import { projects, scenes, prompts } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { Layers, Film, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = projects.find((p) => p.id === id)
  if (!project) notFound()

  const projectScenes = scenes
    .filter((s) => s.project_id === id)
    .sort((a, b) => a.order_index - b.order_index)

  return (
    <AppLayout title={project.name}>
      <div className="space-y-8 max-w-5xl">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-muted-foreground">{project.description}</p>
              )}
            </div>
            <Button size="sm" className="gap-2 shrink-0">
              <Plus className="h-3.5 w-3.5" />
              פרומפט חדש
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {project.department_name}
            </Badge>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {project.scene_count} סצנות
            </span>
            <span className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              {project.prompt_count} פרומפטים
            </span>
            {project.status === 'archived' && (
              <Badge variant="secondary" className="text-[10px]">ארכיון</Badge>
            )}
          </div>
        </div>

        {projectScenes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            אין סצנות עדיין. הוסף את הראשונה!
          </div>
        ) : (
          <div className="space-y-8">
            {projectScenes.map((scene, idx) => {
              const scenePrompts = prompts.filter((p) => p.scene_id === scene.id)
              return (
                <div key={scene.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-muted-foreground/60 w-5 text-center">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-semibold">{scene.title}</h2>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] text-muted-foreground">
                      {scenePrompts.length} פרומפטים
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                      <Plus className="h-3 w-3" />
                      הוסף
                    </Button>
                  </div>

                  {scenePrompts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs border border-dashed border-border rounded-lg mr-8">
                      אין פרומפטים בסצנה זו
                    </div>
                  ) : (
                    <div className="space-y-3 mr-8">
                      {scenePrompts.map((prompt) => (
                        <PromptCard key={prompt.id} prompt={prompt} />
                      ))}
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
