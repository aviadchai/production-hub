'use client'

import { ExternalLink, Film } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtlistEmbedProps {
  url: string
}

function extractArtlistInfo(url: string) {
  try {
    const parsed = new URL(url)
    const assetId = parsed.searchParams.get('assetId')
    const width = parsed.searchParams.get('assetWidth') || '1280'
    const height = parsed.searchParams.get('assetHeight') || '720'
    const ratio = parsed.searchParams.get('assetAspectRatio') || '16:9'
    const isArtlist = parsed.hostname.includes('artlist.io')
    return { assetId, width, height, ratio, isArtlist }
  } catch {
    return null
  }
}

export function ArtlistEmbed({ url }: ArtlistEmbedProps) {
  const info = extractArtlistInfo(url)

  if (!info?.isArtlist) {
    return (
      <div className="w-full aspect-video bg-secondary/40 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        Invalid link
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <button
        onClick={() => window.open(url, '_blank')}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border group hover:border-border/60 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
      >
        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <Film className="h-6 w-6 text-white/70" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-white/80">Watch on Artlist</p>
          <p className="text-xs text-white/40">{info.ratio} · {info.width}×{info.height}</p>
        </div>
        <div className="absolute top-2 right-2">
          <ExternalLink className="h-3.5 w-3.5 text-white/30" />
        </div>
      </button>
      <p className="text-[10px] text-muted-foreground text-center">
        Opens in Artlist — sign in there to watch
      </p>
    </div>
  )
}
