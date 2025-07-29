"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import BookmarkView from '@/components/BookmarkView'
import { User } from '@supabase/supabase-js'

export default function BookmarksPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user) setUser(data.user)
      else router.push('/auth')
    }
    getUser()
  }, [router])

  if (!user) return <div className="p-4">Loading...</div>

  return <BookmarkView currentUser={user} />
}
