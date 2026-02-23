'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEVOTIONAL_TYPES } from '@/lib/types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SubmitDevotionalPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
        ?.value || null

    const res = await fetch('/api/devotional', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: get('title'),
        type: get('type'),
        description: get('description'),
        location: get('location'),
        address: get('address'),
        schedule: get('schedule'),
        recurrence: get('recurrence'),
        day_of_week: get('day_of_week'),
        time_of_day: get('time_of_day'),
        host_name: get('host_name'),
        host_contact: get('host_contact'),
      }),
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
          Gathering Submitted!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you! Your gathering will appear once reviewed by an admin.
        </p>
        <button
          onClick={() => router.push('/devotional')}
          className="bg-[#1a2744] hover:bg-[#243460] text-white px-6 py-2.5 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          Back to Gatherings
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-semibold text-[#1a2744] mb-2">
        Submit a Gathering
      </h1>
      <p className="text-gray-600 mb-8">
        Share a devotional gathering, study circle, or class with the community.
      </p>

      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Title <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input id="title" name="title" type="text" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="e.g. Living Room Devotional" />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Type <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <select id="type" name="type" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent">
            <option value="">Select a type…</option>
            {DEVOTIONAL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Description
          </label>
          <textarea id="description" name="description" rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
            placeholder="Tell us about this gathering — who it's for, what to expect…" />
        </div>

        <div>
          <label htmlFor="schedule" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Schedule Description <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input id="schedule" name="schedule" type="text" required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="e.g. Every Sunday at 10:00 AM" />
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Recurrence
            </label>
            <select id="recurrence" name="recurrence"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="one-time">One-time</option>
            </select>
          </div>
          <div>
            <label htmlFor="day_of_week" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Day of Week
            </label>
            <select id="day_of_week" name="day_of_week"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent">
              <option value="">—</option>
              {DAYS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="time_of_day" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Time
            </label>
            <input id="time_of_day" name="time_of_day" type="time"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent" />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Location Name
          </label>
          <input id="location" name="location" type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="e.g. Private home, Community center" />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Address <span className="text-xs text-gray-400">(visible to confirmed attendees only)</span>
          </label>
          <input id="address" name="address" type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="123 Main St, Fort Lauderdale, FL" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="host_name" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Host Name
            </label>
            <input id="host_name" name="host_name" type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent" />
          </div>
          <div>
            <label htmlFor="host_contact" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Contact (email or phone)
            </label>
            <input id="host_contact" name="host_contact" type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent" />
          </div>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2">
          {submitting ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
