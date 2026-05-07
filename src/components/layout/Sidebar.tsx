'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, Heart, Settings, Users, Film } from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentUser } from '@/lib/mock-data'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'All Projects', icon: FolderOpen },
  { href: '/favorites', label: 'Favorites', icon: Heart },
]

const adminItems = [
  { href: '/admin/users', label: 'Manage Users', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-sidebar border-r border-border flex flex-col z-40">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-foreground" />
          <span className="font-bold text-sm tracking-tight">Production Hub</span>
        </div>
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

        {currentUser.role === 'admin' && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                Admin
              </p>
            </div>
            {adminItems.map(({ href, label, icon: Icon }) => (
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
          </>
        )}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 mt-1">
          <div className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{currentUser.full_name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
