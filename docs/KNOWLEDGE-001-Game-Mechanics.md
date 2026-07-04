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

## Fornalha (Furnace)

30 níveis. Cada nível libera prédios/mecânicas em marcos específicos (não a cada nível):

| Fornalha | Desbloqueia |
|---|---|
| 4 | Hero Hall, Clínica, Cabana do Explorador |
| 6 | Chief's House |
| 7 | Infantry Camp, Barricada |
| 8 | Embaixada, Arena, Marksman Camp, Enfermaria |
| 9 | Depósito, Centro de Pesquisa, Lancer Camp |
| 10 | Centro de Comando |
| 11 | Enlistment Office |
| 13 | Drill Camp |
| 15 | Hero Gear |
| **18** | **Beast Cage (Pets)** |
| 20 | Mastery Forging |
| 22 | Chief Gear |
| 25 | Chief Gear Charms |
| 30 | Fire Crystal Upgrades (FC1+) |

Cada nível também eleva o **nível máximo permitido para heróis** (cap): Fornalha 17 → nível 43, Fornalha 18 → 46, Fornalha 19 → 49, Fornalha 20 → 54, Fornalha 22 → 64, Fornalha 26 → 80 (máximo do jogo). Nivelar um herói além do cap da fornalha atual não tem efeito — resolve o item 4 do BACKLOG-v1 ("nível do herói vs. cap do acampamento").

