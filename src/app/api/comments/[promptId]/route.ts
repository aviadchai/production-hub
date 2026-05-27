import { NextResponse } from 'next/server'
import { db, CURRENT_USER_NAME } from '@/lib/supabase'

interface Props {
  params: Promise<{ promptId: string }>
}

export async function GET(_req: Request, { params }: Props) {
  const { promptId } = await params
  const { data, error } = await db()
    .from('comments')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request, { params }: Props) {
  const { promptId } = await params
  const { body } = await req.json()

  if (!body?.trim()) return NextResponse.json({ error: 'body required' }, { status: 400 })

  const { data, error } = await db()
    .from('comments')
    .insert({ prompt_id: promptId, author_name: CURRENT_USER_NAME, body: body.trim() })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
