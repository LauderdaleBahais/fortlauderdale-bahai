'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateTime } from '@/lib/utils'

type Item = {
  id: string
  title?: string
  business_name?: string
  [key: string]: unknown
}

type Props = {
  items: Item[]
  table: string
  renderDetails: (item: Item) => React.ReactNode
  emptyMessage?: string
}

export default function AdminApprovalList({ items, table, renderDetails, emptyMessage }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setProcessingId(id)
    await fetch(`/api/admin/moderate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, table, action }),
    })
    startTransition(() => {
      router.refresh()
      setProcessingId(null)
    })
  }

  if (items.length === 0) {
    return (
      <p className="text-gray-500 py-8 text-center">
        {emptyMessage ?? 'Nothing to review. All clear!'}
      </p>
    )
  }

  return (
    <ul className="space-y-4" role="list">
      {items.map((item) => {
        const label = item.title ?? item.business_name ?? 'Untitled'
        const isProcessing = processingId === item.id

        return (
          <li key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-[var(--font-playfair)] font-semibold text-[#1a2744] mb-1 leading-snug">
                  {label}
                </h3>
                <div className="text-sm text-gray-500 space-y-0.5">
                  {renderDetails(item)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAction(item.id, 'approve')}
                  disabled={isProcessing || pending}
                  aria-label={`Approve ${label}`}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                >
                  {isProcessing ? '…' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction(item.id, 'reject')}
                  disabled={isProcessing || pending}
                  aria-label={`Reject ${label}`}
                  className="bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 text-sm font-medium px-4 py-2 rounded border border-red-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
                >
                  Reject
                </button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
