-- Run this in your Supabase project's SQL Editor (Database > SQL Editor)

-- Profiles: one row per user, pregnancy info
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  due_date date,
  esp32_ip text,
  emergency_contact text,
  family_mode_enabled boolean default false,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;
create policy "Users can manage their own profile"
  on profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Kick sessions: each row is one logged kick event
create table kicks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  logged_at timestamp with time zone default now()
);

alter table kicks enable row level security;
create policy "Users can manage their own kicks"
  on kicks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Mood entries
create table moods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  mood text not null, -- 'happy' | 'calm' | 'anxious' | 'stressed'
  logged_at timestamp with time zone default now()
);

alter table moods enable row level security;
create policy "Users can manage their own moods"
  on moods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Daily safety check-ins
create table checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  headache boolean default false,
  bleeding boolean default false,
  swelling boolean default false,
  vision_changes boolean default false,
  reduced_movement boolean default false,
  logged_at timestamp with time zone default now()
);

alter table checkins enable row level security;
create policy "Users can manage their own checkins"
  on checkins for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- After creating these, enable Email/Password auth under
-- Authentication > Providers in your Supabase dashboard.
