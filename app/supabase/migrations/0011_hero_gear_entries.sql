-- Décima nona rodada: segundo domínio da expansão "visão completa da conta"
-- (ver docs/BACKLOG-v1.md, décima oitava rodada). Equipamento de herói
-- (Hero Gear, Fornalha 15) — captura por herói+slot+raridade+nível, sem
-- Strategy Cards atreladas ainda.

alter table weekly_snapshots
  add column if not exists hero_gear_entries jsonb not null default '[]'::jsonb;
