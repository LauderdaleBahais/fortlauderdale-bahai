'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    const res = await fetch('/api/contact', {
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
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-2">
          Message Sent!
        </h2>
        <p className="text-gray-600 mb-6">
          Thank you for reaching out. We&apos;ll get back to you soon.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1a2744] hover:bg-[#243460] text-white font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Your Name <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1a2744] mb-1.5">
              Email Address <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Subject <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent"
            placeholder="What is your message about?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#1a2744] mb-1.5">
            Message <span aria-hidden="true" className="text-red-500">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={7}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[#1a2744] text-base focus:outline-none focus:ring-2 focus:ring-[#2a7c7a] focus:border-transparent resize-y"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </>
  )
}
