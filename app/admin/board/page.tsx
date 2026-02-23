import { createServiceClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import AdminBoardModeration from '@/components/AdminBoardModeration'

export default async function AdminBoardPage() {
  const db = createServiceClient()
  const [{ data: threads }, { data: replies }] = await Promise.all([
    db.from('board_threads').select('*').order('created_at', { ascending: false }).limit(50),
    db.from('board_replies').select('*').order('created_at', { ascending: false }).limit(50),
  ])

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        Board Moderation
      </h2>
      <AdminBoardModeration threads={threads ?? []} replies={replies ?? []} />
    </div>
  )
}
