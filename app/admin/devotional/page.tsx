import { createServiceClient } from '@/lib/supabase'
import AdminApprovalList from '@/components/AdminApprovalList'
import type { DevotionalGathering } from '@/lib/types'

export default async function AdminDevotionalPage() {
  const db = createServiceClient()
  const { data: gatherings } = await db
    .from('devotional_gatherings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        Pending Gatherings ({gatherings?.length ?? 0})
      </h2>
      <AdminApprovalList
        items={(gatherings ?? []) as unknown as Parameters<typeof AdminApprovalList>[0]['items']}
        table="devotional_gatherings"
        renderDetails={(item) => {
          const g = item as unknown as DevotionalGathering
          return (
            <>
              <p><span className="font-medium">Type:</span> {g.type}</p>
              <p><span className="font-medium">Schedule:</span> {g.schedule}</p>
              {g.location && <p>{g.location}</p>}
              {g.host_name && <p><span className="font-medium">Host:</span> {g.host_name}</p>}
            </>
          )
        }}
        emptyMessage="No pending gatherings."
      />
    </div>
  )
}
