'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import LanguageToggle from './LanguageToggle'

export default function Header() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { isSignedIn, user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAdmin = user?.publicMetadata?.role === 'admin'

  const NAV_LINKS = [
    { href: '/', label: t('home') },
    { href: '/events', label: t('events') },
    { href: '/news', label: t('news') },
    { href: '/board', label: t('board') },
    { href: '/directory', label: t('directory') },
    { href: '/devotional', label: t('devotional') },
    { href: '/resources', label: t('resources') },
    { href: '/contact', label: t('contact') },
  ]

  return (
    <header className="bg-[#1a2744] text-white shadow-md" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2744] rounded"
            aria-label="Bahá'í Community of Fort Lauderdale — Home"
          >
            <span className="text-[#c8942a] text-2xl leading-none select-none" aria-hidden="true">
              ✦
            </span>
            <div>
              <div className="font-[var(--font-playfair)] text-base md:text-lg font-semibold leading-tight">
                Bahá&apos;í Community
              </div>
              <div className="text-xs text-[#c8942a] tracking-widest uppercase">
                Fort Lauderdale
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden xl:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`px-2.5 py-2 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a2744] ${
                  pathname === link.href
                    ? 'text-[#c8942a]'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
            <LanguageToggle />
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-xs bg-[#c8942a] hover:bg-[#e0aa3e] text-white px-3 py-1.5 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a2744]"
                  >
                    {t('admin')}
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-sm text-gray-200 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a2744] rounded"
                >
                  {t('profile')}
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="text-sm text-gray-200 hover:text-white px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a2744] rounded">
                    {t('signIn')}
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm bg-[#2a7c7a] hover:bg-[#3a9a97] text-white px-4 py-1.5 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] focus-visible:ring-offset-1 focus-visible:ring-offset-[#1a2744]">
                    {t('join')}
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden p-2 rounded text-gray-200 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="xl:hidden border-t border-white/10 bg-[#1a2744]">
          <nav
            className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`px-3 py-2.5 rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8942a] ${
                  pathname === link.href
                    ? 'text-[#c8942a]'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex items-center gap-3 flex-wrap">
              <LanguageToggle />
              {isSignedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="text-xs bg-[#c8942a] hover:bg-[#e0aa3e] text-white px-3 py-1.5 rounded font-medium transition-colors"
                    >
                      {t('admin')}
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-gray-200 hover:text-white transition-colors"
                  >
                    {t('profile')}
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-sm text-gray-200 hover:text-white px-3 py-1.5 transition-colors">
                      {t('signIn')}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="text-sm bg-[#2a7c7a] hover:bg-[#3a9a97] text-white px-4 py-1.5 rounded font-medium transition-colors">
                      {t('join')}
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
