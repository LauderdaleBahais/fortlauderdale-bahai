import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import type { Resource } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Resources',
  description: "Curated links to Bahá'í writings, study materials, news, and more.",
}

export const revalidate = 86400

async function getResources(): Promise<Resource[]> {
  const { data } = await supabase
    .from('resources')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

export default async function ResourcesPage() {
  const resources = await getResources()

  const grouped = resources.reduce<Record<string, Resource[]>>((acc, r) => {
    const cat = r.category ?? 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(r)
    return acc
  }, {})

  const CATEGORY_ICONS: Record<string, string> = {
    Faith: '✦',
    Study: '📖',
    News: '📰',
    Prayer: '🙏',
    General: '🔗',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744] mb-3">
        Resources
      </h1>
      <p className="text-gray-600 mb-12">
        Curated links to Bahá&apos;í writings, study materials, news, and more.
      </p>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500 text-center py-16">No resources listed yet.</p>
      ) : (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} aria-labelledby={`cat-${category}`}>
              <div className="flex items-center gap-3 mb-5">
                <span aria-hidden="true" className="text-[#c8942a] text-xl">
                  {CATEGORY_ICONS[category] ?? '🔗'}
                </span>
                <h2
                  id={`cat-${category}`}
                  className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744]"
                >
                  {category}
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2" role="list">
                {items.map((r) => (
                  <li key={r.id} role="listitem">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col bg-white rounded-lg border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#2a7c7a]/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-offset-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-[#1a2744] group-hover:text-[#2a7c7a] transition-colors leading-snug">
                          {r.title}
                        </span>
                        <svg
                          className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-[#2a7c7a] transition-colors mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                      {r.description && (
                        <span className="mt-1.5 text-sm text-gray-500 leading-relaxed">
                          {r.description}
                        </span>
                      )}
                      <span className="mt-2 text-xs text-gray-300">
                        {new URL(r.url).hostname}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
