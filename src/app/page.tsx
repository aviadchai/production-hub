export const dynamic = 'force-dynamic'

import { AppLayout } from '@/components/layout/AppLayout'
import { DepartmentTabs } from '@/components/layout/DepartmentTabs'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { db } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()
  const firstName = session?.displayName?.split(' ')[0] ?? 'there'

  let deptName: string | null = null
  let activeProjects: { id: string; name: string; description: string | null; department_slug: string; department_name: string; status: 'active' | 'archived'; created_by_name: string; scene_count: number; prompt_count: number }[] = []
  let stats = { totalProjects: 0, totalPrompts: 0, aiEngineUsage: {} as Record<string, number> }

  try {
    const supabase = db()
    const [{ data: projects }, { data: promptRows }, { data: userRow }] = await Promise.all([
      supabase.from('project_stats').select('*').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('prompts').select('ai_model'),
      session ? supabase.from('users').select('department_id').eq('id', session.id).maybeSingle() : Promise.resolve({ data: null }),
    ])

    activeProjects = (projects ?? []).map((p) => ({ ...p, created_by_name: p.created_by || 'Unknown' }))

    const aiEngineUsage: Record<string, number> = {}
    for (const p of promptRows ?? []) {
      aiEngineUsage[p.ai_model] = (aiEngineUsage[p.ai_model] || 0) + 1
    }

    stats = { totalProjects: projects?.length ?? 0, totalPrompts: promptRows?.length ?? 0, aiEngineUsage }

    if (userRow?.department_id) {
      // department_id is a slug or ID — try to match
      deptName = userRow.department_id
    }
  } catch {
    // Supabase not configured yet — show empty state
  }

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          {deptName && (
            <p className="text-sm text-muted-foreground mt-1">{deptName}</p>
          )}
        </div>

        <StatsCards stats={stats} />

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Projects by Department
          </h2>
          <DepartmentTabs activeProjects={activeProjects} currentDeptSlug={deptName ?? 'production'} />
        </div>
      </div>
    </AppLayout>
  )
}
