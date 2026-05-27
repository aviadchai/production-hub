'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { departments } from '@/lib/mock-data'

interface Me { id: string; displayName: string; username: string; isAdmin: boolean; departmentId?: string }

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [me, setMe] = useState<Me | null>(null)

  // Profile
  const [displayName, setDisplayName] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  // Password
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.authenticated) {
          setMe(d)
          setDisplayName(d.displayName ?? '')
          setDepartmentId(d.departmentId ?? '')
        }
      })
      .catch(() => {})
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    setSaveMsg('')
    const res = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName, departmentId: departmentId || null }),
    })
    setSaving(false)
    if (res.ok) {
      setSaveMsg('Saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } else {
      const d = await res.json()
      setSaveMsg(d.error || 'Failed to save')
    }
  }

  const changePassword = async () => {
    setPwError('')
    setPwMsg('')
    if (!currentPw || !newPw) { setPwError('Both fields required'); return }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return }
    setPwSaving(true)
    const res = await fetch('/api/auth/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    })
    setPwSaving(false)
    if (res.ok) {
      setPwMsg('Password changed!')
      setCurrentPw('')
      setNewPw('')
      setTimeout(() => setPwMsg(''), 3000)
    } else {
      const d = await res.json()
      setPwError(d.error || 'Failed to change password')
    }
  }

  return (
    <AppLayout title="Settings">
      <div className="space-y-8 max-w-xl">

        {/* Profile */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Profile</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Update your personal details</p>
          </div>
          <Separator />
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Username</Label>
              <Input value={me?.username ?? ''} className="h-8 text-sm" disabled />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Display Name</Label>
              <Input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your full name"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">— No department —</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name_en}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" className="h-7 text-xs" onClick={saveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save changes'}
              </Button>
              {saveMsg && (
                <span className={`text-xs flex items-center gap-1 ${saveMsg === 'Saved!' ? 'text-emerald-400' : 'text-destructive'}`}>
                  {saveMsg === 'Saved!' && <Check className="h-3 w-3" />}
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Appearance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred theme</p>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground capitalize">{theme ?? 'dark'}</p>
            </div>
            <div className="flex gap-1">
              {(['dark', 'light'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                    theme === t ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Security</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Change your password</p>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="h-8 text-sm pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="h-8 text-sm pr-9"
                  onKeyDown={e => e.key === 'Enter' && changePassword()}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
            {pwError && <p className="text-xs text-destructive">{pwError}</p>}
            <div className="flex items-center gap-3">
              <Button size="sm" className="h-7 text-xs" onClick={changePassword} disabled={pwSaving}>
                {pwSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Change password'}
              </Button>
              {pwMsg && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  {pwMsg}
                </span>
              )}
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  )
}
