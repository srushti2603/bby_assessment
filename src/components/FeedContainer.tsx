'use client'

import { User } from '@supabase/supabase-js'
import Feed from './Feed'

interface FeedContainerProps {
  user: User
}

export default function FeedContainer({ user }: FeedContainerProps) {
  return (
    <div className="feed-container">
      <Feed user={user} />
    </div>
  )
}