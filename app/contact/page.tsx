import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contact the Bahá'í Community of Fort Lauderdale.",
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744] mb-3">
        Contact Us
      </h1>
      <p className="text-gray-600 mb-10">
        Have a question or want to get involved? We&apos;d love to hear from you.
      </p>

      <ContactForm />

      <div className="mt-12 pt-8 border-t border-gray-100 grid sm:grid-cols-2 gap-6 text-sm text-gray-600">
        <div>
          <h2 className="font-semibold text-[#1a2744] mb-1">Location</h2>
          <p>Fort Lauderdale, Florida</p>
          <p className="text-gray-400">Broward County</p>
        </div>
        <div>
          <h2 className="font-semibold text-[#1a2744] mb-1">External Resources</h2>
          <ul className="space-y-1">
            <li>
              <a href="https://www.bahai.us" target="_blank" rel="noopener noreferrer"
                className="text-[#2a7c7a] hover:underline focus-visible:outline-none focus-visible:underline">
                Bahá&apos;ís of the United States
              </a>
            </li>
            <li>
              <a href="https://www.bahai.org" target="_blank" rel="noopener noreferrer"
                className="text-[#2a7c7a] hover:underline focus-visible:outline-none focus-visible:underline">
                Bahá&apos;í World Community
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
