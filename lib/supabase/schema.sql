-- ============================================================
-- JIBB Member Portal Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com)
-- ============================================================

-- 1. Create Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  company_name text,
  designation text,
  membership_tier text not null default 'associate' check (membership_tier in ('associate', 'silver', 'gold', 'platinum', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create Profile RLS Policies
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Admins can view all profiles" 
  on public.profiles for select 
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and membership_tier = 'admin'
    )
  );

-- 2. Create Premium Resources table
create table if not exists public.premium_resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  title_ja text not null, -- Japanese title support
  description text,
  description_ja text, -- Japanese description support
  resource_type text not null check (resource_type in ('pdf', 'brochure', 'report', 'newsletter', 'video', 'slides')),
  file_path text not null, -- Path inside the supabase storage bucket
  file_size text, -- e.g. "4.2 MB"
  min_required_tier text not null default 'associate' check (min_required_tier in ('associate', 'silver', 'gold', 'platinum', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Premium Resources
alter table public.premium_resources enable row level security;

-- Create Premium Resources RLS Policies
create policy "Users can view resources corresponding to their tier"
  on public.premium_resources for select
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
        and (
          -- Admin can see everything
          public.profiles.membership_tier = 'admin' or
          -- Platinum can see anything except admin-only
          (public.profiles.membership_tier = 'platinum' and public.premium_resources.min_required_tier in ('associate', 'silver', 'gold', 'platinum')) or
          -- Gold can see associate, silver, gold
          (public.profiles.membership_tier = 'gold' and public.premium_resources.min_required_tier in ('associate', 'silver', 'gold')) or
          -- Silver can see associate, silver
          (public.profiles.membership_tier = 'silver' and public.premium_resources.min_required_tier in ('associate', 'silver')) or
          -- Associate can only see associate
          (public.profiles.membership_tier = 'associate' and public.premium_resources.min_required_tier = 'associate')
        )
    )
  );

-- 3. Automatic Profile Creation Trigger
-- This function runs automatically whenever a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, company_name, designation, membership_tier)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'JIBB Member'),
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'designation',
    coalesce(new.raw_user_meta_data->>'membership_tier', 'associate')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution link
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Seed some sample Premium Resources for testing
insert into public.premium_resources (title, title_ja, description, description_ja, resource_type, file_path, file_size, min_required_tier)
values 
  (
    'India-Japan Semiconductor Corridor Study 2026', 
    '日印半導体コリドー調査レポート 2026', 
    'Deep dive into manufacturing hubs in Gujarat and talent mapping in Bengaluru.', 
    'グジャラート州の製造ハブとベンガルールの人材マッピングの詳細分析。', 
    'report', 
    'reports/semiconductor-corridor-2026.pdf', 
    '6.4 MB', 
    'gold'
  ),
  (
    'Bilateral Automotive Supply Chain Best Practices', 
    '二国間自動車サプライチェーン・ベストプラクティス', 
    'Operational patterns for Suzuki, Toyota, and Honda suppliers in India.', 
    'インドにおけるスズキ、トヨタ、ホンダサプライヤーの業務パターン。', 
    'pdf', 
    'pdfs/auto-supply-chain.pdf', 
    '3.2 MB', 
    'silver'
  ),
  (
    'JIBB Annual Ecosystem Report & Directory', 
    'JIBB 年次エコシステム報告書＆ディレクトリ', 
    'Full database of member capabilities and industrial collaboration models.', 
    '会員企業の能力と産業協力モデルの完全データベース。', 
    'report', 
    'reports/annual-ecosystem-2026.pdf', 
    '12.8 MB', 
    'platinum'
  ),
  (
    'Welcome Booklet & Collaboration Guidelines', 
    'ウェルカムブックレット＆連携ガイドライン', 
    'Onboarding guidelines, contact details, and program calendar.', 
    'オンボーディングガイドライン、連絡先、プログラムカレンダー。', 
    'brochure', 
    'brochures/welcome-booklet.pdf', 
    '1.8 MB', 
    'associate'
  );

