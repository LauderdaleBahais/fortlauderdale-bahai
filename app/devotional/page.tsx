import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { DevotionalGathering } from '@/lib/types'
import { DEVOTIONAL_TYPES } from '@/lib/types'
import DevotionalFilter from '@/components/DevotionalFilter'

export const metadata: Metadata = {
  title: 'Devotional Gatherings & Study Circles',
  description:
    "Join devotional gatherings, Ruhi study circles, children's classes, and junior youth programs in Fort Lauderdale.",
}

export const revalidate = 3600

async function getGatherings(): Promise<DevotionalGathering[]> {
  const { data } = await supabase
    .from('devotional_gatherings')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function DevotionalPage() {
  const gatherings = await getGatherings()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744]">
            Devotional Gatherings &amp; Study Circles
          </h1>
          <p className="mt-2 text-gray-600">
            Join us for devotions, Ruhi study circles, children&apos;s classes, and junior youth programs.
          </p>
        </div>
        <Link
          href="/devotional/submit"
          className="inline-flex items-center gap-2 bg-[#2a7c7a] hover:bg-[#3a9a97] text-white font-medium px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Submit a Gathering
        </Link>
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-2 mb-8" aria-label="Gathering types">
        {DEVOTIONAL_TYPES.map((type) => (
          <span
            key={type}
            className="inline-block bg-[#f5f2ed] text-[#1a2744] text-xs font-medium px-3 py-1 rounded-full border border-gray-200"
          >
            {type}
          </span>
        ))}
      </div>

      <DevotionalFilter gatherings={gatherings} />
    </div>
  )
}
