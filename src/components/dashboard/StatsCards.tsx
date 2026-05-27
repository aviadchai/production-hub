import { Film, Zap } from 'lucide-react'

interface Stats {
  totalProjects: number
  totalPrompts: number
  aiEngineUsage: Record<string, number>
}

const engineColors: Record<string, string> = {
  sora: 'bg-blue-500',
  runway: 'bg-purple-500',
  veo: 'bg-green-500',
  kling: 'bg-orange-500',
  other: 'bg-zinc-500',
}

export function StatsCards({ stats }: { stats: Stats }) {
  const { totalProjects, totalPrompts, aiEngineUsage } = stats
  const totalEngineUses = Object.values(aiEngineUsage).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Total Prompts</p>
          <p className="text-2xl font-bold">{totalPrompts}</p>
          <p className="text-[11px] text-muted-foreground">across {totalProjects} projects</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wide">
            <Film className="h-3 w-3" /> Projects
          </div>
          <p className="text-2xl font-bold">{totalProjects}</p>
          <p className="text-[11px] text-muted-foreground">active</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">AI Engines</p>
          <p className="text-2xl font-bold">{Object.keys(aiEngineUsage).length}</p>
          <p className="text-[11px] text-muted-foreground">in use</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Avg / Project</p>
          <p className="text-2xl font-bold">
            {totalProjects > 0 ? Math.round(totalPrompts / totalProjects) : 0}
          </p>
          <p className="text-[11px] text-muted-foreground">prompts</p>
        </div>
      </div>

      {totalEngineUses > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-medium">AI Engine Usage</p>
            <p className="text-[11px] text-muted-foreground ml-auto">{totalEngineUses} total runs</p>
          </div>

          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {Object.entries(aiEngineUsage).map(([engine, count]) => (
              <div
                key={engine}
                className={`${engineColors[engine] ?? 'bg-zinc-500'} rounded-full`}
                style={{ width: `${(count / totalEngineUses) * 100}%` }}
                title={`${engine}: ${count}`}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {Object.entries(aiEngineUsage).map(([engine, count]) => (
              <div key={engine} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${engineColors[engine] ?? 'bg-zinc-500'}`} />
                <span className="text-xs capitalize font-medium">{engine}</span>
                <span className="text-[11px] text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
