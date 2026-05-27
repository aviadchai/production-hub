import Link from 'next/link'
import { Film, Layers } from 'lucide-react'
import { deptColors } from '@/lib/mock-data'

interface Project {
  id: string
  name: string
  description: string | null
  department_name: string
  department_slug: string
  status: 'active' | 'archived'
  created_by_name: string
  scene_count: number
  prompt_count: number
}

export function ProjectCard({ project, deptSlug }: { project: Project; deptSlug?: string }) {
  const colors = deptSlug ? deptColors[deptSlug] : null

  return (
    <Link
      href={`/projects/${project.id}`}
      className={`group block rounded-xl border bg-card hover:bg-card/80 transition-all p-5 space-y-3 ${
        colors ? colors.border : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-foreground/90 transition-colors">
          {project.name}
        </h3>
        {project.status === 'archived' && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">
            Archived
          </span>
        )}
      </div>

      {project.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      {colors && (
        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${colors.badge}`}>
          <div className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {project.department_name}
        </span>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
        <span className="flex items-center gap-1">
          <Layers className="h-3 w-3" />
          {project.scene_count} scenes
        </span>
        <span className="flex items-center gap-1">
          <Film className="h-3 w-3" />
          {project.prompt_count} prompts
        </span>
        <span className="ml-auto text-[10px]">{project.created_by_name}</span>
      </div>
    </Link>
  )
}
