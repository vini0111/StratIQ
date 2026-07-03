# KNOWLEDGE-001 — Notas de Mecânica do Jogo

**Document ID:** KNOWLEDGE-001
**Version:** 1.0
**Status:** 🟢 Living Knowledge — revisar periodicamente
**Owner:** Product / Systems Architecture
**Related:** MVP-001, BACKLOG-v1
**Data da pesquisa:** 2026-07-03

---

## Propósito

Conhecimento do jogo usado para calibrar as Strategy Cards (`app/src/data/strategyCards/`). Cada fato aqui tem fonte e é datado — meta e mecânica de eventos mudam com atualizações do jogo, então isto **não é estático**. Quando uma Strategy Card usa um número ou nome específico, ele deve rastrear até uma entrada aqui.

## Eventos

### Lucky Wheel
Roda a cada 2 semanas, dura 3 dias. Um giro custa 1.500 gemas avulso, ou 13.500 gemas por 10 giros (desconto). Recompensas de marco em 5, 15, 35, 70 e 120 giros. Maximizar (120 giros) custa **159.000 gemas** por instância. Jogadores F2P costumam parar em 4 estrelas do herói (não 5) — o retorno da 5ª estrela é menor, e economizar essas gemas para VIP ou outra prioridade costuma valer mais.
Fonte: [Whiteout Survival Handbook — Lucky Wheel Guide 2026](https://whiteoutsurvivalhandbook.com/guides/whiteoutsurvival-lucky-wheel-guide-2026), [One Chilled Gamer](https://onechilledgamer.com/whiteout-survival-lucky-wheel-guide-how-to-max-every-hero/)

### SvS (State vs State / State of Power)
Roda ~1x/mês. Ciclo completo de ~10 dias em 4 fases: Matchmaking (2 dias) → Preparação (5 dias, cada dia com tema: Construção, Pesquisa, Feras, Treino, Power Boost) → Batalha (12h) → Triagem/Revive (~50h). Regra chave: **não gastar aceleradores grandes fora da SvS** — guardar para os dias temáticos da fase de preparação.
Fonte: [WosTools — SvS Prep Phase Guide 2026](https://wostools.net/svs-prep-phase-guide), [Whiteout Survival Handbook — SvS Guide 2026](https://whiteoutsurvivalhandbook.com/guides/whiteoutsurvival-state-vs-state-guide-2026)

### Alliance Mobilization
Evento mensal de 6 dias (segunda a sábado). Regra nº1 dos guias: **não usar aceleradores grandes nem upgrades de equipamento aqui** — eles devem ser guardados para a SvS, que ocorre a cada 4 semanas.
Fonte: [BlueStacks — Recurring Events Guide](https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-recurring-events-guide-en.html)

### Bear Trap / Bear Hunt
Evento de aliança, ~30 minutos de dano ao urso. Composição balanceada de tropas **perde** dano nesse evento — ele recompensa DPS, não durabilidade. Marksmen (atiradores) dão o maior dano sustentado. Quem lidera o rally contribui com as Expedition Skills de até 3 heróis (9 skills se todos forem Mythic); quem só entra no rally contribui apenas com a 1ª skill do 1º herói da marcha.
Fonte: [A Jack Of — Bear Trap Guide](https://www.ajackof.com/games/whiteout-survival-wos/whiteout-survival-bear-trap-guide/)

### Canyon Clash
Evento mensal de aliança. Só as 20 alianças mais fortes (por poder) do servidor participam. A batalha em si dura 1h, mas a preparação leva a semana toda.
Fonte: [Whiteout Survival Wiki — Canyon Clash](https://www.whiteoutsurvival.wiki/events/canyon-clash/)

### Frostfire (Mine/Foundry)
Um dos poucos eventos **solo** do jogo. Roda a cada 2 semanas, dura ~30 minutos numa zona de combate dedicada.
Fonte: [BlueStacks — Recurring Events Guide](https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-recurring-events-guide-en.html)

## Pesquisa (Research Center)

Três árvores: Growth (crescimento), Economy (economia), Battle (batalha). Ordem geralmente mais eficiente: **Growth → Battle → Economy**, com a ressalva de que só vale focar Economy quando a tecnologia de batalha já está no nível competitivo do estado. Dentro de Growth, "Tool Enhancement" (reduz tempo de pesquisa) é considerado um dos dois nós mais importantes do jogo inteiro — o efeito composto ao longo do tempo é grande, então vale maximizar cedo. Dentro de Battle, Infantry (saúde/defesa) protege as unidades de dano (Marksmen/Lancers) na retaguarda. Dentro de Economy, velocidade de coleta é a prioridade, porque a maior parte dos recursos vem de marchas de coleta no mapa.
Fonte: [ldshop.gg — Research Center Guide](https://www.ldshop.gg/blog/whiteout-survival/research-center-guide.html), [Velox — Research Priority Path](https://www.veloxgame.com/news/whiteout-survival-research-priority-path.html)

## Heróis

Sistema de gerações: heróis de gerações mais novas costumam ser mais fortes, mas um herói top-tier permanece viável por 3-4 gerações antes de ficar obsoleto. Novas gerações saem a cada ~5-6 Lucky Wheels (~80 dias).

Caminho de prioridade F2P mais citado nos guias atuais: **Mia → Hector → Bradley → Gatot → Blanchette → Eleonora**, com Flint (Gen 2) como o primeiro "power spike" relevante, obtido via Lucky Wheel.

- **Flint** (Gen 2) — primeiro pico de poder F2P relevante, disponível via Lucky Wheel.
- **Blanchette** (Gen 10) — considerado o melhor herói de dano do jogo; marksman com stats altos; disponível via Lucky Wheel — provavelmente o melhor herói S+ acessível a F2P.
- **Eleonora** (Gen 11) — staple de late-game, kit de utilidade forte em rallies de PvP, Arena e Expedição; também via Lucky Wheel.

Para jogadores pagantes, os guias citam Vulcanus (Gen 13) e Estrella (Gen 15) como alvos.

Fonte: [gamsgo — Hero Tier List 2026](https://www.gamsgo.com/blog/whiteout-survival-hero-tier-list), [AllClash — Best Heroes Tier List 2026](https://www.allclash.com/best-heroes-in-whiteout-survival-tier-list/)

## Open question para o futuro

Vários guias amarram geração de herói recomendada à **idade do servidor** (dias desde a criação do estado) — não coletamos esse campo hoje. Fica registrado como candidato a novo campo do snapshot (ver BACKLOG-v1), não implementado agora para não expandir o formulário sem necessidade validada.
