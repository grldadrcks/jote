-- Run this in your Supabase SQL editor

create table notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default '',
  content text default '',
  font text default 'default',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table notes enable row level security;

create policy "Users manage own notes"
  on notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
