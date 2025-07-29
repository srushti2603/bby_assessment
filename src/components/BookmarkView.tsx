import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import PostCard, { Post } from "./PostCard";

interface BookmarkViewProps {
  currentUser: User;
}

export default function BookmarkView({ currentUser }: BookmarkViewProps) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookmarks")
        .select("post_id, posts(*, profiles:profiles(*))")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });
      if (data) {
        setBookmarkedPosts(
          data
            .map((b: { posts: Post | Post[] | null }) =>
              Array.isArray(b.posts) ? b.posts[0] : b.posts
            )
            .filter((p): p is Post => !!p)
        );
      }
      setLoading(false);
    };
    fetchBookmarks();
  }, [currentUser.id]);

  if (loading) return <div className="p-4">Loading bookmarks...</div>;
  if (!bookmarkedPosts.length)
    return <div className="p-4">No bookmarks yet.</div>;

  return (
    <div className="space-y-4 p-4">
      {bookmarkedPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={currentUser}
          onUpdate={() => {}}
        />
      ))}
    </div>
  );
}
