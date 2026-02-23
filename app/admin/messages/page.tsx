import { createServiceClient } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'

export default async function AdminMessagesPage() {
  const db = createServiceClient()
  const { data: messages } = await db
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Mark unread as read
  const unreadIds = messages?.filter((m) => !m.read).map((m) => m.id) ?? []
  if (unreadIds.length > 0) {
    await db.from('contact_messages').update({ read: true }).in('id', unreadIds)
  }

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        Contact Messages ({messages?.length ?? 0})
      </h2>

      {!messages || messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No messages yet.</p>
      ) : (
        <ul className="space-y-4" role="list">
          {messages.map((msg) => (
            <li key={msg.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-[#1a2744]">{msg.subject}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {msg.name} &lt;
                    <a href={`mailto:${msg.email}`} className="text-[#2a7c7a] hover:underline">
                      {msg.email}
                    </a>
                    &gt; · {formatDateTime(msg.created_at)}
                  </p>
                </div>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="flex-shrink-0 text-xs bg-[#1a2744] hover:bg-[#243460] text-white px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
                >
                  Reply
                </a>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
