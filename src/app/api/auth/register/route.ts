import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/supabase'
import { createSession } from '@/lib/auth'

export async function POST(req: Request) {
  const { username, displayName, password, accessCode } = await req.json()

  if (!username?.trim() || !displayName?.trim() || !password || !accessCode) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  if (accessCode !== process.env.ACCESS_CODE) {
    return NextResponse.json({ error: 'Invalid access code' }, { status: 403 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const supabase = db()

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', username.trim().toLowerCase())
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      username: username.trim().toLowerCase(),
      display_name: displayName.trim(),
      password_hash: passwordHash,
    })
    .select('id, username, display_name, is_admin')
    .single()

  if (error || !user) {
    return NextResponse.json({ error: error?.message || 'Failed to create user' }, { status: 500 })
  }

  await createSession({
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    isAdmin: user.is_admin,
  })

  return NextResponse.json({ ok: true })
}
