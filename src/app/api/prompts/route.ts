import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { projectId, sceneId, newSceneTitle, prompt, model, notes,
          artlistUrl, videoSrc, width, height, ratio, fps, duration, assetTitle } = body

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
  }

  const supabase = db()
  let resolvedSceneId: string

  if (sceneId) {
    resolvedSceneId = sceneId
  } else if (newSceneTitle?.trim()) {
    // Pre-generate UUID to avoid .single() / RLS issues
    const { data: existingScenes } = await supabase
      .from('scenes')
      .select('order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: false })
      .limit(1)
    const nextIndex = existingScenes?.[0]?.order_index != null ? existingScenes[0].order_index + 1 : 0
    const newId = crypto.randomUUID()
    const { error: sceneErr } = await supabase
      .from('scenes')
      .insert({ id: newId, project_id: projectId, title: newSceneTitle.trim(), order_index: nextIndex })
    if (sceneErr) return NextResponse.json({ error: 'Failed to create scene: ' + sceneErr.message }, { status: 500 })
    resolvedSceneId = newId
  } else {
    const { data: scenes } = await supabase
      .from('scenes').select('id').eq('project_id', projectId).order('order_index').limit(1)
    if (scenes && scenes.length > 0) {
      resolvedSceneId = scenes[0].id
    } else {
      const newId = crypto.randomUUID()
      const { error: sceneErr } = await supabase
        .from('scenes')
        .insert({ id: newId, project_id: projectId, title: 'General', order_index: 0 })
      if (sceneErr) return NextResponse.json({ error: 'Failed to create scene: ' + sceneErr.message }, { status: 500 })
      resolvedSceneId = newId
    }
  }

  // Build insert — skip optional columns if not provided (handles missing columns gracefully)
  const insertRow: Record<string, unknown> = {
    scene_id: resolvedSceneId,
    prompt_text: prompt?.trim() || '',
    ai_model: model || 'other',
    artlist_video_url: artlistUrl || null,
    artlist_video_src: videoSrc || null,
    asset_width: width ? Number(width) : null,
    asset_height: height ? Number(height) : null,
    asset_ratio: ratio || null,
    created_by: session.id,
  }
  if (notes?.trim())       insertRow.notes        = notes.trim()
  if (fps)                 insertRow.asset_fps    = Number(fps)
  if (duration)            insertRow.asset_duration = Number(duration)
  if (assetTitle?.trim())  insertRow.asset_title  = assetTitle.trim()

  const { error } = await supabase.from('prompts').insert(insertRow)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, sceneId: resolvedSceneId })
}
