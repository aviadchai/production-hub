'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { projects, departments, deptColors } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
]

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  const filteredByStatus = projects.filter((p) =>
    statusFilter === 'all' ? true : p.status === statusFilter
  )

  const matchesSearch = (p: typeof projects[0]) =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())

  return (
    <AppLayout title="All Projects">
      <div className="space-y-8 max-w-6xl">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="pl-9 h-8 text-sm"
            />
          </div>
          <div className="flex gap-1">
            {statusFilters.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s.id
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {departments.map((dept) => {
          const deptProjects = filteredByStatus
            .filter((p) => p.department_id === dept.id && matchesSearch(p))
          if (deptProjects.length === 0) return null
          const colors = deptColors[dept.id]

          return (
            <div key={dept.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
                <h2 className="text-sm font-semibold">{dept.name_en}</h2>
                <span className="text-[11px] text-muted-foreground">{deptProjects.length} projects</span>
                <div className="flex-1 h-px bg-border ml-2" />
              </div>

              <div className={`rounded-xl bg-gradient-to-br ${colors.gradient} p-4 -mx-4`}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {deptProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} deptId={project.department_id} />
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {filteredByStatus.filter(matchesSearch).length === 0 && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No projects found
          </div>
        )}
      </div>
    </AppLayout>
  )
}
