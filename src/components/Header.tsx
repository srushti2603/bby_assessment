"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Camera, Heart, User as UserIcon, Bookmark } from "lucide-react";

interface HeaderProps {
  onCreatePost: () => void;
}

export default function Header({ onCreatePost }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Instagram</h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCreatePost}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Camera className="w-6 h-6" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart className="w-6 h-6" />
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <UserIcon className="w-6 h-6" />
            </button>

            <button
              onClick={() => router.push("/bookmarks")}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Bookmarks"
            >
              <Bookmark className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