-- 5. Create Contact Inquiries table
create table if not exists public.contact_inquiries (
  id uuid default gen_random_uuid() primary key,
  inquiry_type text not null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_inquiries enable row level security;
create policy "Allow server action insertions for contact inquiries" on public.contact_inquiries for insert with check (true);
create policy "Admins can view contact inquiries" on public.contact_inquiries for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- 6. Create Membership Applications table
create table if not exists public.membership_applications (
  id uuid default gen_random_uuid() primary key,
  membership_tier text not null check (membership_tier in ('associate', 'silver', 'gold', 'platinum')),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  industry text,
  company_size text,
  message text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.membership_applications enable row level security;
create policy "Allow server action insertions for membership applications" on public.membership_applications for insert with check (true);
create policy "Admins can view membership applications" on public.membership_applications for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- 7. Create Business Matches table (normalized)
create table if not exists public.business_matches (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references auth.users on delete cascade,
  title text not null,
  details text not null,
  target_sector text not null,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.business_matches enable row level security;
create policy "Users can view their own matchmaking requests" on public.business_matches for select using (auth.uid() = member_id);
create policy "Users can insert their own matchmaking requests" on public.business_matches for insert with check (auth.uid() = member_id);
create policy "Admins can view all matchmaking requests" on public.business_matches for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- 8. Create Event Registrations table
create table if not exists public.event_registrations (
  id uuid default gen_random_uuid() primary key,
  event_id text not null,
  name text not null,
  company text not null,
  designation text not null,
  email text not null,
  phone text not null,
  attendee_type text not null default 'general' check (attendee_type in ('general', 'vip', 'speaker', 'sponsor')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.event_registrations enable row level security;
create policy "Allow server action insertions for event registrations" on public.event_registrations for insert with check (true);
create policy "Admins can view event registrations" on public.event_registrations for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- 9. Create Career Applications table
create table if not exists public.career_applications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  position text not null,
  resume_url text not null,
  cover_letter text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.career_applications enable row level security;
create policy "Allow server action insertions for career applications" on public.career_applications for insert with check (true);
create policy "Admins can view career applications" on public.career_applications for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- 10. Create Newsletter Subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  full_name text, -- Subscriber name support
  email text unique not null,
  source text not null default 'footer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.newsletter_subscribers enable row level security;
create policy "Allow server action insertions/subscriptions" on public.newsletter_subscribers for insert with check (true);
create policy "Admins can view newsletter subscribers" on public.newsletter_subscribers for select using (
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and membership_tier = 'admin'
  )
);

-- ============================================================
-- 11. Grant Table Permissions for Server Actions
-- ============================================================
grant insert on table public.contact_inquiries to anon, authenticated;
grant insert on table public.membership_applications to anon, authenticated;
grant insert on table public.business_matches to authenticated;
grant insert on table public.event_registrations to anon, authenticated;
grant insert on table public.career_applications to anon, authenticated;
grant insert on table public.newsletter_subscribers to anon, authenticated;

-- ============================================================
-- 12. Storage Bucket Policies (For Careers Resume Uploads)
-- ============================================================
-- Note: Make sure to create a private bucket named 'resumes' in the Supabase Dashboard first.
-- The following policies allow the Next.js Server Action (running with anon key) to upload
-- resumes and generate temporary signed URLs for HR review.

-- Enable RLS on storage.objects (if not already enabled by default)
-- alter table storage.objects enable row level security;

-- Policy to allow anyone (anon and authenticated) to upload resumes
create policy "Allow public uploads to resumes bucket"
  on storage.objects for insert
  with check (bucket_id = 'resumes');

-- Policy to allow reading resumes (needed to generate signed URLs via anon key)
create policy "Allow public select for resumes bucket"
  on storage.objects for select
  using (bucket_id = 'resumes');



