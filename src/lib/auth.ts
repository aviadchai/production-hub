import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-prod')
const COOKIE = 'ph_session'

export interface SessionUser {
  id: string
  username: string
  displayName: string
  isAdmin: boolean
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(SECRET)

  const jar = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const jar = await cookies()
    const token = jar.get(COOKIE)?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function deleteSession() {
  const jar = await cookies()
  jar.delete(COOKIE)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}
