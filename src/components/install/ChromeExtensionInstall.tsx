'use client'

import { useState } from 'react'
import { Download, Check } from 'lucide-react'

export function ChromeExtensionInstall() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('chrome-extension')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
          <span className="text-xl">🎬</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Production Hub Extension</p>
          <p className="text-xs text-muted-foreground">Chrome Extension · v2.4</p>
        </div>
        <a
          href="/production-hub-extension-v2.4.zip"
          download="production-hub-extension-v2.4.zip"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
        >
          <Download className="h-3 w-3" />
          Download v2.4
        </a>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Or ask your team admin to share the <button onClick={handleCopy} className="font-mono underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
          {copied ? <span className="flex items-center gap-1 inline-flex"><Check className="h-2.5 w-2.5" />copied!</span> : 'chrome-extension'}
        </button> folder directly.
      </p>
    </div>
  )
}
