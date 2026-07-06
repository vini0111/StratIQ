-- Corrige falso positivo das cards de "fila ociosa": o motor não conseguia
-- distinguir fila vazia por esquecimento de fila vazia porque não há mais
-- nada disponível para construir/pesquisar (ex.: esperando a Fornalha subir
-- de nível para desbloquear a próxima construção). Ver docs/BACKLOG-v1.md
-- (oitava rodada) e a conversa sobre reavaliar o valor do StratIQ frente ao
-- WoS Tools, que motivou essa correção.
--
-- Flags não persistem por padrão de um check-in para o outro (não temos
-- carga automática) — são declaradas a cada atualização, no momento em que
-- o campo de construção/pesquisa correspondente está vazio.

alter table public.weekly_snapshots
  add column if not exists construction_maxed boolean not null default false;

alter table public.weekly_snapshots
  add column if not exists construction_2_maxed boolean not null default false;

alter table public.weekly_snapshots
  add column if not exists research_maxed boolean not null default false;
