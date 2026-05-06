'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtlistEmbedProps {
  url: string
}

function extractArtlistInfo(url: string) {
  try {
    const parsed = new URL(url)
    const assetId = parsed.searchParams.get('assetId')
    const width = parseInt(parsed.searchParams.get('assetWidth') || '1280')
    const height = parseInt(parsed.searchParams.get('assetHeight') || '720')
    const isArtlist = parsed.hostname.includes('artlist.io')
    return { assetId, width, height, isArtlist }
  } catch {
    return null
  }
}

export function ArtlistEmbed({ url }: ArtlistEmbedProps) {
  const info = extractArtlistInfo(url)

  if (!info?.isArtlist) {
    return (
      <div className="w-full aspect-video bg-secondary/40 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
        לינק לא תקין
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
        <iframe
          src={url}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Artlist Video"
        />
      </div>
      <div className="flex items-center justify-between px-1">
        {info.assetId && (
          <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
            {info.assetId.slice(0, 8)}…
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px] text-muted-foreground gap-1 mr-auto"
          onClick={() => window.open(url, '_blank')}
        >
          <ExternalLink className="h-3 w-3" />
          פתח ב-Artlist
        </Button>
      </div>
    </div>
  )
}
