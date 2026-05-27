import { NextResponse } from 'next/server'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'

export async function POST(req: Request) {
  const { promptId } = await req.json()
  if (!promptId) return NextResponse.json({ error: 'promptId required' }, { status: 400 })

  const supabase = db()

  const { data: existing } = await supabase
    .from('favorites')
    .select('prompt_id')
    .eq('user_id', CURRENT_USER_EMAIL)
    .eq('prompt_id', promptId)
    .maybeSingle()

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', CURRENT_USER_EMAIL).eq('prompt_id', promptId)
    return NextResponse.json({ is_favorited: false })
  } else {
    await supabase.from('favorites').insert({ user_id: CURRENT_USER_EMAIL, prompt_id: promptId })
    return NextResponse.json({ is_favorited: true })
  }
}
