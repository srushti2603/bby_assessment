'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Heart, MessageCircle, Share, Bookmark, BookmarkCheck } from 'lucide-react'
import Image from 'next/image'

export interface Post {
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

interface PostCardProps {
  post: Post
  currentUser: User
  onUpdate: () => void
}

export default function PostCard({ post, currentUser, onUpdate }: PostCardProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  
  // Defensive: likes may be undefined
  const isLiked = Array.isArray(post.likes) && post.likes.some(like => like.user_id === currentUser.id)
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0

  useEffect(() => {
    const fetchBookmark = async () => {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('post_id', post.id)
        .single()
      if (data) {
        setIsBookmarked(true)
        setBookmarkId(data.id)
      } else {
        setIsBookmarked(false)
        setBookmarkId(null)
      }
    }
    fetchBookmark()
  }, [currentUser.id, post.id])

  const handleLike = async () => {
    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', post.id)
      } else {
        await supabase
          .from('likes')
          .insert({
            user_id: currentUser.id,
            post_id: post.id
          })
      }
      onUpdate()
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    
    setIsSubmitting(true)
    try {
      await supabase
        .from('comments')
        .insert({
          user_id: currentUser.id,
          post_id: post.id,
          content: comment.trim()
        })
      
      setComment('')
      onUpdate()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBookmark = async () => {
    if (isBookmarked && bookmarkId) {
      // Unbookmark
      await supabase.from('bookmarks').delete().eq('id', bookmarkId)
      setIsBookmarked(false)
      setBookmarkId(null)
    } else {
      // Bookmark
      const { data } = await supabase.from('bookmarks').insert({
        user_id: currentUser.id,
        post_id: post.id
      }).select('id').single()
      if (data) {
        setIsBookmarked(true)
        setBookmarkId(data.id)
      }
    }
    onUpdate()
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center p-4 border-b">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
          {post.profiles && post.profiles.avatar_url ? (
            <Image
              src={post.profiles.avatar_url}
              alt={post.profiles.username}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="text-sm font-medium">
              {post.profiles && post.profiles.username ? post.profiles.username[0].toUpperCase() : '?'}
            </span>
          )}
        </div>
        <div>
          <p className="font-medium">{post.profiles && post.profiles.username ? post.profiles.username : 'Unknown'}</p>
          <p className="text-sm text-gray-500">{formatTimeAgo(post.created_at)}</p>
        </div>
      </div>

      <div className="aspect-square relative">
        <Image
          src={post.image_url}
          alt="Post"
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`p-1 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-1 text-gray-600">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-1 text-gray-600">
              <Share className="w-6 h-6" />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-1 ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
              aria-label={isBookmarked ? 'Unbookmark' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {likesCount > 0 && (
          <p className="font-medium text-sm mb-1">
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </p>
        )}

        {post.caption && (
          <p className="text-sm mb-2">
            <span className="font-medium mr-2">{post.profiles && post.profiles.username ? post.profiles.username : 'Unknown'}</span>
            {post.caption}
          </p>
        )}

        {Array.isArray(post.comments) && post.comments.length > 0 && (
          <div className="space-y-1 mb-2">
            {post.comments.map((comment) => (
              <p key={comment.id} className="text-sm">
                <span className="font-medium mr-2">{comment.profiles && comment.profiles.username ? comment.profiles.username : 'Unknown'}</span>
                {comment.content}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleComment} className="flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 text-sm outline-none"
            disabled={isSubmitting}
          />
          {comment.trim() && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-blue-500 text-sm font-medium ml-2"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  )
}