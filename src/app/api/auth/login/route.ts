import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (!username?.trim() || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const { data: user } = await db()
    .from('users')
    .select('id, username, display_name, password_hash, is_admin, is_active')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle()

  if (!user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  if (!user.is_active) {
    return NextResponse.json({ error: 'Account is disabled. Contact admin.' }, { status: 403 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  await createSession({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    isAdmin: user.is_admin,
  })

  return NextResponse.json({ ok: true })
}
