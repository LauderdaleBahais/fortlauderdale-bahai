'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateTime } from '@/lib/utils'
import type { BoardThread, BoardReply } from '@/lib/types'

type Props = {
  threads: BoardThread[]
  replies: BoardReply[]
}

export default function AdminBoardModeration({ threads, replies }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string, type: 'thread' | 'reply') {
    setDeleting(id)
    await fetch('/api/admin/board-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    })
    startTransition(() => {
      router.refresh()
      setDeleting(null)
    })
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="threads-heading">
        <h3 id="threads-heading" className="font-semibold text-[#1a2744] mb-4">
          Threads ({threads.length})
        </h3>
        {threads.length === 0 ? (
          <p className="text-gray-500 text-sm">No threads.</p>
        ) : (
          <ul className="space-y-3" role="list">
            {threads.map((t) => (
              <li key={t.id} className="bg-white border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1a2744] truncate">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.author_name} · {formatDateTime(t.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{t.body}</p>
                </div>
                <button
                  onClick={() => handleDelete(t.id, 'thread')}
                  disabled={deleting === t.id}
                  aria-label={`Delete thread: ${t.title}`}
                  className="flex-shrink-0 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  {deleting === t.id ? '…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="replies-heading">
        <h3 id="replies-heading" className="font-semibold text-[#1a2744] mb-4">
          Replies ({replies.length})
        </h3>
        {replies.length === 0 ? (
          <p className="text-gray-500 text-sm">No replies.</p>
        ) : (
          <ul className="space-y-3" role="list">
            {replies.map((r) => (
              <li key={r.id} className="bg-white border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">
                    {r.author_name} · {formatDateTime(r.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.body}</p>
                </div>
                <button
                  onClick={() => handleDelete(r.id, 'reply')}
                  disabled={deleting === r.id}
                  aria-label="Delete reply"
                  className="flex-shrink-0 text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  {deleting === r.id ? '…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
