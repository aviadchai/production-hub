import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-in-prod')
const PUBLIC = ['/login', '/install', '/api/auth', '/api/extension']
const API_PREFIX = '/api/'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next()

  // API routes return 401, not redirect
  if (pathname.startsWith(API_PREFIX)) {
    const token = req.cookies.get('ph_session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
      const { payload } = await jwtVerify(token, SECRET)
      if (pathname.startsWith('/api/admin') && !payload.isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.next()
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const token = req.cookies.get('ph_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    if (pathname.startsWith('/admin') && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.zip$).*)'],
}
