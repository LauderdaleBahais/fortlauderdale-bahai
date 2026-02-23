'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BUSINESS_CATEGORIES } from '@/lib/types'

export default function SubmitDirectoryPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value || null

    const data = {
      business_name: getValue('business_name'),
      category: getValue('category'),
      description: getValue('description'),
      website_url: getValue('website_url'),
      phone: getValue('phone'),
      email: getValue('email'),
      location: getValue('location'),
    }

    const res = await fetch('/api/directory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const json = await res.json()
      setError(json.error ?? 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-5xl mb-4" aria-hidden="true">✓</div>
        <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-3">
          Listing Submitted!
        </h1>
        <p className="text-gray-600 mb-6">
          Your business listing is under review and will appear in the directory once approved.
        </p>
        <button
          onClick={() => router.push('/directory')}
          className="bg-[#1a2744] hover:bg-[#243460] text-white px-6 py-2.5 rounded font-medium transition-colors"
        >
          Back to Directory
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-semibold text-[#1a2744] mb-2">
        List Your Business
      </h1>
      <p className="text-gray-600 mb-8">
        Submit your business to appear in the community directory. All listings are reviewed before publishing.
      </p>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Business Name <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Category <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
          >
            <option value="">Select a category…</option>
            {BUSINESS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
            placeholder="Briefly describe your business and the services you offer…"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
              placeholder="(954) 555-0100"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Business Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="website_url" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Website URL
          </label>
          <input
            id="website_url"
            name="website_url"
            type="url"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="https://"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="Fort Lauderdale, FL"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
