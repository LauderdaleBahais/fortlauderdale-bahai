import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { Event, BlogPost } from '@/lib/types'

async function getUpcomingEvents(): Promise<Event[]> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(3)
  return data ?? []
}

async function getLatestPost(): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export default async function HomePage() {
  const [events, latestPost] = await Promise.all([getUpcomingEvents(), getLatestPost()])

  return (
    <>
      {/* Hero */}
      <section className="relative bg-[#1a2744] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a7c7a] to-[#1a2744]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <div className="text-[#c8942a] text-5xl mb-6" aria-hidden="true">✦</div>
          <blockquote className="font-[var(--font-playfair)] text-2xl md:text-4xl font-medium leading-relaxed mb-6 italic">
            &ldquo;So powerful is the light of unity that it can illuminate the whole earth.&rdquo;
          </blockquote>
          <cite className="text-[#c8942a] text-sm md:text-base not-italic tracking-wide uppercase">
            — Bahá&apos;u&apos;lláh
          </cite>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="inline-block bg-[#c8942a] hover:bg-[#e0aa3e] text-white font-medium px-8 py-3 rounded transition-colors"
            >
              Upcoming Events
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-white/40 hover:border-white/80 hover:bg-white/10 text-white font-medium px-8 py-3 rounded transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744] mb-5">
          Welcome to Our Community
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          The Bahá&apos;í community of Fort Lauderdale is a diverse group of individuals united
          by a shared commitment to the principles of the Bahá&apos;í Faith — the oneness of God,
          the oneness of religion, and the oneness of humanity. We warmly welcome everyone to
          our gatherings, study circles, and community events.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/directory" className="text-[#2a7c7a] hover:text-[#1a2744] font-medium underline underline-offset-4 transition-colors">
            Browse Business Directory
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/board" className="text-[#2a7c7a] hover:text-[#1a2744] font-medium underline underline-offset-4 transition-colors">
            Community Board
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/resources" className="text-[#2a7c7a] hover:text-[#1a2744] font-medium underline underline-offset-4 transition-colors">
            Faith Resources
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-[#f5f2ed] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-semibold text-[#1a2744]">
              Upcoming Events
            </h2>
            <Link href="/events" className="text-sm text-[#2a7c7a] hover:text-[#1a2744] font-medium transition-colors">
              View all →
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events at this time.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  {event.is_holy_day && (
                    <span className="inline-block bg-[#c8942a]/10 text-[#c8942a] text-xs font-medium px-2 py-0.5 rounded mb-3">
                      Holy Day
                    </span>
                  )}
                  <h3 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] mb-2 leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#2a7c7a] font-medium mb-1">
                    {formatDateTime(event.start_time)}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      {latestPost && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-semibold text-[#1a2744]">
              Latest News
            </h2>
            <Link href="/news" className="text-sm text-[#2a7c7a] hover:text-[#1a2744] font-medium transition-colors">
              All posts →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:flex gap-8 items-start hover:shadow-md transition-shadow">
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                {formatDate(latestPost.created_at)}
                {latestPost.author_name && ` · ${latestPost.author_name}`}
              </p>
              <h3 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-3 leading-snug">
                {latestPost.title}
              </h3>
              {latestPost.excerpt && (
                <p className="text-gray-600 leading-relaxed">{latestPost.excerpt}</p>
              )}
              <Link
                href={`/news/${latestPost.slug}`}
                className="inline-block mt-4 text-sm text-[#2a7c7a] font-medium hover:text-[#1a2744] transition-colors"
              >
                Read more →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="bg-[#2a7c7a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-semibold mb-3">
            Are you a Bahá&apos;í business owner?
          </h2>
          <p className="text-teal-100 mb-6">
            List your business in our community directory and connect with other members.
          </p>
          <Link
            href="/directory"
            className="inline-block bg-white text-[#2a7c7a] hover:bg-gray-100 font-semibold px-8 py-3 rounded transition-colors"
          >
            Explore the Directory
          </Link>
        </div>
      </section>
    </>
  )
}
