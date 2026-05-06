export const departments = [
  { id: '1', slug: 'production', name_he: 'פרודקשן', name_en: 'Production' },
  { id: '2', slug: 'design', name_he: 'עיצוב', name_en: 'Design' },
  { id: '3', slug: 'content', name_he: 'תוכן', name_en: 'Content' },
]

export const currentUser = {
  id: '1',
  full_name: 'אביד חי',
  email: 'aviad@company.com',
  department_id: '1',
  role: 'admin' as const,
}

export const projects = [
  {
    id: '1',
    name: 'קמפיין Q2 2025',
    description: 'קמפיין וידאו לרבעון השני עם דגש על AI-generated content',
    department_id: '1',
    department_slug: 'production',
    department_name: 'פרודקשן',
    status: 'active' as const,
    created_by: '1',
    created_by_name: 'אביד חי',
    scene_count: 3,
    prompt_count: 8,
  },
  {
    id: '2',
    name: 'Brand Reel 2025',
    description: 'וידאו תדמיתי לחברה — 90 שניות, סגנון קולנועי',
    department_id: '2',
    department_slug: 'design',
    department_name: 'עיצוב',
    status: 'active' as const,
    created_by: '2',
    created_by_name: 'שרה לוי',
    scene_count: 5,
    prompt_count: 12,
  },
  {
    id: '3',
    name: 'Social Media Pack',
    description: 'קליפים קצרים לרשתות חברתיות — Instagram, TikTok, LinkedIn',
    department_id: '3',
    department_slug: 'content',
    department_name: 'תוכן',
    status: 'active' as const,
    created_by: '3',
    created_by_name: 'מיכאל כהן',
    scene_count: 10,
    prompt_count: 24,
  },
  {
    id: '4',
    name: 'Product Launch Video',
    description: 'וידאו השקת מוצר חדש — 60 שניות',
    department_id: '1',
    department_slug: 'production',
    department_name: 'פרודקשן',
    status: 'active' as const,
    created_by: '1',
    created_by_name: 'אביד חי',
    scene_count: 4,
    prompt_count: 9,
  },
  {
    id: '5',
    name: 'Motion Graphics Pack',
    description: 'אנימציות לאירועי חברה',
    department_id: '2',
    department_slug: 'design',
    department_name: 'עיצוב',
    status: 'archived' as const,
    created_by: '2',
    created_by_name: 'שרה לוי',
    scene_count: 6,
    prompt_count: 15,
  },
]

export const ARTLIST_EXAMPLE =
  'https://toolkit.artlist.io/019ded8f-80dd-7c13-947f-254a172f771e?mode=image&mediaTypes=generatedVideo&assetId=019deda8-785d-7835-b9af-55490f4bec8e&mediaType=image-video&assetWidth=1280&assetHeight=720&assetAspectRatio=16%3A9'

export const scenes = [
  { id: '1', project_id: '1', title: 'פתיחה — שמיים', order_index: 0 },
  { id: '2', project_id: '1', title: 'מוצר בפעולה', order_index: 1 },
  { id: '3', project_id: '1', title: 'סיום — CTA', order_index: 2 },
]

export const prompts = [
  {
    id: '1',
    scene_id: '1',
    prompt_text:
      'Cinematic aerial drone shot slowly rising above Tel Aviv skyline at golden hour, warm orange light reflecting off glass buildings, subtle lens flare, ultra-realistic, 8K, shot on RED camera, 24fps, anamorphic lenses',
    notes: 'שידה עם תאורה רכה של שקיעה. להוסיף grain קל בפוסט.',
    ai_model: 'sora',
    artlist_video_url: ARTLIST_EXAMPLE,
    created_by: '1',
    created_by_name: 'אביד חי',
    created_at: '2025-04-10T09:30:00Z',
    is_favorited: false,
    comment_count: 3,
  },
  {
    id: '2',
    scene_id: '1',
    prompt_text:
      'Close-up of morning light filtering through office window blinds creating dramatic shadow patterns on a wooden desk, slow motion, photorealistic, depth of field, bokeh background, cinematic color grade',
    notes: 'לניסיון נוסף — לשנות זווית ל-45 מעלות',
    ai_model: 'runway',
    artlist_video_url: null,
    created_by: '2',
    created_by_name: 'שרה לוי',
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
    created_by_name: 'אביד חי',
    created_at: '2025-04-12T10:00:00Z',
    is_favorited: true,
    comment_count: 5,
  },
  {
    id: '4',
    scene_id: '3',
    prompt_text:
      'Abstract digital particles forming into a logo shape, flowing from left to right, dark background with neon blue and white particles, 3D depth, cinematic, smooth transition, high energy ending pose',
    notes: 'לסיום הקמפיין — צריך להיות dramatic',
    ai_model: 'kling',
    artlist_video_url: null,
    created_by: '3',
    created_by_name: 'מיכאל כהן',
    created_at: '2025-04-13T16:45:00Z',
    is_favorited: false,
    comment_count: 0,
  },
]

export const comments = [
  {
    id: '1',
    prompt_id: '1',
    author_name: 'שרה לוי',
    body: 'אהבתי! אפשר לנסות גרסה עם זווית נמוכה יותר?',
    created_at: '2025-04-10T11:00:00Z',
  },
  {
    id: '2',
    prompt_id: '1',
    author_name: 'מיכאל כהן',
    body: 'התאורה יצאה מדהים. שמרתי את הפרומפט הזה.',
    created_at: '2025-04-10T13:30:00Z',
  },
  {
    id: '3',
    prompt_id: '1',
    author_name: 'אביד חי',
    body: 'נוסיף גרסה 2 עם focal length שונה',
    created_at: '2025-04-11T09:00:00Z',
  },
]

export const aiModelLabels: Record<string, string> = {
  sora: 'Sora',
  runway: 'Runway',
  veo: 'Veo',
  kling: 'Kling',
  other: 'אחר',
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'עכשיו'
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דקות`
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שעות`
  return `לפני ${Math.floor(diff / 86400)} ימים`
}
