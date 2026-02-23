import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'

async function getCounts() {
  const db = createServiceClient()
  const [events, listings, gatherings, posts, messages] = await Promise.all([
    db.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('business_listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('devotional_gatherings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    db.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', false),
    db.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
  ])
  return {
    pendingEvents: events.count ?? 0,
    pendingListings: listings.count ?? 0,
    pendingGatherings: gatherings.count ?? 0,
    draftPosts: posts.count ?? 0,
    unreadMessages: messages.count ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const counts = await getCounts()

  const CARDS = [
    { label: 'Pending Events', count: counts.pendingEvents, href: '/admin/events', color: 'bg-[#1a2744]' },
    { label: 'Pending Listings', count: counts.pendingListings, href: '/admin/directory', color: 'bg-[#2a7c7a]' },
    { label: 'Pending Gatherings', count: counts.pendingGatherings, href: '/admin/devotional', color: 'bg-[#c8942a]' },
    { label: 'Draft Blog Posts', count: counts.draftPosts, href: '/admin/posts', color: 'bg-purple-700' },
    { label: 'Unread Messages', count: counts.unreadMessages, href: '/admin/messages', color: 'bg-rose-600' },
  ]

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`${card.color} text-white rounded-xl p-6 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white`}
          >
            <div className="text-4xl font-bold mb-1">{card.count}</div>
            <div className="text-sm font-medium opacity-90">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 hover:border-[#2a7c7a] rounded-xl p-5 text-gray-600 hover:text-[#2a7c7a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Write a Blog Post</span>
        </Link>
        <Link
          href="/admin/events"
          className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-200 hover:border-[#2a7c7a] rounded-xl p-5 text-gray-600 hover:text-[#2a7c7a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Review Pending Events</span>
        </Link>
      </div>
    </div>
  )
}
