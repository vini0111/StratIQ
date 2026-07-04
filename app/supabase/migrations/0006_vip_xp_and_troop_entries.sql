-- Sexta rodada de feedback (2026-07-03):
-- 1) VIP: o jogo não mostra "% do nível" diretamente. Trocamos por um campo
--    de XP de VIP dentro do nível atual (o que a tela do jogo mostra) e o
--    app calcula a % sozinho usando a tabela de XP necessário por nível.
-- 2) Tropas: o jogo não mostra "total por tipo" diretamente — mostra por
--    tier dentro de cada tipo (ex.: "Infantaria Heróica nível VI: 7.848").
--    Trocamos os 3 campos únicos por uma lista (troop_entries) de
--    {tipo, tier, quantidade}, somada pelo motor para compor o total.

alter table public.weekly_snapshots
  add column if not exists vip_xp bigint not null default 0;

alter table public.weekly_snapshots
  drop column if exists vip_progress_pct;

alter table public.weekly_snapshots
  add column if not exists troop_entries jsonb not null default '[]'::jsonb;

alter table public.weekly_snapshots
  drop column if exists troops_infantry;

alter table public.weekly_snapshots
  drop column if exists troops_lancer;

alter table public.weekly_snapshots
  drop column if exists troops_marksman;