Fonte: [Whiteout Survival Data — Furnace](https://whiteoutdata.com/buildings/furnace/) (tabela completa de requisitos e desbloqueios por nível, incluindo cap de herói).

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

### Roster do Estado 4465 (2026-07-03)

Heróis confirmados disponíveis para o jogador (Furnace 17). Confiança **alta** = múltiplas fontes convergentes; **média** = uma fonte razoável; **baixa/não confirmado** = nome ambíguo ou sem fonte clara — tratar como hipótese, não fato.

| Herói | Classe | Raridade | Papel | Confiança |
|---|---|---|---|---|
| Molly | Lancer | SSR | Combate | Alta |
| Sergey | Infantry | SR | Combate | Alta |
| Natalia | Infantry | SSR | Combate | Alta |
| Jerónimo | Infantry | SSR | Combate | Média |
| Jessie | Lancer | Epic/SR | Combate | Alta |
| Bahiti | Marksman | — | Combate (grátis na Fornalha 4) | Alta |
| Gina | Marksman | — | Combate | Média |
| Cloris | Marksman | Rare | Combate | Média |
| Jasser | Marksman | — | Combate | Média |
| Seo-yoon | Marksman | SR | Combate | Média |
| Patrick | Infantry | provável Epic/SSR (A-tier) | Combate | Média |
| Ling Xue | — | Epic | Combate (dano em área) | Baixa |
| **Zinman** | Marksman | — | **Utilidade/Economia** (SSS tier — reduz tempo de construção/pesquisa, não é herói de dano) | Média |
| Charlie | — | Rare | Provavelmente Economia/Coleta | Baixa |
| Eugenio | — | Rare (hipótese: variante PT-BR de "Eugene") | Provavelmente Economia/Coleta | Baixa, não confirmado |
| Smith | — | Rare | Baixo tier — papel não confirmado | Baixa |
| Lumak Bokan | — | — | Não confirmado (possível variante de "Walis Bokan", Lancer/Epic, mas nomes não batem com certeza) | Não confirmado |

Destaque: **Zinman** aparece consistentemente como tier SSS/top, mas por uma habilidade de utilidade (redução de tempo de construção/pesquisa), não por dano — vale tratá-lo separado dos heróis de combate ao priorizar investimento.

Fonte: busca dirigida por nome em julho/2026 (BlueStacks, Theria Games, Whiteout Survival Wiki, Medium/Medieval Fun, One Chilled Gamer, gamestouse.com — ver linhas de conversa para URLs específicas por herói). Não é uma fonte única consolidada — tratar como ponto de partida, não verdade definitiva. Charlie, Eugenio, Smith e Lumak Bokan merecem confirmação in-game antes de qualquer decisão baseada neles.

## Tropas (Battle Domain)

Três tipos, ciclo de contra-ataque tipo pedra-papel-tesoura: **Infantaria vence Lanceiro → Lanceiro vence Atirador → Atirador vence Infantaria** (cada vantagem = ~10-20% de bônus de ataque/redução de dano, dependendo da fonte). Atirador é a principal fonte de dano do jogo, mas depende de Infantaria/Lanceiro para absorver dano na frente.

Tiers vão de **T1 a T12**: cada tier melhora status de combate, pontos de evento e custo/tempo de treino. T11 exige a construção War Academy; T12 ("Exalted") exige War Academy + Fire Crystal FC10 e pesquisas Exalted. Na prática, a maioria dos jogadores ativos treina/promove principalmente T10/T11 — promover um tier já treinado costuma ser muito mais barato em tempo do que treinar do zero no tier novo.

Proporções de composição citadas pelos guias (ajustáveis por objetivo, não uma regra fixa):
- Balanceada/geral: **50% Infantaria / 20% Lanceiro / 30% Atirador**
- Foco em dano (ataque): 40/20/40 ou 50/10/40
- Foco em sobrevivência (defesa): 60% Infantaria / 20% / 20%
- Armadilha do Urso (Bear Trap): fortemente concentrada em Atirador — até 80% se disponível, ou 60% como alternativa (10/10/80 ou 20/20/60)

MVP do StratIQ (2026-07-03) coleta só o total por tipo (Infantaria/Lanceiro/Atirador) + tier mais alto em treino no momento — sem granularidade por tier individual (custo de preenchimento semanal vs. valor da recomendação; ver BACKLOG-v1 item C). `derived.troopCompositionPct` e `derived.totalTroops`/`derived.troopsDelta` no motor usam esses totais para comparar contra as proporções de referência acima.

Fonte: [One Chilled Gamer — Troop Guide](https://onechilledgamer.com/whiteout-survival-troop-guide/), [WoS Tools Wiki — Troops](https://wostools.net/wiki/troops), [BlueStacks — War Academy/T11 Guide](https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-troops-upgrade-guide-en.html), [A Jack Of — Best Troop Formation & Ratio](https://www.ajackof.com/games/whiteout-survival-wos/whiteout-survival-best-troop-formation-ratio/), [topuplive.com — Troop Types, Ratios & Recommendations](https://www.topuplive.com/news/whiteout-survival-troops-guide.html).

## Cadência de eventos (usada pelo Timeline Engine)

Valores usados por `src/lib/eventTimeline.ts` (`EVENT_CADENCES`) para estimar a próxima ocorrência de um evento a partir da última vez que o próprio histórico de check-ins do jogador o registrou como ativo:

| Evento | Cadência |
|---|---|
| Roda da Sorte | 14 dias |
| Mobilização da Aliança | 28 dias |
| SvS | 30 dias |

Fonte: mesma desta página (seções Lucky Wheel, Alliance Mobilization, SvS acima). Ver BACKLOG-v1, item B.

## Geração de herói por idade do estado

Vários guias amarram geração de herói recomendada à **idade do servidor** (dias desde a criação do estado). Implementado em 2026-07-03 via campo opcional `stateFoundedDate` no perfil + `HERO_GENERATION_MILESTONES` em `src/lib/strategyEngine.ts`:

| Idade do estado (dias) | Geração |
|---|---|
| 1+ | 1 |
| 40+ | 2 |
| 120+ | 3 |
| 200+ | 4 |
| 280+ | 5 |
| 360+ | 6 |
| 440+ | 7 |
| 520+ | 8 |

Faixas aproximadas coletadas de guias da comunidade durante a pesquisa de heróis (ver seção Heróis acima) — **não confirmadas oficialmente**. Tratar como estimativa, não data garantida. Ver BACKLOG-v1, item D.
