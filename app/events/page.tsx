import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import type { Event } from '@/lib/types'
import EventsCalendar from '@/components/EventsCalendar'

export const metadata: Metadata = {
  title: 'Events Calendar',
  description:
    "View upcoming events and Bahá'í Holy Days for the Fort Lauderdale Bahá'í community.",
}

export const revalidate = 0

async function getEvents(): Promise<Event[]> {
  const db = createServiceClient()
  const { data, error } = await db
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .order('start_time', { ascending: true })

  if (error) {
    console.error('[events page] Supabase error:', error.message)
    return []
  }

  const events = (data ?? []) as Event[]
  console.log('[events page] Fetched approved events:', events.length, events)
  return events
}

export default async function EventsPage() {
  const events = await getEvents()
  const holyDays = events.filter((e) => e.is_holy_day)
  const communityEvents = events.filter((e) => !e.is_holy_day)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744]">
            Events Calendar
          </h1>
          <p className="mt-2 text-gray-600">
            Bahá&apos;í Holy Days, community gatherings, and upcoming events in Fort Lauderdale.
          </p>
        </div>
        <Link
          href="/events/submit"
          className="inline-flex items-center gap-2 bg-[#2a7c7a] hover:bg-[#3a9a97] text-white font-medium px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit an Event
        </Link>
      </div>

      {/* Calendar */}
      <EventsCalendar events={events} />

      {/* Upcoming Holy Days list */}
      {holyDays.length > 0 && (
        <section className="mt-14" aria-labelledby="holy-days-heading">
          <h2
            id="holy-days-heading"
            className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-6"
          >
            2025 Bahá&apos;í Holy Days
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-[#f5f2ed] text-left">
                  <th
                    scope="col"
                    className="px-5 py-3 font-semibold text-[#1a2744] text-xs uppercase tracking-wide"
                  >
                    Holy Day
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 font-semibold text-[#1a2744] text-xs uppercase tracking-wide"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {holyDays.map((event) => (
                  <tr key={event.id} className="hover:bg-[#faf8f4] transition-colors">
                    <td className="px-5 py-4 font-medium text-[#1a2744]">{event.title}</td>
                    <td className="px-5 py-4 text-[#2a7c7a]">
                      {(() => {
                        // Parse UTC date directly to avoid timezone shift
                        const [year, month, day] = event.start_time.substring(0, 10).split('-').map(Number)
                        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Community events list */}
      {communityEvents.length > 0 && (
        <section className="mt-14" aria-labelledby="community-events-heading">
          <h2
            id="community-events-heading"
            className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-6"
          >
            Community Events
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communityEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] mb-2 leading-snug">
                  {event.title}
                </h3>
                <p className="text-[#2a7c7a] text-sm font-medium mb-1">
                  {new Date(event.start_time).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                {event.location && (
                  <p className="text-gray-500 text-sm">{event.location}</p>
                )}
                {event.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{event.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
