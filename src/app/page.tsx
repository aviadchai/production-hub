import { AppLayout } from '@/components/layout/AppLayout'
import { DepartmentTabs } from '@/components/layout/DepartmentTabs'
import { projects, currentUser, departments } from '@/lib/mock-data'

export default function DashboardPage() {
  const userDept = departments.find((d) => d.id === currentUser.department_id)
  const activeProjects = projects.filter((p) => p.status === 'active')

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {currentUser.full_name.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {userDept?.name_en} Department
          </p>
        </div>
        <DepartmentTabs activeProjects={activeProjects} currentDeptId={currentUser.department_id} />
      </div>
    </AppLayout>
  )
}
