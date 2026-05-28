'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Download, MousePointer, Zap, Check, Copy, ExternalLink, Film, Settings2, Sparkles } from 'lucide-react'

const VERSION = 'v2.5'
const ZIP = `/prompt-manager-extension-${VERSION}.zip`

export default function InstallPage() {
  const [step, setStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText('chrome://extensions')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AppLayout title="Install Extension">
      <div className="max-w-xl space-y-8">

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Install the Chrome Extension</h1>
            <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">{VERSION}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Adds a save button directly on Artlist videos — 3 quick steps.
          </p>
        </div>

        {/* Step 1 */}
        <Step
          number={1}
          icon={<Download className="h-4 w-4" />}
          title="Download the extension"
          done={step >= 1}
        >
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-xl">🔒</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Prompt Manager Extension</p>
              <p className="text-xs text-muted-foreground">Chrome Extension · {VERSION}</p>
            </div>
            <a
              href={ZIP}
              download={`prompt-manager-extension-${VERSION}.zip`}
              onClick={() => setTimeout(() => setStep(s => Math.max(s, 1)), 1500)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors shrink-0"
            >
              {step >= 1 ? <Check className="h-3 w-3" /> : <Download className="h-3 w-3" />}
              {step >= 1 ? 'Downloaded' : `Download ${VERSION}`}
            </a>
          </div>
          {step >= 1 && (
            <p className="text-xs text-emerald-400 mt-2">
              File saved as <span className="font-mono">prompt-manager-extension-{VERSION}.zip</span> — unzip it first.
            </p>
          )}
        </Step>

        {/* Step 2 */}
        <Step
          number={2}
          icon={<MousePointer className="h-4 w-4" />}
          title="Load into Chrome"
          done={step >= 2}
          dimmed={step < 1}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Copy this address, paste it in Chrome's address bar and press Enter:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-secondary border border-border rounded-lg px-3 py-2 font-mono select-all">
                chrome://extensions
              </code>
              <button
                onClick={copyUrl}
                disabled={step < 1}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors disabled:opacity-40 shrink-0"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>1. Enable <span className="text-foreground font-medium">Developer mode</span> (toggle top-right)</p>
              <p>2. Click <span className="text-foreground font-medium">Load unpacked</span> → select the unzipped folder</p>
            </div>
            {step >= 1 && step < 2 && (
              <button
                onClick={() => setStep(2)}
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Done? Continue →
              </button>
            )}
          </div>
        </Step>

        {/* Step 3 */}
        <Step
          number={3}
          icon={<Zap className="h-4 w-4" />}
          title="Use it on Artlist"
          done={step >= 3}
          dimmed={step < 2}
        >
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Go to <span className="text-foreground font-medium">toolkit.artlist.io</span>, hover over any AI-generated video
              and click <span className="text-foreground font-medium">🎬 Save to Prompt Manager</span>.
            </p>
            <div className="flex gap-2">
              <a
                href="https://toolkit.artlist.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-secondary transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Open Artlist Toolkit
              </a>
              {step >= 2 && (
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                >
                  <Check className="h-3 w-3" />
                  It works!
                </button>
              )}
            </div>
          </div>
        </Step>

        {step >= 3 && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center space-y-1">
            <p className="font-semibold text-emerald-400">You&apos;re all set!</p>
            <p className="text-xs text-muted-foreground">The extension is active on toolkit.artlist.io</p>
          </div>
        )}

        {/* Settings tip */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Customize the button style</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Click the <span className="text-foreground font-medium">🔒 extension icon</span> in your Chrome toolbar to open the settings panel.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: '🖱️', label: 'Hover', desc: 'Shows on video hover' },
              { icon: '📌', label: 'Corner', desc: 'Fixed in corner, never in the way' },
              { icon: '🚫', label: 'Off', desc: 'Use the extension icon only' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border bg-secondary/30 p-2.5 space-y-1 text-center">
                <div className="text-base">{item.icon}</div>
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            You can also toggle the <span className="text-foreground">⚡ Insert Prompt</span> button on/off from the same panel.
          </p>
        </div>

        {/* What gets captured */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">What gets captured automatically</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Artlist URL',      status: 'always' },
              { label: 'Video dimensions', status: 'always' },
              { label: 'Aspect ratio',     status: 'always' },
              { label: 'Prompt text',      status: 'when visible' },
              { label: 'AI model',         status: 'when visible' },
              { label: 'Frame rate',       status: 'when visible' },
              { label: 'Duration',         status: 'when visible' },
              { label: 'Direct video URL', status: 'when available' },
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

        {/* What's new */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">What&apos;s new in {VERSION}</h3>
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {[
              'Settings panel in the extension icon — click it to customize',
              'Fixed corner button mode — stays out of the way of Artlist controls',
              'Toggle Insert Prompt and Save button independently',
              'New lock + P icon',
              'Auth status visible directly in the extension popup',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </AppLayout>
  )
}

function Step({ number, icon, title, children, done, dimmed }: {
  number: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  done?: boolean
  dimmed?: boolean
}) {
  return (
    <div className={`flex gap-4 transition-opacity ${dimmed ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
          done ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'border-border bg-secondary'
        }`}>
          {done ? <Check className="h-3.5 w-3.5" /> : number}
        </div>
        {number < 3 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
      </div>
      <div className="pb-6 space-y-3 min-w-0 flex-1">
        <div className="flex items-center gap-2 h-8">
          <span className="text-muted-foreground">{icon}</span>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )
}
