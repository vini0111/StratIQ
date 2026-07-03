-- Migração para bancos já criados a partir do schema.sql original.
-- Rode isto no SQL Editor do seu projeto Supabase (não precisa recriar nada).
--
-- Motivo: furnace_progress_pct não tinha nenhum consumidor real (nenhuma
-- Strategy Card ou cálculo de semáforo usava esse campo) e não corresponde a
-- como o jogo mostra a informação — a fornalha em upgrade aparece como um
-- timer, não uma porcentagem. Isso já fica coberto pelo campo
-- current_building (ex: "Fornalha 18"). Ver conversa de 2026-07-03.

alter table public.weekly_snapshots drop column if exists furnace_progress_pct;
