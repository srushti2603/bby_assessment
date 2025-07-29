-- Bookmark table migration for Supabase

create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique (user_id, post_id)
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Allow authenticated users to insert bookmarks for themselves
create policy "Allow authenticated users to bookmark posts" on bookmarks
for insert to authenticated
using (auth.uid() = user_id);

-- Allow users to delete their own bookmarks
create policy "Allow users to remove their own bookmarks" on bookmarks
for delete to authenticated
using (auth.uid() = user_id);

-- Allow users to view their own bookmarks
create policy "Allow users to view their own bookmarks" on bookmarks
for select to authenticated
using (auth.uid() = user_id);
