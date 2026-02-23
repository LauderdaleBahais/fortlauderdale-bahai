import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

export const SUPPORTED_LOCALES = ['en', 'fa'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headersList = await headers()

  // 1. Check cookie preference
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
    const locale = cookieLocale as Locale
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default,
    }
  }

  // 2. Fall back to Accept-Language header
  const acceptLanguage = headersList.get('accept-language') ?? ''
  const locale: Locale = acceptLanguage.includes('fa') ? 'fa' : 'en'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
