'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function NewsletterSignup() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), name: name.trim() }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const json = await res.json()
      setError(json.error ?? t('error'))
    }
    setSubmitting(false)
  }

  if (success) {
    return (
      <div className="text-center" role="status" aria-live="polite">
        <div className="text-2xl mb-2" aria-hidden="true">✓</div>
        <p className="font-semibold text-white">{t('successTitle')}</p>
        <p className="text-sm text-teal-100 mt-1">{t('successDesc')}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-white mb-1">
        {t('title')}
      </h2>
      <p className="text-sm text-teal-100 mb-4">{t('description')}</p>

      {error && (
        <div role="alert" className="mb-3 bg-red-100 text-red-700 rounded px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <label htmlFor="newsletter-name" className="sr-only">Your name (optional)</label>
            <input
              id="newsletter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              autoComplete="name"
              className="w-full px-4 py-2.5 rounded-lg text-[#1a2744] text-base bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">{t('placeholder')}</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('placeholder')}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg text-[#1a2744] text-base bg-white border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || !email.trim()}
          className="bg-[#c8942a] hover:bg-[#e0aa3e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a7c7a]"
        >
          {submitting ? t('subscribing') : t('subscribe')}
        </button>
      </form>
      <p className="mt-2 text-xs text-teal-200">
        {t('unsubscribeLink')}
      </p>
    </div>
  )
}
