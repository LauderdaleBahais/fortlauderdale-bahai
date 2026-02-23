'use client'

import { useState } from 'react'
import type { DevotionalGathering } from '@/lib/types'
import { DEVOTIONAL_TYPES } from '@/lib/types'

type Props = {
  gatherings: DevotionalGathering[]
}

const TYPE_COLORS: Record<string, string> = {
  Devotional: 'bg-[#1a2744]/10 text-[#1a2744]',
  'Study Circle': 'bg-[#2a7c7a]/10 text-[#2a7c7a]',
  "Children's Class": 'bg-[#c8942a]/10 text-[#c8942a]',
  'Junior Youth': 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function DevotionalFilter({ gatherings }: Props) {
  const [activeType, setActiveType] = useState<string>('All')
  const [rsvpSent, setRsvpSent] = useState<Set<string>>(new Set())

  const filtered =
    activeType === 'All'
      ? gatherings
      : gatherings.filter((g) => g.type === activeType)

  function handleRsvp(id: string) {
    setRsvpSent((prev) => new Set([...prev, id]))
  }

  return (
    <div>
      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2 mb-8"
        role="group"
        aria-label="Filter gatherings by type"
      >
        {['All', ...DEVOTIONAL_TYPES].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            aria-pressed={activeType === type}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] ${
              activeType === type
                ? 'bg-[#1a2744] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2a7c7a] hover:text-[#2a7c7a]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No gatherings listed at this time.</p>
          <p className="text-gray-400 text-sm mt-2">
            Be the first to{' '}
            <a href="/devotional/submit" className="text-[#2a7c7a] underline">
              submit a gathering
            </a>
            .
          </p>
        </div>
      ) : (
        <ul
          className="grid gap-5 md:grid-cols-2"
          role="list"
          aria-label="Gatherings list"
        >
          {filtered.map((g) => (
            <li key={g.id} role="listitem">
              <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] leading-snug">
                    {g.title}
                  </h2>
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                      TYPE_COLORS[g.type] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {g.type}
                  </span>
                </div>

                {g.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
                    {g.description}
                  </p>
                )}

                <dl className="space-y-2 text-sm mt-auto">
                  <div className="flex items-start gap-2 text-gray-600">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#2a7c7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <dt className="sr-only">Schedule</dt>
                      <dd className="font-medium text-[#1a2744]">{g.schedule}</dd>
                      {g.day_of_week && g.time_of_day && (
                        <dd className="text-gray-500">{g.day_of_week}s at {g.time_of_day}</dd>
                      )}
                      <dd className="text-xs text-gray-400 capitalize">{g.recurrence}</dd>
                    </div>
                  </div>

                  {g.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0 text-[#2a7c7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <dt className="sr-only">Location</dt>
                      <dd>{g.location}</dd>
                    </div>
                  )}

                  {g.host_name && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0 text-[#2a7c7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <dt className="sr-only">Host</dt>
                      <dd>
                        Hosted by {g.host_name}
                        {g.host_contact && (
                          <>
                            {' · '}
                            <a
                              href={
                                g.host_contact.includes('@')
                                  ? `mailto:${g.host_contact}`
                                  : `tel:${g.host_contact}`
                              }
                              className="text-[#2a7c7a] hover:underline focus-visible:outline-none focus-visible:underline"
                            >
                              {g.host_contact}
                            </a>
                          </>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>

                <button
                  onClick={() => handleRsvp(g.id)}
                  disabled={rsvpSent.has(g.id)}
                  aria-label={
                    rsvpSent.has(g.id)
                      ? `RSVP confirmed for ${g.title}`
                      : `RSVP to ${g.title}`
                  }
                  className={`mt-5 w-full py-2.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                    rsvpSent.has(g.id)
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-default focus-visible:ring-green-500'
                      : 'bg-[#1a2744] hover:bg-[#243460] text-white focus-visible:ring-[#1a2744]'
                  }`}
                >
                  {rsvpSent.has(g.id) ? 'RSVP Sent ✓' : 'RSVP'}
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
