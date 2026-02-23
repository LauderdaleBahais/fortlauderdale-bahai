'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function SubmitEventPage() {
  const { user } = useUser()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      location: (form.elements.namedItem('location') as HTMLInputElement).value,
      start_time: (form.elements.namedItem('start_time') as HTMLInputElement).value,
      end_time: (form.elements.namedItem('end_time') as HTMLInputElement).value || null,
    }

    const res = await fetch('/api/events', {
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
          Event Submitted!
        </h1>
        <p className="text-gray-600 mb-6">
          Your event has been submitted for review. An admin will approve it shortly.
        </p>
        <button
          onClick={() => router.push('/events')}
          className="bg-[#1a2744] hover:bg-[#243460] text-white px-6 py-2.5 rounded font-medium transition-colors"
        >
          Back to Calendar
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-semibold text-[#1a2744] mb-2">
        Submit an Event
      </h1>
      <p className="text-gray-600 mb-8">
        Events are reviewed by an admin before appearing on the calendar.
      </p>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Event Title <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent text-base"
            placeholder="e.g. Devotional Gathering"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Start Date & Time <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="start_time"
              name="start_time"
              type="datetime-local"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent text-base"
            />
          </div>
          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              End Date & Time
            </label>
            <input
              id="end_time"
              name="end_time"
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent text-base"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent text-base"
            placeholder="Address or online link"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent text-base resize-y"
            placeholder="Tell us about the event..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-base"
        >
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
