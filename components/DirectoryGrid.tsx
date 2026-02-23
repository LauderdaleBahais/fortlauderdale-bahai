'use client'

import { useState } from 'react'
import type { BusinessListing } from '@/lib/types'
import { BUSINESS_CATEGORIES } from '@/lib/types'

type Props = {
  listings: BusinessListing[]
}

export default function DirectoryGrid({ listings }: Props) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')

  const filtered = listings.filter((l) => {
    const matchesSearch =
      !search ||
      l.business_name.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase()) ||
      l.owner_name?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = category === 'All Categories' || l.category === category

    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <label htmlFor="dir-search" className="sr-only">Search businesses</label>
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="dir-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-base text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="dir-category" className="sr-only">Filter by category</label>
          <select
            id="dir-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2.5 text-base text-[#1a2744] bg-white focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
          >
            <option>All Categories</option>
            {BUSINESS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6" aria-live="polite" aria-atomic="true">
        {filtered.length === 0
          ? 'No listings found.'
          : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">No listings found.</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <ul
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Business listings"
        >
          {filtered.map((listing) => (
            <li key={listing.id} role="listitem">
              <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h2 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] leading-snug">
                      {listing.business_name}
                    </h2>
                    {listing.owner_name && (
                      <p className="text-xs text-gray-400 mt-0.5">{listing.owner_name}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="inline-block bg-[#f5f2ed] text-[#1a2744] text-xs font-medium px-2 py-0.5 rounded">
                      {listing.category}
                    </span>
                    {listing.status === 'featured' && (
                      <span className="inline-block bg-[#c8942a]/10 text-[#c8942a] text-xs font-medium px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {listing.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {listing.description}
                  </p>
                )}

                <dl className="mt-auto space-y-1.5 text-sm">
                  {listing.location && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <dt className="sr-only">Location</dt>
                      <dd>{listing.location}</dd>
                    </div>
                  )}
                  {listing.phone && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <dt className="sr-only">Phone</dt>
                      <dd>
                        <a href={`tel:${listing.phone}`} className="hover:text-[#2a7c7a] transition-colors focus-visible:outline-none focus-visible:underline">
                          {listing.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {listing.email && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a href={`mailto:${listing.email}`} className="hover:text-[#2a7c7a] transition-colors focus-visible:outline-none focus-visible:underline truncate block max-w-[200px]">
                          {listing.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {listing.website_url && (
                    <div className="flex items-center gap-2 text-[#2a7c7a]">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <dt className="sr-only">Website</dt>
                      <dd>
                        <a
                          href={listing.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline focus-visible:outline-none focus-visible:underline truncate block max-w-[200px]"
                        >
                          Visit website
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
