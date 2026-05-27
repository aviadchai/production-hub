import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data } = await db()
    .from('users')
    .select('id, username, display_name, is_admin, is_active, created_at')
    .order('created_at')

  return NextResponse.json(data ?? [])
}
