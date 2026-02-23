import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/posts', label: 'Blog Posts' },
  { href: '/admin/devotional', label: 'Gatherings' },
  { href: '/admin/directory', label: 'Directory' },
  { href: '/admin/board', label: 'Board' },
  { href: '/admin/messages', label: 'Messages' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h1 className="font-[var(--font-playfair)] text-2xl font-semibold text-[#1a2744]">
          Admin Dashboard
        </h1>
        <Link href="/" className="text-sm text-[#2a7c7a] hover:underline">
          ← Back to site
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar nav */}
        <nav
          className="lg:w-48 flex-shrink-0"
          aria-label="Admin navigation"
        >
          <ul className="flex flex-row lg:flex-col gap-1 flex-wrap" role="list">
            {ADMIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-[#f5f2ed] hover:text-[#1a2744] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a7c7a]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0" id="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}
