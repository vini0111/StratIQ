-- Análise por IA sob demanda no campo "dúvida do dia" (ver docs/BACKLOG-v1.md,
-- nona rodada). Guarda pergunta + resposta por check-in — a IA só explica o
-- que o Strategy Engine já decidiu (cards que dispararam), nunca decide por
-- conta própria. Gerada via Edge Function `analyze-checkin`, não direto do
-- cliente (a chave da API da Anthropic nunca deve chegar ao navegador).

create table if not exists public.ai_analyses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  snapshot_id uuid not null references public.weekly_snapshots(id) on delete cascade,
  question text not null,
  answer text not null,
  model text not null,
  created_at timestamptz not null default now()
);

alter table public.ai_analyses enable row level security;

create policy "ai_analyses_select_own" on public.ai_analyses
  for select using (auth.uid() = profile_id);

create policy "ai_analyses_insert_own" on public.ai_analyses
  for insert with check (auth.uid() = profile_id);

create policy "ai_analyses_delete_own" on public.ai_analyses
  for delete using (auth.uid() = profile_id);

create index if not exists idx_ai_analyses_snapshot
  on public.ai_analyses (snapshot_id, created_at desc);
