import { NextResponse } from 'next/server'
import { db, CURRENT_USER_EMAIL } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await db()
    .from('project_stats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data) return NextResponse.json([])

  return NextResponse.json(data.map((p) => ({ ...p, created_by_name: p.created_by || 'Unknown' })))
}

export async function POST(req: Request) {
  const { name, description, department_slug, quarter, year } = await req.json()
  if (!name?.trim() || !department_slug) {
    return NextResponse.json({ error: 'name and department_slug required' }, { status: 400 })
  }

  const supabase = db()

  // Resolve department_slug → id
  const { data: dept } = await supabase
    .from('departments')
    .select('id')
    .eq('slug', department_slug)
    .single()

  if (!dept) return NextResponse.json({ error: 'Department not found' }, { status: 400 })

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      department_id: dept.id,
      quarter: quarter || null,
      year: year || null,
      status: 'active',
      created_by: CURRENT_USER_EMAIL,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id })
}
