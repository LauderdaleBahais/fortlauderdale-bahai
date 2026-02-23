import { createServiceClient } from '@/lib/supabase'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import AdminPostActions from '@/components/AdminPostActions'

export default async function AdminPostsPage() {
  const db = createServiceClient()
  const { data: posts } = await db
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[var(--font-playfair)] text-xl font-semibold text-[#1a2744]">
          Blog Posts ({posts?.length ?? 0})
        </h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-[#1a2744] hover:bg-[#243460] text-white text-sm font-medium px-4 py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No posts yet.</p>
      ) : (
        <ul className="space-y-3" role="list">
          {posts.map((post) => (
            <li key={post.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    post.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-medium text-[#1a2744] truncate">{post.title}</h3>
                <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
              </div>
              <AdminPostActions postId={post.id} published={post.published} slug={post.slug} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
