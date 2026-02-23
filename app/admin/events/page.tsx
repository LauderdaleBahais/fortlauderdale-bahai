import { createServiceClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import AdminApprovalList from '@/components/AdminApprovalList'
import type { Event } from '@/lib/types'

export default async function AdminEventsPage() {
  const db = createServiceClient()
  const { data: events } = await db
    .from('events')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        Pending Events ({events?.length ?? 0})
      </h2>
      <AdminApprovalList
        items={(events ?? []) as unknown as Parameters<typeof AdminApprovalList>[0]['items']}
        table="events"
        renderDetails={(item) => {
          const e = item as unknown as Event
          return (
            <>
              <p>{formatDateTime(e.start_time)}</p>
              {e.location && <p>{e.location}</p>}
              {e.description && <p className="line-clamp-2">{e.description}</p>}
            </>
          )
        }}
        emptyMessage="No pending events."
      />
    </div>
  )
}
