-- Vigésima rodada: terceiro domínio da expansão "visão completa da conta"
-- (ver docs/BACKLOG-v1.md, décima oitava rodada). Níveis de prédios da
-- cidade além da Fornalha (que já tem furnace_level próprio) — texto livre
-- + sugestão via KNOWN_BUILDINGS, sem Strategy Cards atreladas ainda.

alter table weekly_snapshots
  add column if not exists building_levels jsonb not null default '[]'::jsonb;
