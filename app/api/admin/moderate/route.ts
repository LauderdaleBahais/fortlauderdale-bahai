import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

const ALLOWED_TABLES = ['events', 'business_listings', 'devotional_gatherings'] as const
type AllowedTable = (typeof ALLOWED_TABLES)[number]

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, table, action } = await req.json()

  if (!ALLOWED_TABLES.includes(table as AllowedTable)) {
    return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
  }

  const db = createServiceClient()

  if (action === 'approve') {
    await db.from(table as AllowedTable).update({ status: 'approved' }).eq('id', id)
  } else if (action === 'reject') {
    await db.from(table as AllowedTable).delete().eq('id', id)
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
