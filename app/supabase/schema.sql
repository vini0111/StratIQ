-- Commander MVP — schema mínimo (ver docs/MVP-001-Escopo-e-Estrutura.md)
-- Rodar no SQL editor do Supabase de um projeto novo.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  state_number integer not null,
  alliance text,
  financial_profile text not null check (
    financial_profile in ('f2p', 'low_spender', 'medium_spender', 'high_spender', 'whale')
  ),
  objective text not null check (
    objective in (
      'growth', 'pvp', 'bear_trap', 'svs', 'arena', 'rally', 'alliance_leadership', 'balanced'
    )
  ),
  has_second_builder boolean not null default false,
  state_founded_date date,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create table if not exists public.weekly_snapshots (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  snapshot_date date not null default current_date,
  furnace_level integer not null default 1,
  vip_level integer not null default 0,
  vip_progress_pct integer not null default 0,
  gems integer not null default 0,
  accel_general_days numeric not null default 0,
  accel_training_days numeric not null default 0,
  accel_construction_days numeric not null default 0,
  accel_research_days numeric not null default 0,
  accel_healing_days numeric not null default 0,
  current_events jsonb not null default '[]'::jsonb,
  power bigint not null default 0,
  heroes jsonb not null default '[]'::jsonb,
  current_research text,
  current_building text,
  current_building_2 text,
  troops_infantry bigint not null default 0,
  troops_lancer bigint not null default 0,
  troops_marksman bigint not null default 0,
  highest_tier_training text,
  weekly_question text,
  created_at timestamptz not null default now()
);

alter table public.weekly_snapshots enable row level security;

create policy "snapshots_select_own" on public.weekly_snapshots
  for select using (auth.uid() = profile_id);

create policy "snapshots_insert_own" on public.weekly_snapshots
  for insert with check (auth.uid() = profile_id);

create policy "snapshots_update_own" on public.weekly_snapshots
  for update using (auth.uid() = profile_id);

create policy "snapshots_delete_own" on public.weekly_snapshots
  for delete using (auth.uid() = profile_id);

create index if not exists idx_weekly_snapshots_profile_date
  on public.weekly_snapshots (profile_id, snapshot_date desc);
