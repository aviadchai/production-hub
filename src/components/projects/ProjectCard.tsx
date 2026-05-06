import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Film, Layers } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  department_name: string
  department_slug: string
  status: 'active' | 'archived'
  created_by_name: string
  scene_count: number
  prompt_count: number
}

const deptColors: Record<string, string> = {
  production: 'bg-white/10 text-white',
  design: 'bg-white/10 text-white',
  content: 'bg-white/10 text-white',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-xl border border-border bg-card hover:bg-card/80 hover:border-border/60 transition-all p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-tight group-hover:text-foreground/90 transition-colors">
          {project.name}
        </h3>
        {project.status === 'archived' && (
          <Badge variant="secondary" className="text-[10px] h-4 shrink-0">
            ארכיון
          </Badge>
        )}
      </div>

      {project.description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Badge
          variant="outline"
          className="text-[10px] h-5"
        >
          {project.department_name}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
        <span className="flex items-center gap-1">
          <Layers className="h-3 w-3" />
          {project.scene_count} סצנות
        </span>
        <span className="flex items-center gap-1">
          <Film className="h-3 w-3" />
          {project.prompt_count} פרומפטים
        </span>
        <span className="mr-auto text-[10px]">{project.created_by_name}</span>
      </div>
    </Link>
  )
}
