import { NextResponse } from 'next/server'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': 'https://toolkit.artlist.io',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  const { data, error } = await db()
    .from('saved_prompts')
    .select('*')
    .eq('user_id', CURRENT_USER_EMAIL)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json(data ?? [], { headers: CORS })
}

export async function POST(req: Request) {
  const { title, prompt_text } = await req.json()
  if (!title?.trim() || !prompt_text?.trim()) {
    return NextResponse.json({ error: 'title and prompt_text required' }, { status: 400 })
  }

  const { data, error } = await db()
    .from('saved_prompts')
    .insert({ user_id: CURRENT_USER_EMAIL, title: title.trim(), prompt_text: prompt_text.trim() })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
