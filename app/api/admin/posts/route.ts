import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return null
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role
  return role === 'admin' ? userId : null
}

export async function POST(req: NextRequest) {
  const userId = await requireAdmin()
  if (!userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, content, excerpt, published } = await req.json()
  if (!title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

  const db = createServiceClient()
  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1
  while (true) {
    const { data } = await db.from('blog_posts').select('id').eq('slug', slug).single()
    if (!data) break
    slug = `${baseSlug}-${counter++}`
  }

  const { data, error } = await db
    .from('blog_posts')
    .insert({ title: title.trim(), slug, content, excerpt, published: !!published, author_id: userId })
    .select('slug')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slug: data.slug }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const userId = await requireAdmin()
  if (!userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...updates } = await req.json()
  const db = createServiceClient()
  const { error } = await db.from('blog_posts').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const userId = await requireAdmin()
  if (!userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  const db = createServiceClient()
  await db.from('blog_posts').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
