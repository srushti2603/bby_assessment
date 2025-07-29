'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import Header from './Header'
import PostCard from './PostCard'
import PostCreationWrapper from './PostCreationWrapper'

interface Post {
  id: string
  user_id: string
  caption: string
  image_url: string
  created_at: string
  profiles: {
    username: string
    avatar_url: string
  }
  likes: { id: string; user_id: string }[]
  comments: { id: string; content: string; user_id: string; profiles: { username: string } }[]
}

interface FeedProps {
  user: User
}

export default function Feed({ user }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          likes (id, user_id),
          comments (id, content, user_id, profiles:user_id (username))
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
    setShowCreatePost(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreatePost={() => setShowCreatePost(true)} />
      
      <div className="max-w-lg mx-auto pt-20 pb-8">
        <PostCreationWrapper
          user={user}
          showCreatePost={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
        
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={user}
              onUpdate={fetchPosts}
            />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No posts yet. Create your first post!
          </div>
        )}
      </div>
    </div>
  )
}