import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { prompt_text, notes } = body

  // Non-admins can only edit their own prompts
  if (!session.isAdmin) {
    const { data } = await db().from('prompts').select('created_by').eq('id', id).maybeSingle()
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (data.created_by !== session.id) {
      return NextResponse.json({ error: 'You can only edit your own prompts' }, { status: 403 })
    }
  }

  const updates: Record<string, unknown> = {}
  if (prompt_text !== undefined) updates.prompt_text = prompt_text
  if (notes !== undefined) updates.notes = notes !== null ? notes : null

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { error } = await db().from('prompts').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  if (!session.isAdmin) {
    const { data } = await db().from('prompts').select('created_by').eq('id', id).maybeSingle()
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (data.created_by !== session.id) {
      return NextResponse.json({ error: 'You can only delete your own prompts' }, { status: 403 })
    }
  }

  const { error } = await db().from('prompts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
