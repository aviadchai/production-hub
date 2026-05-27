export const dynamic = 'force-dynamic'

import { AppLayout } from '@/components/layout/AppLayout'
import { DepartmentTabs } from '@/components/layout/DepartmentTabs'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { departments, currentUser } from '@/lib/mock-data'
import { db } from '@/lib/supabase'

export default async function DashboardPage() {
  const userDept = departments.find((d) => d.slug === currentUser.department_slug)

  let activeProjects: { id: string; name: string; description: string | null; department_slug: string; department_name: string; status: 'active' | 'archived'; created_by_name: string; scene_count: number; prompt_count: number }[] = []
  let stats = { totalProjects: 0, totalPrompts: 0, aiEngineUsage: {} as Record<string, number> }

  try {
    const supabase = db()
    const [{ data: projects }, { data: promptRows }] = await Promise.all([
      supabase.from('project_stats').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('prompts').select('ai_model'),
    ])

    activeProjects = (projects ?? []).map((p) => ({ ...p, created_by_name: p.created_by || 'Unknown' }))

    const aiEngineUsage: Record<string, number> = {}
    for (const p of promptRows ?? []) {
      aiEngineUsage[p.ai_model] = (aiEngineUsage[p.ai_model] || 0) + 1
    }

    stats = { totalProjects: projects?.length ?? 0, totalPrompts: promptRows?.length ?? 0, aiEngineUsage }
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {currentUser.full_name.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{userDept?.name_en} Department</p>
        </div>

        <StatsCards stats={stats} />

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Projects by Department
          </h2>
          <DepartmentTabs activeProjects={activeProjects} currentDeptSlug={currentUser.department_slug} />
        </div>
      </div>
    </AppLayout>
  )
}
