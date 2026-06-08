-- Run in Supabase SQL editor + create public bucket "homepage" (or use Storage UI)

create table if not exists public.homepage_slides (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  slide_type text not null check (slide_type in ('campaign', 'announcement')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  title text,
  subtitle text,
  link_url text,
  alt_text text,
  created_at timestamptz not null default now()
);

alter table public.homepage_slides enable row level security;

create policy "Public read homepage slides"
  on public.homepage_slides for select
  to anon, authenticated
  using (is_active = true);

-- Storage bucket: homepage (public read)
-- Upload WebP/JPEG campaign + announcement images via Supabase Storage
