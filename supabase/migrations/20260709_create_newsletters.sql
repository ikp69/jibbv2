-- Create Newsletters table
create table if not exists public.newsletters (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text,
  content text,
  file_url text, -- optional link to PDF version
  visible_tiers text[] not null default '{associate}', -- e.g. ['associate', 'gold']
  status text not null default 'draft' check (status in ('draft', 'published')),
  publish_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.newsletters enable row level security;

-- Drop policy if exists
drop policy if exists "Members can view newsletters visible to their tier" on public.newsletters;
drop policy if exists "Admins can modify newsletters" on public.newsletters;

-- Member select policy
create policy "Members can view newsletters visible to their tier"
  on public.newsletters for select
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
        and (
          public.profiles.membership_tier = 'admin' or
          public.newsletters.visible_tiers @> array[public.profiles.membership_tier]
        )
    )
  );

-- Admin modification policy
create policy "Admins can modify newsletters"
  on public.newsletters for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid() and membership_tier = 'admin'
    )
  );

grant select, insert, update, delete on table public.newsletters to authenticated;
grant select on table public.newsletters to anon;
