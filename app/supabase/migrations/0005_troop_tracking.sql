-- Battle Domain (avaliação de tropas) — ver docs/BACKLOG-v1.md item C.
-- MVP deliberadamente enxuto: total de tropas por tipo + tier mais alto em
-- treino, sem granularidade por tier individual (custo de preenchimento
-- semanal vs. valor da recomendação).

alter table public.weekly_snapshots
  add column if not exists troops_infantry bigint not null default 0;

alter table public.weekly_snapshots
  add column if not exists troops_lancer bigint not null default 0;

alter table public.weekly_snapshots
  add column if not exists troops_marksman bigint not null default 0;

alter table public.weekly_snapshots
  add column if not exists highest_tier_training text;
