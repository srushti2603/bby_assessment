"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
// import PostCard from "@/components/PostCard";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";
import type { Post } from "@/components/PostCard";
import PostCard from "@/components/PostCard";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  // const [post, setPost] = useState<any>(null);
  const [post, setPost] = useState<Post | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("*, profiles:profiles(*)")
        .eq("id", id)
        .single();
      setPost(data);
      setLoading(false);
    };
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setCurrentUser(data.user);
    };
    fetchUser();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!post || !currentUser)
    return <div className="p-8 text-center">Post not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-black hover:text-blue-600 font-medium mb-2 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
      </div>
      <PostCard post={post} currentUser={currentUser} onUpdate={() => {}} />
    </div>
  );
}
