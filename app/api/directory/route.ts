import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { BUSINESS_CATEGORIES } from '@/lib/types'
import type { BusinessCategory } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const ownerName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Member'

  const body = await req.json()
  const { business_name, category, description, website_url, phone, email, location } = body

  if (!business_name?.trim() || !category) {
    return NextResponse.json({ error: 'Business name and category are required.' }, { status: 400 })
  }

  if (!BUSINESS_CATEGORIES.includes(category as BusinessCategory)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
  }

  const db = createServiceClient()
  const { error } = await db.from('business_listings').insert({
    business_name: business_name.trim(),
    category,
    description: description?.trim() || null,
    website_url: website_url?.trim() || null,
    phone: phone?.trim() || null,
    email: email?.trim() || null,
    location: location?.trim() || null,
    owner_id: userId,
    owner_name: ownerName,
    status: 'pending',
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
