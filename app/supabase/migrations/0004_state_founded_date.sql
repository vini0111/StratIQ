-- Migração para bancos já criados. Rode no SQL Editor do seu projeto Supabase.
-- Campo opcional para calcular idade do estado e prever a chegada da
-- próxima geração de heróis (ver docs/BACKLOG-v1.md, item D da 4ª rodada).

alter table public.profiles
  add column if not exists state_founded_date date;
