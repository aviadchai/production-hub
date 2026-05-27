'use client'

import { useState } from 'react'
import { ExternalLink, Film } from 'lucide-react'

interface ArtlistEmbedProps {
  url: string
  videoSrc?: string | null
}

function extractArtlistInfo(url: string) {
  try {
    const parsed = new URL(url)
    const width = parsed.searchParams.get('assetWidth') || '1280'
    const height = parsed.searchParams.get('assetHeight') || '720'
    const ratio = parsed.searchParams.get('assetAspectRatio') || '16:9'
    const isArtlist = parsed.hostname.includes('artlist.io')
    return { width, height, ratio, isArtlist }
  } catch {
    return null
  }
}

export function ArtlistEmbed({ url, videoSrc }: ArtlistEmbedProps) {
  const [videoError, setVideoError] = useState(false)
  const info = extractArtlistInfo(url)

  if (!info?.isArtlist) {
    return (
      <div className="w-full aspect-video bg-secondary/40 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        Invalid link
      </div>
    )
  }

  if (videoSrc && !videoError) {
    return (
      <div className="w-full space-y-1.5">
        <video
          src={videoSrc}
          controls
          preload="metadata"
          className="w-full aspect-video rounded-lg bg-black border border-border"
          onError={() => setVideoError(true)}
        />
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] text-muted-foreground">{info.ratio} · {info.width}×{info.height}</span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Artlist
          </a>
        </div>
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
