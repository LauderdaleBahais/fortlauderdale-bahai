import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const authorName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Anonymous'

  const { thread_id, body } = await req.json()

  if (!thread_id || !body?.trim()) {
    return NextResponse.json({ error: 'Thread ID and body are required.' }, { status: 400 })
  }

  const db = createServiceClient()
  const { error } = await db
    .from('board_replies')
    .insert({ thread_id, body: body.trim(), author_id: userId, author_name: authorName })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
