import { createServiceClient } from '@/lib/supabase'
import AdminApprovalList from '@/components/AdminApprovalList'
import type { BusinessListing } from '@/lib/types'

export default async function AdminDirectoryPage() {
  const db = createServiceClient()
  const { data: listings } = await db
    .from('business_listings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        Pending Business Listings ({listings?.length ?? 0})
      </h2>
      <AdminApprovalList
        items={(listings ?? []) as unknown as Parameters<typeof AdminApprovalList>[0]['items']}
        table="business_listings"
        renderDetails={(item) => {
          const l = item as unknown as BusinessListing
          return (
            <>
              <p><span className="font-medium">Category:</span> {l.category}</p>
              {l.owner_name && <p><span className="font-medium">Owner:</span> {l.owner_name}</p>}
              {l.location && <p>{l.location}</p>}
              {l.description && <p className="line-clamp-2">{l.description}</p>}
            </>
          )
        }}
        emptyMessage="No pending listings."
      />
    </div>
  )
}
