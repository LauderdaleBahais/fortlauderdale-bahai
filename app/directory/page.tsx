import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { BusinessListing } from '@/lib/types'
import DirectoryGrid from '@/components/DirectoryGrid'

export const metadata: Metadata = {
  title: 'Business Directory',
  description:
    "Discover businesses and services offered by members of the Fort Lauderdale Bahá'í community.",
}

export const revalidate = 3600

async function getListings(): Promise<BusinessListing[]> {
  const { data } = await supabase
    .from('business_listings')
    .select('*')
    .in('status', ['approved', 'featured'])
    .order('status', { ascending: false })
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function DirectoryPage() {
  const listings = await getListings()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744]">
            Business Directory
          </h1>
          <p className="mt-2 text-gray-600">
            Discover businesses and services from members of our community.
          </p>
        </div>
        <Link
          href="/directory/submit"
          className="inline-flex items-center gap-2 bg-[#2a7c7a] hover:bg-[#3a9a97] text-white font-medium px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          List Your Business
        </Link>
      </div>

      <DirectoryGrid listings={listings} />
    </div>
  )
}
