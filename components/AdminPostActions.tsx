'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  postId: string
  published: boolean
  slug: string
}

export default function AdminPostActions({ postId, published, slug }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [busy, setBusy] = useState(false)

  async function togglePublish() {
    setBusy(true)
    await fetch('/api/admin/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId, published: !published }),
    })
    startTransition(() => {
      router.refresh()
      setBusy(false)
    })
  }

  async function deletePost() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setBusy(true)
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: postId }),
    })
    startTransition(() => {
      router.refresh()
      setBusy(false)
    })
  }

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link
        href={`/news/${slug}`}
        target="_blank"
        className="text-xs text-[#2a7c7a] hover:underline focus-visible:outline-none focus-visible:underline"
      >
        View
      </Link>
      <button
        onClick={togglePublish}
        disabled={busy}
        className="text-xs bg-[#f5f2ed] hover:bg-gray-200 disabled:opacity-50 text-[#1a2744] px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744]"
      >
        {busy ? '…' : published ? 'Unpublish' : 'Publish'}
      </button>
      <button
        onClick={deletePost}
        disabled={busy}
        className="text-xs bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 px-3 py-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        Delete
      </button>
    </div>
  )
}
