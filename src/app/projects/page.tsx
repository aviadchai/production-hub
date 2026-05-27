'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { departments, deptColors } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronRight, FolderOpen, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description: string | null
  department_slug: string
  department_name: string
  status: 'active' | 'archived'
  quarter: string | null
  year: number | null
  created_by_name: string
  scene_count: number
  prompt_count: number
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'] as const
type Quarter = typeof quarters[number]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState<string | null>(null)
  const [quarterFilter, setQuarterFilter] = useState<Quarter | 'all'>('all')
  const [newOpen, setNewOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', department_slug: 'production', quarter: '', year: new Date().getFullYear() })
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setCreating(true)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const { id } = await res.json()
      toast.success('Project created!')
      setNewOpen(false)
      setForm({ name: '', description: '', department_slug: 'production', quarter: '', year: new Date().getFullYear() })
      // Refresh list
      fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {})
    } else {
      toast.error('Failed to create project')
    }
    setCreating(false)
  }

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { setProjects(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const dept = departments.find((d) => d.slug === selectedDept)

  if (loading) {
    return (
      <AppLayout title="All Projects">
        <div className="flex items-center justify-center py-32 text-sm text-muted-foreground">
          Loading...
        </div>
      </AppLayout>
    )
  }

  if (selectedDept && dept) {
    const colors = deptColors[dept.slug]
    const deptProjects = projects.filter((p) => {
      if (p.department_slug !== dept.slug) return false
      if (quarterFilter !== 'all' && p.quarter !== quarterFilter) return false
      return true
    })
    const activeCount = deptProjects.filter((p) => p.status === 'active').length
    const archivedCount = deptProjects.filter((p) => p.status === 'archived').length

    return (
      <AppLayout title={dept.name_en}>
        <div className="space-y-6 max-w-6xl">
          <button
            onClick={() => { setSelectedDept(null); setQuarterFilter('all') }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            All Departments
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{dept.name_en}</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className={cn('h-3 w-3 rounded-full shrink-0', colors.dot)} />
              <h1 className="text-lg font-bold truncate">{dept.name_en}</h1>
              <span className="text-xs text-muted-foreground shrink-0">
                {activeCount} active{archivedCount > 0 ? ` · ${archivedCount} archived` : ''}
              </span>
            </div>
            <Button size="sm" className="gap-2" onClick={() => { setForm(f => ({ ...f, department_slug: dept.slug })); setNewOpen(true) }}>
              <Plus className="h-3.5 w-3.5" />New Project
            </Button>
            <div className="flex gap-1">
              <button
                onClick={() => setQuarterFilter('all')}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  quarterFilter === 'all' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >All</button>
              {quarters.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuarterFilter(q)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    quarterFilter === q ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >{q}</button>
              ))}
            </div>
          </div>

          {deptProjects.length > 0 ? (
            <div className={cn('rounded-xl bg-gradient-to-br p-4 -mx-4', colors.gradient)}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {deptProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} deptSlug={project.department_slug} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No projects in {quarterFilter !== 'all' ? quarterFilter : 'this department'}
            </div>
          )}
        </div>

        <NewProjectDialog
          open={newOpen}
          onOpenChange={setNewOpen}
          form={form}
          setForm={setForm}
          onCreate={handleCreate}
          creating={creating}
        />
      </AppLayout>
    )
  }

  // Department overview
  return (
    <AppLayout title="All Projects">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold">All Projects</h1>
            <p className="text-sm text-muted-foreground">Select a department to browse projects</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setNewOpen(true)}>
            <Plus className="h-3.5 w-3.5" />New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {departments.map((d) => {
            const colors = deptColors[d.slug]
            const total = projects.filter((p) => p.department_slug === d.slug)
            const active = total.filter((p) => p.status === 'active')
            const archived = total.filter((p) => p.status === 'archived')
            const byQuarter = quarters.reduce<Record<string, number>>((acc, q) => {
              acc[q] = total.filter((p) => p.quarter === q).length
              return acc
            }, {})

            return (
              <button
                key={d.slug}
                onClick={() => setSelectedDept(d.slug)}
                className={cn(
                  'group text-left rounded-xl border p-5 transition-all hover:scale-[1.01] active:scale-[0.99]',
                  'bg-gradient-to-br', colors.gradient, colors.border
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-2.5 w-2.5 rounded-full', colors.dot)} />
                    <span className="font-semibold text-sm">{d.name_en}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-2xl font-bold tabular-nums">{active.length}</p>
                      <p className="text-[11px] text-muted-foreground">active</p>
                    </div>
                    {archived.length > 0 && (
                      <div>
                        <p className="text-2xl font-bold tabular-nums text-muted-foreground">{archived.length}</p>
                        <p className="text-[11px] text-muted-foreground">archived</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {quarters.map((q) =>
                      byQuarter[q] > 0 ? (
                        <span key={q} className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', colors.badge)}>
                          {q} · {byQuarter[q]}
                        </span>
                      ) : null
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <NewProjectDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        form={form}
        setForm={setForm}
        onCreate={handleCreate}
        creating={creating}
      />
    </AppLayout>
  )
}

function NewProjectDialog({ open, onOpenChange, form, setForm, onCreate, creating }: {
  open: boolean
  onOpenChange: (v: boolean) => void
  form: { name: string; description: string; department_slug: string; quarter: string; year: number }
  setForm: React.Dispatch<React.SetStateAction<{ name: string; description: string; department_slug: string; quarter: string; year: number }>>
  onCreate: () => void
  creating: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm">New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Project Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder='e.g. "Q3 Brand Campaign"'
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && onCreate()}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What is this project about?"
              className="text-sm resize-none min-h-[72px]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5 col-span-1">
              <Label className="text-xs">Department</Label>
              <select
                value={form.department_slug}
                onChange={(e) => setForm(f => ({ ...f, department_slug: e.target.value }))}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {departments.map(d => <option key={d.slug} value={d.slug}>{d.name_en}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Quarter</Label>
              <select
                value={form.quarter}
                onChange={(e) => setForm(f => ({ ...f, quarter: e.target.value }))}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="">—</option>
                {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Year</Label>
              <Input
                type="number"
                value={form.year}
                onChange={(e) => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={onCreate} disabled={!form.name.trim() || creating}>
            {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create Project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
