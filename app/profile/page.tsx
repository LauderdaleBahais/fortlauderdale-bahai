import type { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'My Profile',
}

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const db = createServiceClient()

  const [{ data: events }, { data: listings }, { data: threads }] = await Promise.all([
    db.from('events').select('*').eq('submitted_by', userId).order('created_at', { ascending: false }),
    db.from('business_listings').select('*').eq('owner_id', userId).order('created_at', { ascending: false }),
    db.from('board_threads').select('*').eq('author_id', userId).order('created_at', { ascending: false }),
  ])

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
    'Community Member'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-5 mb-10 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#1a2744] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0" aria-hidden="true">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744]">
            {displayName}
          </h1>
          {user?.emailAddresses?.[0]?.emailAddress && (
            <p className="text-gray-500 text-sm">{user.emailAddresses[0].emailAddress}</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3 mb-10">
        {[
          { label: 'Submit an Event', href: '/events/submit' },
          { label: 'List a Business', href: '/directory/submit' },
          { label: 'Start a Discussion', href: '/board/new' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white border border-gray-200 hover:border-[#2a7c7a] rounded-lg px-4 py-3 text-sm font-medium text-[#1a2744] hover:text-[#2a7c7a] transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a]"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <div className="space-y-10">
        {/* My Events */}
        <section aria-labelledby="my-events">
          <h2 id="my-events" className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-4">
            My Submitted Events
          </h2>
          {!events || events.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven&apos;t submitted any events yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {events.map((e) => (
                <li key={e.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#1a2744]">{e.title}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(e.start_time)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    e.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {e.status === 'approved' ? 'Approved' : 'Pending Review'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* My Listings */}
        <section aria-labelledby="my-listings">
          <h2 id="my-listings" className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-4">
            My Business Listings
          </h2>
          {!listings || listings.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven&apos;t submitted any listings yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {listings.map((l) => (
                <li key={l.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#1a2744]">{l.business_name}</p>
                    <p className="text-xs text-gray-400">{l.category}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    l.status === 'approved' || l.status === 'featured'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {l.status === 'pending' ? 'Pending Review' : l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* My Threads */}
        <section aria-labelledby="my-threads">
          <h2 id="my-threads" className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-4">
            My Board Posts
          </h2>
          {!threads || threads.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven&apos;t started any discussions yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {threads.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/board/${t.id}`}
                    className="block bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a]"
                  >
                    <p className="font-medium text-[#1a2744]">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.created_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
