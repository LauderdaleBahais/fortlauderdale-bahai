import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, location, start_time, end_time } = body

  if (!title || !start_time) {
    return NextResponse.json({ error: 'Title and start time are required.' }, { status: 400 })
  }

  const db = createServiceClient()
  const { error } = await db.from('events').insert({
    title,
    description: description || null,
    location: location || null,
    start_time,
    end_time: end_time || null,
    status: 'pending',
    submitted_by: userId,
    is_holy_day: false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
