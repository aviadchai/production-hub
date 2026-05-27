import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

interface Props { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const { error } = await db().from('projects').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request, { params }: Props) {
  const { id } = await params
  const body = await req.json()
  const { error } = await db().from('projects').update(body).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
