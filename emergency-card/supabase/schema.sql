-- ResQCard database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- One row per user account, holds identity + card status
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text not null,
  blood_group text,
  date_of_birth date,
  public_id text not null unique default encode(gen_random_bytes(6), 'hex'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Medical details shown on the emergency view
create table if not exists emergency_information (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  allergies text,
  medications text,
  conditions text,
  emergency_notes text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Every time the public emergency view is opened
create table if not exists access_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  accessed_at timestamptz not null default now(),
  access_type text not null default 'emergency_view'
);

-- Trusted people the owner can list against their card (roadmap feature, schema ready)
create table if not exists trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  phone text,
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles
  for each row execute procedure set_updated_at();

drop trigger if exists trg_emergency_info_updated_at on emergency_information;
create trigger trg_emergency_info_updated_at before update on emergency_information
  for each row execute procedure set_updated_at();

-- Row Level Security ---------------------------------------------------

alter table profiles enable row level security;
alter table emergency_information enable row level security;
alter table access_logs enable row level security;
alter table trusted_contacts enable row level security;

-- Owners manage their own profile row
create policy "profiles: owner select" on profiles
  for select using (auth.uid() = user_id);
create policy "profiles: owner insert" on profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles: owner update" on profiles
  for update using (auth.uid() = user_id);

-- Anyone (including anonymous scanners) can read the minimum fields of an
-- active profile via its public_id -- enforced at the query/API layer, which
-- only selects the emergency-safe columns. RLS still requires an explicit
-- read policy for anon access:
create policy "profiles: public read active card" on profiles
  for select using (is_active = true);

-- Owners manage their own emergency information
create policy "emergency_info: owner select" on emergency_information
  for select using (auth.uid() = user_id);
create policy "emergency_info: owner insert" on emergency_information
  for insert with check (auth.uid() = user_id);
create policy "emergency_info: owner update" on emergency_information
  for update using (auth.uid() = user_id);

-- Public (anon) read is required so the emergency page can render without
-- login. The API route only ever selects the emergency-safe columns.
create policy "emergency_info: public read" on emergency_information
  for select using (true);

-- Access logs: owner can read logs about their own card; anyone (including
-- anon scanners, via the server route) can insert a log entry.
create policy "access_logs: owner select" on access_logs
  for select using (
    exists (
      select 1 from profiles p
      where p.id = access_logs.profile_id and p.user_id = auth.uid()
    )
  );
create policy "access_logs: anyone insert" on access_logs
  for insert with check (true);

-- Trusted contacts: owner only
create policy "trusted_contacts: owner all" on trusted_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
