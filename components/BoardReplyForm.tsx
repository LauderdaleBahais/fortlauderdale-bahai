'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BoardReplyForm({ threadId }: { threadId: string }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/board/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId, body: body.trim() }),
    })

    if (res.ok) {
      setBody('')
      router.refresh()
    } else {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  return (
    <section aria-labelledby="reply-form-heading" className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 id="reply-form-heading" className="font-semibold text-[#1a2744] mb-4">
        Leave a Reply
      </h3>

      {error && (
        <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="reply-body" className="sr-only">Your reply</label>
        <textarea
          id="reply-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          required
          placeholder="Write your reply…"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="mt-3 bg-[#2a7c7a] hover:bg-[#3a9a97] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a] focus-visible:ring-offset-2"
        >
          {submitting ? 'Posting…' : 'Post Reply'}
        </button>
      </form>
    </section>
  )
}
