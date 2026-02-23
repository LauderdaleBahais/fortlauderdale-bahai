'use client'

import { useLocale } from './LocaleProvider'

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <div
      className="flex items-center gap-1 border border-white/20 rounded-full px-1 py-0.5"
      role="group"
      aria-label="Select language"
    >
      <button
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="Switch to English"
        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
          locale === 'en'
            ? 'bg-white text-[#1a2744]'
            : 'text-white/70 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('fa')}
        aria-pressed={locale === 'fa'}
        aria-label="تغییر به فارسی"
        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
          locale === 'fa'
            ? 'bg-white text-[#1a2744]'
            : 'text-white/70 hover:text-white'
        }`}
        style={{ fontFamily: 'system-ui, sans-serif' }}
      >
        فا
      </button>
    </div>
  )
}
