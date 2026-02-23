import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LocaleProvider } from '@/components/LocaleProvider'
import type { Locale } from '@/i18n/request'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Bahá'í Community of Fort Lauderdale",
    template: "%s | Bahá'í Community of Fort Lauderdale",
  },
  description:
    "The official website of the Bahá'í Community of Fort Lauderdale, Florida. Find events, community news, resources, and more.",
  keywords: ["Bahá'í", 'Fort Lauderdale', 'Florida', 'community', 'faith', 'events'],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()
  const isRtl = locale === 'fa'

  return (
    <ClerkProvider>
      <html
        lang={locale}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`${inter.variable} ${playfair.variable}`}
      >
        <body className="min-h-screen flex flex-col bg-[#faf8f4] text-[#1a2744]">
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#1a2744] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium focus:shadow-lg"
          >
            Skip to main content
          </a>

          <NextIntlClientProvider messages={messages} locale={locale}>
            <LocaleProvider locale={locale}>
              <Header />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </LocaleProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
