-- Duas adições pontuais pedidas na décima quinta rodada de feedback (ver
-- docs/BACKLOG-v1.md):
--
-- 1. lucky_wheel_featured_hero: a Roda da Sorte tem um "tema" (herói em
--    destaque) que muda a cada rotação — o motor não tinha como saber qual
--    herói está em destaque, então a recomendação de maximizar a roda não
--    conseguia avisar quando o tema não é relevante para o objetivo do
--    jogador. Campo de texto livre, opcional, só preenchido quando "Roda da
--    Sorte" está marcada como evento ativo.
--
-- 2. troops_promoting: mesma lógica do "Nada disponível agora"
--    (0007_queue_maxed_override.sql) aplicada a tropas — promover tropas de
--    um tier para outro reduz a contagem bruta total (N tropas de tier
--    baixo viram menos tropas de tier alto), o que fazia a card
--    TROOP_GROWTH_STAGNATION disparar um falso positivo durante uma
--    promoção real. Flag declarada a cada check-in, não persiste (mesmo
--    raciocínio de não deixar "true" esquecido depois que a promoção
--    termina).

alter table public.weekly_snapshots
  add column if not exists lucky_wheel_featured_hero text;

alter table public.weekly_snapshots
  add column if not exists troops_promoting boolean not null default false;
