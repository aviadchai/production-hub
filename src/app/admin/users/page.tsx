'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldCheck, UserX, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  display_name: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => { setUsers(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const patch = async (id: string, body: object, msg: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) { toast.success(msg); load() }
    else toast.error('Failed')
  }

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('User deleted'); load() }
    else toast.error('Failed')
  }

  return (
    <AppLayout title="User Management">
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{users.length} registered users</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Username</th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="py-2.5 px-4" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-bold shrink-0">
                          {u.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{u.display_name}</p>
                          {u.is_admin && <p className="text-[10px] text-orange-400">Admin</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground font-mono">@{u.username}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {u.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title={u.is_admin ? 'Remove admin' : 'Make admin'}
                          onClick={() => patch(u.id, { is_admin: !u.is_admin }, u.is_admin ? 'Admin removed' : 'Admin granted')}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title={u.is_active ? 'Block user' : 'Unblock user'}
                          onClick={() => patch(u.id, { is_active: !u.is_active }, u.is_active ? 'User blocked' : 'User unblocked')}
                        >
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          title="Delete user"
                          onClick={() => remove(u.id, u.display_name)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
