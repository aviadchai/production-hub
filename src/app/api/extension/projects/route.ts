import { NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

const CORS = {
  'Access-Control-Allow-Origin': 'https://toolkit.artlist.io',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET() {
  const { data, error } = await db()
    .from('project_stats')
    .select('id, name, department_name')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json([], { headers: CORS })

  return NextResponse.json(
    (data ?? []).map((p) => ({ id: p.id, name: p.name, department_name: p.department_name })),
    { headers: CORS }
  )
}
