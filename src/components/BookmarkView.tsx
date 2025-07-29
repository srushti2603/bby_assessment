import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface BookmarkViewProps {
  currentUser: User;
}

export default function BookmarkView({ currentUser }: BookmarkViewProps) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
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
            .map((b: { posts: any | any[] | null }) =>
              Array.isArray(b.posts) ? b.posts[0] : b.posts
            )
            .filter((p): p is any => !!p)
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
    <div className="grid grid-cols-3 gap-2 p-4">
      {bookmarkedPosts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`} className="block group">
          <div className="aspect-square w-full h-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-80 transition">
            <img
              src={post.image_url}
              alt={post.caption || "Bookmarked post"}
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
