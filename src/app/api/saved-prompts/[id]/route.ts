import { NextResponse } from 'next/server'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'

interface Props { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const { error } = await db()
    .from('saved_prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', CURRENT_USER_EMAIL)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
