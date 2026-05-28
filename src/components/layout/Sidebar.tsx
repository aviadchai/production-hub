'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, FolderOpen, Heart, Settings, Users, Film, Download, BookMarked, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Me { displayName: string; username: string; isAdmin: boolean }

// Keep in sync with chrome-extension/manifest.json version
const LATEST_EXT_VERSION = '2.5.0'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'All Projects', icon: FolderOpen },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/saved-prompts', label: 'Prompt Library', icon: BookMarked },
  { href: '/install', label: 'Artlist Shortcut', icon: Download },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d?.authenticated) setMe(d) }).catch(() => {})
  }, [])

  // Check if the Chrome extension needs updating
  useEffect(() => {
    const dismissed = sessionStorage.getItem('pm-ext-update-dismissed')
    if (dismissed === LATEST_EXT_VERSION) return

    // Give content.js a moment to inject the attribute
    const timer = setTimeout(() => {
      const installedVer = document.documentElement.getAttribute('data-pm-ext-version')
      if (installedVer && installedVer !== LATEST_EXT_VERSION) {
        toast.warning(
          `Extension update available (v${LATEST_EXT_VERSION})`,
          {
            description: `You have v${installedVer}. Download the new version from the Artlist Shortcut page.`,
            duration: 10000,
            action: {
              label: 'Update',
              onClick: () => router.push('/install'),
            },
            onDismiss: () => sessionStorage.setItem('pm-ext-update-dismissed', LATEST_EXT_VERSION),
          }
        )
      }
    }, 3000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-sidebar border-r border-border flex flex-col z-40">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Film className="h-5 w-5 text-foreground shrink-0" />
          <span className="font-bold text-sm tracking-tight">Prompt Manager</span>
        </div>
        <span className="text-[10px] text-muted-foreground/50 font-mono shrink-0">v2.5</span>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-secondary text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {me?.isAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">Admin</p>
            </div>
            <Link
              href="/admin/users"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                pathname === '/admin/users'
                  ? 'bg-secondary text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <Users className="h-4 w-4 shrink-0" />
              Manage Users
            </Link>
          </>
        )}
      </nav>

      <div className="p-3 border-t border-border space-y-0.5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>

        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
            {me?.displayName?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium truncate">{me?.displayName ?? '...'}</p>
            <p className="text-[10px] text-muted-foreground truncate">@{me?.username ?? ''}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
