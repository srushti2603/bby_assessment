import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import PostCard from './PostCard'

interface BookmarkViewProps {
  currentUser: User
}

export default function BookmarkView({ currentUser }: BookmarkViewProps) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('post_id, posts(*)')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
      if (data) {
        setBookmarkedPosts(data.map((b: any) => b.posts))
      }
      setLoading(false)
    }
    fetchBookmarks()
  }, [currentUser.id])

  if (loading) return <div className="p-4">Loading bookmarks...</div>
  if (!bookmarkedPosts.length) return <div className="p-4">No bookmarks yet.</div>

  return (
    <div className="space-y-4 p-4">
      {bookmarkedPosts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} onUpdate={() => {}} />
      ))}
    </div>
  )
}
