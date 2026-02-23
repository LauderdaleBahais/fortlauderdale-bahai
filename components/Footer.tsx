import Link from 'next/link'
import NewsletterSignup from './NewsletterSignup'

export default function Footer() {
  return (
    <footer className="bg-[#1a2744] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#c8942a] text-2xl" aria-hidden="true">✦</span>
              <div>
                <div className="font-[var(--font-playfair)] text-white font-semibold">
                  Bahá&apos;í Community
                </div>
                <div className="text-xs text-[#c8942a] tracking-widest uppercase">
                  Fort Lauderdale, Florida
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Striving to serve the community and work toward the betterment of the world.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Events', '/events'],
                ['Community News', '/news'],
                ['Community Board', '/board'],
                ['Business Directory', '/directory'],
                ['Resources', '/resources'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-[#c8942a] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
              Bahá&apos;í Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Bahá\'í World Community', 'https://www.bahai.org'],
                ['Bahá\'ís of the United States', 'https://www.bahai.us'],
                ['Bahá\'í Reference Library', 'https://reference.bahai.org'],
                ['Ruhi Institute', 'https://www.ruhi.org'],
                ['Bahá\'í World News', 'https://news.bahai.org'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#c8942a] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
      <div id="newsletter" className="border-t border-white/10 mt-10 pt-10">
        <NewsletterSignup />
      </div>

      <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Bahá&apos;í Community of Fort Lauderdale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
