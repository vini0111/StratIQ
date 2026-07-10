-- Décima oitava rodada: expansão de escopo para "visão completa da conta"
-- (pedido do usuário, ver docs/BACKLOG-v1.md). Primeiro domínio: Pets
-- (Beast Cage) — captura simples de nome + nível por pet, sem Strategy
-- Cards atreladas ainda (mesmo critério de "só cards quando houver regra
-- sourced e validada com uso real" usado nos domínios anteriores).

alter table weekly_snapshots
  add column if not exists pet_entries jsonb not null default '[]'::jsonb;
