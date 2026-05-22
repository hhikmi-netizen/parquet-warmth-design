
create table if not exists public.guide_downloads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  opt_in boolean not null default true,
  source text default 'guide_reader',
  created_at timestamptz not null default now()
);

alter table public.guide_downloads enable row level security;

-- Anyone (anon + authenticated) can submit a lead. No reads from client.
create policy "Anyone can submit a download request"
  on public.guide_downloads
  for insert
  to anon, authenticated
  with check (true);

create index if not exists guide_downloads_email_idx on public.guide_downloads (email);
create index if not exists guide_downloads_created_idx on public.guide_downloads (created_at desc);
