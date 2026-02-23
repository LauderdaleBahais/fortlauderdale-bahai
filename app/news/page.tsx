import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Community News',
  description: "News, stories, and updates from the Bahá'í Community of Fort Lauderdale.",
}

export const revalidate = 3600

async function getPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744] mb-3">
        Community News
      </h1>
      <p className="text-gray-600 mb-10">
        News, stories, and updates from our community.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition-shadow"
            >
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                {formatDate(post.created_at)}
                {post.author_name && (
                  <span className="text-gray-300 mx-2" aria-hidden="true">·</span>
                )}
                {post.author_name && (
                  <span>{post.author_name}</span>
                )}
              </p>
              <h2 className="font-[var(--font-playfair)] text-xl md:text-2xl font-semibold text-[#1a2744] mb-3 leading-snug">
                <Link
                  href={`/news/${post.slug}`}
                  className="hover:text-[#2a7c7a] transition-colors focus-visible:outline-none focus-visible:underline"
                >
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
              )}
              <Link
                href={`/news/${post.slug}`}
                className="inline-block mt-4 text-sm text-[#2a7c7a] font-medium hover:text-[#1a2744] transition-colors focus-visible:outline-none focus-visible:underline"
                aria-label={`Read full post: ${post.title}`}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
