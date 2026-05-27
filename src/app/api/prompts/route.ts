import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { projectId, sceneId, newSceneTitle, prompt, model, notes, artlistUrl, videoSrc, width, height, ratio } = body

  if (!projectId || !prompt?.trim()) {
    return NextResponse.json({ error: 'projectId and prompt are required' }, { status: 400 })
  }

  const supabase = db()

  let resolvedSceneId: string

  if (sceneId) {
    resolvedSceneId = sceneId
  } else if (newSceneTitle?.trim()) {
    const { data: existingScenes } = await supabase.from('scenes').select('order_index').eq('project_id', projectId).order('order_index', { ascending: false }).limit(1)
    const nextIndex = existingScenes && existingScenes.length > 0 ? existingScenes[0].order_index + 1 : 0
    const { data: newScene, error: sceneErr } = await supabase
      .from('scenes')
      .insert({ project_id: projectId, title: newSceneTitle.trim(), order_index: nextIndex })
      .select('id')
      .single()
    if (sceneErr || !newScene) return NextResponse.json({ error: 'Failed to create scene' }, { status: 500 })
    resolvedSceneId = newScene.id
  } else {
    const { data: scenes } = await supabase.from('scenes').select('id').eq('project_id', projectId).order('order_index').limit(1)
    if (scenes && scenes.length > 0) {
      resolvedSceneId = scenes[0].id
    } else {
      const { data: newScene, error: sceneErr } = await supabase
        .from('scenes')
        .insert({ project_id: projectId, title: 'General', order_index: 0 })
        .select('id')
        .single()
      if (sceneErr || !newScene) return NextResponse.json({ error: 'Failed to create scene' }, { status: 500 })
      resolvedSceneId = newScene.id
    }
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      scene_id: resolvedSceneId,
      prompt_text: prompt.trim(),
      ai_model: model || 'other',
      notes: notes?.trim() || null,
      artlist_video_url: artlistUrl || null,
      artlist_video_src: videoSrc || null,
      asset_width: width || null,
      asset_height: height || null,
      asset_ratio: ratio || null,
      created_by: session.id,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id, sceneId: resolvedSceneId })
}
