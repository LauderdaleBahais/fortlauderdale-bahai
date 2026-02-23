'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPostPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      excerpt: (form.elements.namedItem('excerpt') as HTMLTextAreaElement).value,
      content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
      published: (form.elements.namedItem('published') as HTMLInputElement).checked,
    }

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      const { slug } = await res.json()
      router.push(`/news/${slug}`)
    } else {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744] mb-6">
        New Blog Post
      </h2>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Title <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input id="title" name="title" type="text" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent" />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Excerpt (shown in previews)
          </label>
          <textarea id="excerpt" name="excerpt" rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Content (HTML supported)
          </label>
          <textarea id="content" name="content" rows={16}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
            placeholder="<p>Write your post here…</p>" />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-[#2a7c7a] focus:ring-[#2a7c7a]"
          />
          <label htmlFor="published" className="text-sm font-medium text-[#1a2744]">
            Publish immediately
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting}
            className="bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2">
            {submitting ? 'Saving…' : 'Save Post'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
