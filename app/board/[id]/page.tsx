import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import BoardReplyForm from '@/components/BoardReplyForm'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('board_threads')
    .select('title')
    .eq('id', id)
    .single()
  return { title: data?.title ?? 'Discussion' }
}

export default async function BoardThreadPage({ params }: Props) {
  const { id } = await params
  const { userId } = await auth()

  const [{ data: thread }, { data: replies }] = await Promise.all([
    supabase.from('board_threads').select('*').eq('id', id).single(),
    supabase
      .from('board_replies')
      .select('*')
      .eq('thread_id', id)
      .order('created_at', { ascending: true }),
  ])

  if (!thread) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link
          href="/board"
          className="text-sm text-[#2a7c7a] hover:text-[#1a2744] transition-colors focus-visible:outline-none focus-visible:underline"
        >
          ← Community Board
        </Link>
      </nav>

      {/* Thread */}
      <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-7 mb-6">
        {thread.pinned && (
          <span className="inline-flex items-center gap-1 text-xs bg-[#c8942a]/10 text-[#c8942a] font-medium px-2 py-0.5 rounded mb-3">
            Pinned
          </span>
        )}
        <h1 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-semibold text-[#1a2744] mb-3">
          {thread.title}
        </h1>
        <p className="text-xs text-gray-400 mb-4">
          Posted by {thread.author_name ?? 'Anonymous'} · {formatDateTime(thread.created_at)}
        </p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{thread.body}</div>
      </article>

      {/* Replies */}
      <section aria-labelledby="replies-heading">
        <h2 id="replies-heading" className="text-lg font-semibold text-[#1a2744] mb-4">
          {replies && replies.length > 0
            ? `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`
            : 'No replies yet'}
        </h2>

        {replies && replies.length > 0 && (
          <div className="space-y-4 mb-8" role="list" aria-label="Replies">
            {replies.map((reply, i) => (
              <article
                key={reply.id}
                role="listitem"
                className="bg-white rounded-lg border border-gray-100 p-5"
              >
                <p className="text-xs text-gray-400 mb-2">
                  {reply.author_name ?? 'Anonymous'} · {formatDateTime(reply.created_at)}
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.body}</p>
                {i < replies.length - 1 && (
                  <span className="sr-only">End of reply {i + 1}</span>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Reply form */}
        {userId ? (
          <BoardReplyForm threadId={id} />
        ) : (
          <div className="bg-[#f5f2ed] rounded-lg p-6 text-center">
            <p className="text-gray-600 mb-4">Sign in to join the discussion.</p>
            <Link
              href="/sign-in"
              className="inline-block bg-[#1a2744] hover:bg-[#243460] text-white font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
