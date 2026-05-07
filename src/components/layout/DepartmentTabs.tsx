'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { departments } from '@/lib/mock-data'

interface Project {
  id: string
  name: string
  description: string
  department_id: string
  department_name: string
  department_slug: string
  status: 'active' | 'archived'
  created_by_name: string
  scene_count: number
  prompt_count: number
}

interface DepartmentTabsProps {
  activeProjects: Project[]
  currentDeptId: string
}

export function DepartmentTabs({ activeProjects, currentDeptId }: DepartmentTabsProps) {
  const [activeDept, setActiveDept] = useState(currentDeptId)

  const filtered = activeProjects.filter((p) => p.department_id === activeDept)

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-border">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => setActiveDept(dept.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeDept === dept.id
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {dept.name_en}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No active projects in this department
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
