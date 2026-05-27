import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

const CORS = {
  'Access-Control-Allow-Origin': 'https://toolkit.artlist.io',
  'Access-Control-Allow-Credentials': 'true',
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ authenticated: false }, { status: 401, headers: CORS })
  // Fetch live DB values so changes (e.g. is_admin) take effect immediately without re-login
  const { data } = await db().from('users').select('department_id, is_admin, display_name').eq('id', session.id).single()
  return NextResponse.json({
    authenticated: true,
    ...session,
    // Override JWT values with fresh DB values
    isAdmin: data?.is_admin ?? session.isAdmin,
    displayName: data?.display_name ?? session.displayName,
    departmentId: data?.department_id ?? null,
  }, { headers: CORS })
}

export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { displayName, departmentId } = await req.json()
  const updates: Record<string, string> = {}
  if (displayName?.trim()) updates.display_name = displayName.trim()
  if (departmentId !== undefined) updates.department_id = departmentId

  const { error } = await db().from('users').update(updates).eq('id', session.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Both passwords required' }, { status: 400 })
  if (newPassword.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })

  const { data: user } = await db().from('users').select('password_hash').eq('id', session.id).single()
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, user.password_hash)
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

  const hash = await bcrypt.hash(newPassword, 10)
  const { error } = await db().from('users').update({ password_hash: hash }).eq('id', session.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}
