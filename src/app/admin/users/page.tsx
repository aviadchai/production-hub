import { AppLayout } from '@/components/layout/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { departments } from '@/lib/mock-data'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

const mockUsers = [
  { id: '1', name: 'אביד חי', email: 'aviad@company.com', dept: '1', role: 'admin', joined: '2025-01-01' },
  { id: '2', name: 'שרה לוי', email: 'sarah@company.com', dept: '2', role: 'member', joined: '2025-02-10' },
  { id: '3', name: 'מיכאל כהן', email: 'michael@company.com', dept: '3', role: 'member', joined: '2025-03-05' },
  { id: '4', name: 'נועה שפירא', email: 'noa@company.com', dept: '1', role: 'member', joined: '2025-03-20' },
  { id: '5', name: 'יוסף אברהם', email: 'yosef@company.com', dept: '2', role: 'member', joined: '2025-04-01' },
]

export default function AdminUsersPage() {
  return (
    <AppLayout title="ניהול משתמשים">
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{mockUsers.length} משתמשים רשומים</p>
          <Link href="/admin/invite">
            <Button size="sm" className="gap-2 h-7 text-xs">
              <UserPlus className="h-3.5 w-3.5" />
              הזמן משתמש
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">שם</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">אימייל</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">מחלקה</th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground">תפקיד</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user, idx) => {
                const dept = departments.find((d) => d.id === user.dept)
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border last:border-0 ${idx % 2 === 0 ? '' : 'bg-secondary/20'}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-xs">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground" dir="ltr">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] h-4">{dept?.name_he}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.role === 'admin' ? 'default' : 'secondary'}
                        className="text-[10px] h-4"
                      >
                        {user.role === 'admin' ? 'אדמין' : 'חבר'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
