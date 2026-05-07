export const departments = [
  { id: '1', slug: 'production', name_he: 'פרודקשן', name_en: 'Production' },
  { id: '2', slug: 'design', name_he: 'עיצוב', name_en: 'Design' },
  { id: '3', slug: 'content', name_he: 'תוכן', name_en: 'Content' },
]

export const deptColors: Record<string, {
  gradient: string
  gradientStrong: string
  border: string
  badge: string
  tab: string
  dot: string
}> = {
  '1': {
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    gradientStrong: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/25',
    badge: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    tab: 'border-orange-400 text-orange-300',
    dot: 'bg-orange-400',
  },
  '2': {
    gradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
    gradientStrong: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/25',
    badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
    tab: 'border-violet-400 text-violet-300',
    dot: 'bg-violet-400',
  },
  '3': {
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
  department_id: '1',
  role: 'admin' as const,
}

export const projects = [
  {
    id: '1',
    name: 'Q2 2025 Campaign',
    description: 'Video campaign for Q2 focused on AI-generated content',
    department_id: '1',
    department_slug: 'production',
    department_name: 'Production',
    status: 'active' as const,
    created_by: '1',
    created_by_name: 'Aviad Chai',
    scene_count: 3,
    prompt_count: 8,
  },
  {
    id: '2',
    name: 'Brand Reel 2025',
    description: 'Company brand video — 90 seconds, cinematic style',
    department_id: '2',
    department_slug: 'design',
    department_name: 'Design',
    status: 'active' as const,
    created_by: '2',
    created_by_name: 'Sarah Levy',
    scene_count: 5,
    prompt_count: 12,
  },
  {
    id: '3',
    name: 'Social Media Pack',
    description: 'Short clips for Instagram, TikTok, LinkedIn',
    department_id: '3',
    department_slug: 'content',
    department_name: 'Content',
    status: 'active' as const,
    created_by: '3',
    created_by_name: 'Michael Cohen',
    scene_count: 10,
    prompt_count: 24,
  },
  {
    id: '4',
    name: 'Product Launch Video',
    description: '60-second product launch video',
    department_id: '1',
    department_slug: 'production',
    department_name: 'Production',
    status: 'active' as const,
    created_by: '1',
    created_by_name: 'Aviad Chai',
    scene_count: 4,
    prompt_count: 9,
  },
  {
    id: '5',
    name: 'Motion Graphics Pack',
    description: 'Animations for company events',
    department_id: '2',
    department_slug: 'design',
    department_name: 'Design',
    status: 'archived' as const,
    created_by: '2',
    created_by_name: 'Sarah Levy',
    scene_count: 6,
    prompt_count: 15,
  },
]

export const ARTLIST_EXAMPLE =
  'https://toolkit.artlist.io/019ded8f-80dd-7c13-947f-254a172f771e?mode=image&mediaTypes=generatedVideo&assetId=019deda8-785d-7835-b9af-55490f4bec8e&mediaType=image-video&assetWidth=1280&assetHeight=720&assetAspectRatio=16%3A9'

export const scenes = [
  { id: '1', project_id: '1', title: 'Opening — Skyline', order_index: 0 },
  { id: '2', project_id: '1', title: 'Product in Action', order_index: 1 },
  { id: '3', project_id: '1', title: 'Closing — CTA', order_index: 2 },
]

export const prompts = [
  {
    id: '1',
    scene_id: '1',
    prompt_text:
      'Cinematic aerial drone shot slowly rising above Tel Aviv skyline at golden hour, warm orange light reflecting off glass buildings, subtle lens flare, ultra-realistic, 8K, shot on RED camera, 24fps, anamorphic lenses',
    notes: 'Soft golden hour lighting. Add light film grain in post.',
    ai_model: 'sora',
    artlist_video_url: ARTLIST_EXAMPLE,
    created_by: '1',
    created_by_name: 'Aviad Chai',
    created_at: '2025-04-10T09:30:00Z',
    is_favorited: false,
    comment_count: 3,
  },
  {
    id: '2',
    scene_id: '1',
    prompt_text:
      'Close-up of morning light filtering through office window blinds creating dramatic shadow patterns on a wooden desk, slow motion, photorealistic, depth of field, bokeh background, cinematic color grade',
    notes: 'Try again with 45 degree angle',
    ai_model: 'runway',
    artlist_video_url: null,
    created_by: '2',
    created_by_name: 'Sarah Levy',
    created_at: '2025-04-11T14:20:00Z',
    is_favorited: true,
    comment_count: 1,
  },
  {
    id: '3',
    scene_id: '2',
    prompt_text:
      'Product hero shot: sleek smartphone floating in mid-air, rotating 360 degrees, studio lighting with rimlight, clean white background, sharp focus, commercial photography style, highly detailed screen reflection',
    notes: null,
    ai_model: 'veo',
    artlist_video_url: ARTLIST_EXAMPLE,
    created_by: '1',
    created_by_name: 'Aviad Chai',
    created_at: '2025-04-12T10:00:00Z',
    is_favorited: true,
    comment_count: 5,
  },
  {
    id: '4',
    scene_id: '3',
    prompt_text:
      'Abstract digital particles forming into a logo shape, flowing from left to right, dark background with neon blue and white particles, 3D depth, cinematic, smooth transition, high energy ending pose',
    notes: 'Campaign outro — needs to be dramatic',
    ai_model: 'kling',
    artlist_video_url: null,
    created_by: '3',
    created_by_name: 'Michael Cohen',
    created_at: '2025-04-13T16:45:00Z',
    is_favorited: false,
    comment_count: 0,
  },
]

export const projectReferences = [
  {
    id: '1',
    project_id: '1',
    category: 'Talent',
    title: 'Lead Actor — Dan',
    image_url: null,
    notes: 'Main presenter for product scenes',
  },
  {
    id: '2',
    project_id: '1',
    category: 'Location',
    title: 'Tel Aviv Rooftop',
    image_url: null,
    notes: 'Sunrise / sunset shots',
  },
  {
    id: '3',
    project_id: '1',
    category: 'Style',
    title: 'Mood Reference',
    image_url: null,
    notes: 'Dark, cinematic, warm tones',
  },
]

export const referenceCategories = ['Talent', 'Location', 'Style', 'Props', 'Wardrobe', 'Other']

export const comments = [
  {
    id: '1',
    prompt_id: '1',
    author_name: 'Sarah Levy',
    body: 'Love it! Can we try a lower angle version?',
    created_at: '2025-04-10T11:00:00Z',
  },
  {
    id: '2',
    prompt_id: '1',
    author_name: 'Michael Cohen',
    body: 'The lighting came out amazing. Saved this prompt.',
    created_at: '2025-04-10T13:30:00Z',
  },
  {
    id: '3',
    prompt_id: '1',
    author_name: 'Aviad Chai',
    body: "Will add a v2 with different focal length",
    created_at: '2025-04-11T09:00:00Z',
  },
]

export const aiModelLabels: Record<string, string> = {
  sora: 'Sora',
  runway: 'Runway',
  veo: 'Veo',
  kling: 'Kling',
  other: 'Other',
}

export const dashboardStats = {
  totalProjects: 5,
  totalPrompts: 68,
  aiEngineUsage: { sora: 22, runway: 18, veo: 15, kling: 9, other: 4 },
  generatedByType: { video: 89, image: 52, sound: 15 },
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
