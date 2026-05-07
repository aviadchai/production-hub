'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { projects } from '@/lib/mock-data'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

const deptFilters = [
  { id: 'all', label: 'All' },
  { id: '1', label: 'Production' },
  { id: '2', label: 'Design' },
  { id: '3', label: 'Content' },
]

const statusFilters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'archived', label: 'Archived' },
]

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('active')

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || p.department_id === deptFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchDept && matchStatus
  })

  return (
    <AppLayout title="All Projects">
      <div className="space-y-6 max-w-6xl">
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
            {deptFilters.map((d) => (
              <button
                key={d.id}
                onClick={() => setDeptFilter(d.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  deptFilter === d.id
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {d.label}
              </button>
            ))}
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

          <Badge variant="outline" className="text-[10px] h-5 ml-auto">
            {filtered.length} projects
          </Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            No projects found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
