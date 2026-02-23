import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false },
}

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-3">
          Invalid Unsubscribe Link
        </h1>
        <p className="text-gray-600 mb-6">This unsubscribe link is invalid or has expired.</p>
        <Link href="/" className="text-[#2a7c7a] hover:underline">Return to Home</Link>
      </div>
    )
  }

  const db = createServiceClient()
  const { data: sub, error } = await db
    .from('email_subscribers')
    .select('id, email, subscribed')
    .eq('unsubscribe_token', token)
    .single()

  if (error || !sub) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-3">
          Link Not Found
        </h1>
        <p className="text-gray-600 mb-6">We couldn&apos;t find this unsubscribe link. You may already be unsubscribed.</p>
        <Link href="/" className="text-[#2a7c7a] hover:underline">Return to Home</Link>
      </div>
    )
  }

  if (!sub.subscribed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-3">
          Already Unsubscribed
        </h1>
        <p className="text-gray-600 mb-6">
          <strong>{sub.email}</strong> is already unsubscribed from our mailing list.
        </p>
        <Link href="/" className="text-[#2a7c7a] hover:underline">Return to Home</Link>
      </div>
    )
  }

  // Mark as unsubscribed
  await db
    .from('email_subscribers')
    .update({ subscribed: false })
    .eq('id', sub.id)

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5" aria-hidden="true">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744] mb-3">
        Unsubscribed Successfully
      </h1>
      <p className="text-gray-600 mb-6">
        <strong>{sub.email}</strong> has been removed from our mailing list. You won&apos;t receive any more emails from us.
      </p>
      <p className="text-sm text-gray-400 mb-6">
        Changed your mind?{' '}
        <Link href="/#newsletter" className="text-[#2a7c7a] hover:underline">
          Resubscribe here
        </Link>
        .
      </p>
      <Link
        href="/"
        className="inline-block bg-[#1a2744] hover:bg-[#243460] text-white font-medium px-6 py-2.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
      >
        Return to Home
      </Link>
    </div>
  )
}
