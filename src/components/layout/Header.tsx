'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('global-search')?.focus()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/projects?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-6 gap-4">
      {title && (
        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
      )}
      <form onSubmit={handleSearch} className="flex-1 max-w-sm mr-auto">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="global-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש... (Ctrl+K)"
            className="pr-9 h-8 text-sm bg-secondary/60 border-0 focus-visible:ring-1"
          />
        </div>
      </form>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 rounded border border-border text-[10px] font-mono">⌘K</kbd>
      </div>
    </header>
  )
}
