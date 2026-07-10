-- Vigésima primeira rodada: quarto e último domínio da expansão "visão
-- completa da conta" (ver docs/BACKLOG-v1.md, décima oitava rodada).
-- Ranking da aliança e participação em eventos — nullable, sem default:
-- ausência significa "não respondido neste check-in", não "falso". O nome
-- da aliança já existe em profiles.alliance (não muda a cada check-in).

alter table weekly_snapshots
  add column if not exists alliance_rank integer,
  add column if not exists alliance_participates_all_events boolean;
