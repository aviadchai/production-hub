// Static config — departments never change, colors are UI-only

export const departments = [
  { id: 'production', slug: 'production', name_he: 'פרודקשן', name_en: 'Production' },
  { id: 'design',     slug: 'design',     name_he: 'עיצוב',    name_en: 'Design'      },
  { id: 'content',    slug: 'content',    name_he: 'תוכן',     name_en: 'Content'     },
]

export const deptColors: Record<string, {
  gradient: string
  gradientStrong: string
  border: string
  badge: string
  tab: string
  dot: string
}> = {
  production: {
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    gradientStrong: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/25',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    tab: 'border-orange-400 text-orange-300',
    dot: 'bg-orange-400',
  },
  design: {
    gradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
    gradientStrong: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/25',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    tab: 'border-violet-400 text-violet-300',
    dot: 'bg-violet-400',
  },
  content: {
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    gradientStrong: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    tab: 'border-emerald-400 text-emerald-300',
    dot: 'bg-emerald-400',
  },
}

export const currentUser = {
  id: '1',
  full_name: 'Aviad Chai',
  email: 'aviad.c@artlist.io',
  department_slug: 'production',
  role: 'admin' as const,
}

export const aiModelLabels: Record<string, string> = {
  sora: 'Sora',
  runway: 'Runway',
  veo: 'Veo',
  kling: 'Kling',
  other: 'Other',
}

export const referenceCategories = ['Talent', 'Location', 'Style', 'Props', 'Wardrobe', 'Other']

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
