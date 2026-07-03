-- Migração para bancos já criados. Rode no SQL Editor do seu projeto Supabase.
-- 1) current_event (texto único) -> current_events (array jsonb), porque o
--    jogo frequentemente tem mais de um evento simultâneo.
-- 2) Aceleradores passam de 3 para 5 categorias, na mesma ordem exibida no
--    jogo: Geral, Treino, Construção, Pesquisa, Cura.

alter table public.weekly_snapshots
  add column if not exists current_events jsonb not null default '[]'::jsonb;

-- Migra dados existentes de current_event (texto) para current_events (array)
update public.weekly_snapshots
set current_events = case
  when current_event is not null and current_event <> ''
    then jsonb_build_array(current_event)
  else '[]'::jsonb
end
where current_events = '[]'::jsonb;

alter table public.weekly_snapshots drop column if exists current_event;

alter table public.weekly_snapshots
  add column if not exists accel_general_days numeric not null default 0;

alter table public.weekly_snapshots
  add column if not exists accel_healing_days numeric not null default 0;
