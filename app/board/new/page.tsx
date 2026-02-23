'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewThreadPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim()
    const body = (form.elements.namedItem('body') as HTMLTextAreaElement).value.trim()

    const res = await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    })

    if (res.ok) {
      const { id } = await res.json()
      router.push(`/board/${id}`)
    } else {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-semibold text-[#1a2744] mb-2">
        Start a Discussion
      </h1>
      <p className="text-gray-600 mb-8">
        Your post will be visible to the community. Please be respectful and on-topic.
      </p>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Thread Title <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="What would you like to discuss?"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Message <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
            placeholder="Share your thoughts…"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          {submitting ? 'Posting…' : 'Post Thread'}
        </button>
      </form>
    </div>
  )
}
