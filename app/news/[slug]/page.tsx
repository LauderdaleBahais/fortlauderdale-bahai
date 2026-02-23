import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/news"
          className="text-sm text-[#2a7c7a] hover:text-[#1a2744] transition-colors focus-visible:outline-none focus-visible:underline"
        >
          ← Community News
        </Link>
      </nav>

      <article>
        <header className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
            {formatDate(post.created_at)}
            {post.author_name && (
              <>
                <span className="text-gray-300 mx-2" aria-hidden="true">·</span>
                <span>{post.author_name}</span>
              </>
            )}
          </p>
          <h1 className="font-[var(--font-playfair)] text-3xl md:text-4xl font-semibold text-[#1a2744] leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-gray-600 leading-relaxed border-l-4 border-[#c8942a] pl-4">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.content ? (
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:font-[var(--font-playfair)] prose-headings:text-[#1a2744]
              prose-a:text-[#2a7c7a] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#c8942a] prose-blockquote:text-gray-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-gray-500 italic">No content available for this post.</p>
        )}
      </article>

      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link
          href="/news"
          className="text-sm text-[#2a7c7a] hover:text-[#1a2744] font-medium transition-colors focus-visible:outline-none focus-visible:underline"
        >
          ← Back to all news
        </Link>
      </div>
    </div>
  )
}
