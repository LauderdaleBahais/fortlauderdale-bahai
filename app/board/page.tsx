import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { BoardThread } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Community Board',
  description: 'Community discussions for the Fort Lauderdale Bahá\'í community.',
}

export const revalidate = 300

type ThreadWithReplyCount = BoardThread & { reply_count: number }

async function getThreads(): Promise<ThreadWithReplyCount[]> {
  const { data: threads } = await supabase
    .from('board_threads')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (!threads) return []

  const withCounts = await Promise.all(
    threads.map(async (thread) => {
      const { count } = await supabase
        .from('board_replies')
        .select('*', { count: 'exact', head: true })
        .eq('thread_id', thread.id)
      return { ...thread, reply_count: count ?? 0 }
    })
  )

  return withCounts
}

export default async function BoardPage() {
  const threads = await getThreads()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744]">
            Community Board
          </h1>
          <p className="mt-2 text-gray-600">
            A space for community discussion. Sign in to post and reply.
          </p>
        </div>
        <Link
          href="/board/new"
          className="inline-flex items-center gap-2 bg-[#2a7c7a] hover:bg-[#3a9a97] text-white font-medium px-5 py-2.5 rounded transition-colors text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Thread
        </Link>
      </div>

      {threads.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No discussions yet. Be the first to start one!
        </p>
      ) : (
        <div
          className="space-y-2"
          role="list"
          aria-label="Discussion threads"
        >
          {threads.map((thread) => (
            <article
              key={thread.id}
              role="listitem"
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/board/${thread.id}`}
                className="flex items-start justify-between gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-inset rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {thread.pinned && (
                      <span className="inline-flex items-center gap-1 text-xs bg-[#c8942a]/10 text-[#c8942a] font-medium px-2 py-0.5 rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                        </svg>
                        Pinned
                      </span>
                    )}
                  </div>
                  <h2 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] leading-snug truncate">
                    {thread.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted by {thread.author_name ?? 'Anonymous'} · {formatDate(thread.created_at)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-sm font-semibold text-[#2a7c7a]">{thread.reply_count}</span>
                  <p className="text-xs text-gray-400">
                    {thread.reply_count === 1 ? 'reply' : 'replies'}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
