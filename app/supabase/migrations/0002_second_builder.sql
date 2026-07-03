-- Migração para bancos já criados. Rode no SQL Editor do seu projeto Supabase.
-- Adiciona suporte a um segundo construtor (desbloqueado em VIP mais alto),
-- pedido registrado em docs/BACKLOG-v1.md item 1.

alter table public.profiles
  add column if not exists has_second_builder boolean not null default false;

alter table public.weekly_snapshots
  add column if not exists current_building_2 text;
