'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Film, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showAccessCode, setShowAccessCode] = useState(false)

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    password: '',
    accessCode: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    setError('')
    setLoading(true)

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const body = mode === 'login'
      ? { username: form.username, password: form.password }
      : { username: form.username, displayName: form.displayName, password: form.password, accessCode: form.accessCode }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
              <Film className="h-5 w-5 text-background" />
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Production Hub</h1>
          <p className="text-xs text-muted-foreground">For team members only</p>
        </div>

        <div className="flex rounded-lg border border-border p-1 gap-1">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === m ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Display Name</Label>
                <Input value={form.displayName} onChange={set('displayName')} placeholder="Your full name" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Access Code</Label>
                <div className="relative">
                  <Input
                    value={form.accessCode}
                    onChange={set('accessCode')}
                    placeholder="Team access code"
                    className="h-9 text-sm pr-9"
                    type={showAccessCode ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAccessCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">Ask your team admin for the code</p>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Username</Label>
            <Input
              value={form.username}
              onChange={set('username')}
              placeholder="username"
              className="h-9 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                className="h-9 text-sm pr-9"
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button className="w-full h-9 text-sm" onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  )
}
