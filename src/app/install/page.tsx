import { AppLayout } from '@/components/layout/AppLayout'
import { BookmarkletButton } from '@/components/install/BookmarkletButton'
import { Film, Bookmark, MousePointer, Zap } from 'lucide-react'

export default function InstallPage() {
  return (
    <AppLayout title="Setup">
      <div className="max-w-xl space-y-10">

        <div className="space-y-1">
          <h1 className="text-xl font-bold">Set up your Artlist shortcut</h1>
          <p className="text-sm text-muted-foreground">
            One-time setup — takes 10 seconds. Works in any browser.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <Step number={1} icon={<Bookmark className="h-4 w-4" />} title="Show your bookmarks bar">
            <p className="text-sm text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 rounded border border-border text-[11px] font-mono">Ctrl+Shift+B</kbd> in Chrome
              {' '}or{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-border text-[11px] font-mono">⌘+Shift+B</kbd> on Mac
            </p>
          </Step>

          <Step number={2} icon={<MousePointer className="h-4 w-4" />} title="Drag this button to your bookmarks bar">
            <p className="text-sm text-muted-foreground mb-4">
              Drag the button below directly into your bookmarks bar.
            </p>
            <BookmarkletButton />
          </Step>

          <Step number={3} icon={<Zap className="h-4 w-4" />} title="Use it on Artlist">
            <p className="text-sm text-muted-foreground">
              Go to <span className="text-foreground font-medium">toolkit.artlist.io</span>, open any generated video or image,
              and click <span className="text-foreground font-medium">Production Hub</span> in your bookmarks bar.
              The prompt, model, and video link will be pre-filled automatically.
            </p>
          </Step>
        </div>

        {/* How it works */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">What gets captured automatically</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Artlist URL', status: 'always' },
              { label: 'Video dimensions', status: 'always' },
              { label: 'Prompt text', status: 'when visible' },
              { label: 'AI model', status: 'when visible' },
              { label: 'Direct video link', status: 'when available' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  item.status === 'always' ? 'bg-emerald-400' : 'bg-yellow-400'
                }`} />
                <span className="text-foreground/80">{item.label}</span>
                <span className="text-muted-foreground text-[10px]">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          The bookmarklet only works on toolkit.artlist.io and only sends data to Production Hub.
          Nothing is shared externally.
        </p>
      </div>
    </AppLayout>
  )
}

function Step({ number, icon, title, children }: {
  number: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="h-8 w-8 rounded-full border border-border bg-secondary flex items-center justify-center text-xs font-bold">
          {number}
        </div>
        {number < 3 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
      </div>
      <div className="pb-6 space-y-2 min-w-0">
        <div className="flex items-center gap-2 h-8">
          <span className="text-muted-foreground">{icon}</span>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )
}
