import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { DEVOTIONAL_TYPES } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, type, description, location, address, schedule, recurrence, day_of_week, time_of_day, host_name, host_contact } = body

  if (!title?.trim() || !type || !schedule?.trim()) {
    return NextResponse.json({ error: 'Title, type, and schedule are required.' }, { status: 400 })
  }

  if (!DEVOTIONAL_TYPES.includes(type)) {
    return NextResponse.json({ error: 'Invalid gathering type.' }, { status: 400 })
  }

  const db = createServiceClient()
  const { error } = await db.from('devotional_gatherings').insert({
    title: title.trim(),
    type,
    description: description?.trim() || null,
    location: location?.trim() || null,
    address: address?.trim() || null,
    schedule: schedule.trim(),
    recurrence: recurrence || 'weekly',
    day_of_week: day_of_week || null,
    time_of_day: time_of_day || null,
    host_name: host_name?.trim() || null,
    host_contact: host_contact?.trim() || null,
    submitted_by: userId,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
