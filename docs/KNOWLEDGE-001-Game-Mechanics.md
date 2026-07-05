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

### Cerco de Inverno (Winter Siege) — evento novo, em observação
Anunciado no changelog in-game de 2026-07-05 (mensagem de sistema, servidor do jogador): evento de aliança onde alianças disputam fortalezas — jogadores despacham "esquadrões de guarnição" para defender e atacam fortalezas inimigas para conquistá-las. Cadência, duração e recompensas **ainda não documentadas** (evento recém-anunciado, sem guia de comunidade disponível ainda). Não adicionado a `KNOWN_EVENTS` nem ao Timeline Engine até termos dados de pelo menos uma ocorrência real ou um guia confiável — evitar herdar do calendário de outro evento por suposição.
Fonte: changelog in-game compartilhado pelo jogador (2026-07-05), sem fonte externa ainda.

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

## Pets

Desbloqueados na Fornalha 18 (Beast Cage). Raridade: Comum (N), Raro (R), Épico (SR) e Lendário (SSR) — F2P/iniciantes têm acesso a N/R/SR. Cada pet tem uma habilidade ativa (1x/dia), em duas categorias: Desenvolvimento/Crescimento (ex.: Hiena-das-cavernas +15% velocidade de construção 5min, Lobo Ártico restaura 60 stamina do Chefe, Boi Almiscarado coleta instantânea de 1 célula) e Combate (ex.: Tigre-dente-de-sabre +10% letalidade das tropas por 2h, Leão-das-cavernas +10% ataque de todas as tropas por 2h).

Evolução: a cada 10 níveis o pet bate um teto de crescimento; Marcas de Avanço destravam o teto seguinte (o 1º avanço, nível 10, libera a Habilidade Ativa — o marco mais importante). Refinamento usa Marcas Selvagens para ajustar status (ataque/defesa/economia). Prioridade F2P citada pelos guias: focar Hiena-das-cavernas e Boi Almiscarado primeiro, guardando Marcas de Avanço/Selvagens para quando desbloquear Leopardo-das-neves ou Leão-das-cavernas.

Nomes de pets em PT traduzidos do inglês nesta pesquisa (2026-07-05) — não confirmados contra o cliente do jogo.

Fonte: [u7buy.com — Pet Guide 2026](https://www.u7buy.com/blog/whiteout-survival-pet-guide-2026-ultimate-strategy-for-taming/), [Whiteout Survival Wiki — Pets](https://www.whiteoutsurvival.wiki/pets/), [BlueStacks — Pets Tier List](https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-pets-guide-en.html), [ldshop.gg — Pet Guide](https://www.ldshop.gg/blog/guide/whiteout-survival-pet-guide.html).

## Aliança

Cargos R1 (básico: chat, ver perfis, contribuir com tech, sair) → R2 (+ mensagem para toda aliança) → R3 (+ promover/rebaixar R1/R2) → R4 (+ promover/rebaixar até R3, expulsar, iniciar pesquisa de tecnologia, configurações da aliança) → R5/líder (controle total: sede, transferir liderança, dissolver/renomear, trocar tag).

Tecnologia da aliança: só R4/R5 iniciam a pesquisa, mas qualquer membro contribui com recursos (carvão/madeira/carne/ferro) para acelerá-la — até 25 contribuições seguidas, depois 1 nova a cada 10 minutos. Tecnologias "recomendadas" (ícone verde) dão até +20% de recompensa extra na contribuição. Tokens de aliança (ganhos contribuindo) trocam por itens na Loja de Aliança (teletransportes, aceleradores, fragmentos de herói, etc.).

Pedido de Ajuda: outros membros podem reduzir o tempo de fila de construção/pesquisa em andamento; o valor de redução por ajuda cresce conforme a tecnologia da aliança evolui.

Critério de escolha de aliança citado pelos guias: atividade real (chat, doações, eventos coordenados) importa mais que nível/poder nominal.

Fonte: [lootbar.com — Alliance Guide](https://www.lootbar.com/blog/en/whiteout-survival-alliances-guide-what-you-need-to-know.html), [ldshop.gg — Alliance Domination Guide](https://www.ldshop.gg/blog/guide/whiteout-survival-alliance-guide.html), [onechilledgamer.com — Alliance Guide](https://onechilledgamer.com/whiteout-survival-alliance-guide-becoming-a-dominant-force/), [ldcloud.net — Alliance Guide](https://www.ldcloud.net/blog/whiteout-survival-en-alliance-guide) (pesquisado em 2026-07-05).

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

Tiers vão de **I a XII** (não são só um número — cada tier tem nome próprio no jogo): cada tier melhora status de combate, pontos de evento e custo/tempo de treino. XI (Helios) e XII (Exalted) só existem via pesquisa na War Academy (XII exige também Fire Crystal FC10). Na prática, a maioria dos jogadores ativos treina/promove principalmente os tiers mais altos que já tem — promover um tier já treinado costuma ser muito mais barato em tempo do que treinar do zero no tier novo.

| Tier | Nome (Infantaria, referência) | Desbloqueio |
|---|---|---|
| I | Rookie | Acampamento nível 1 |
| II | Trained | Acampamento nível 4 |
| III | Senior | Acampamento nível 7 |
| IV | Veteran | Acampamento nível 11 |
| V | **Resistente** ✅ confirmado pelo jogador | Acampamento nível 13 |
| VI | **Heróica** ✅ confirmado pelo jogador | Acampamento nível 16 |
| VII | Brave | Acampamento nível 19 |
| VIII | Elite | Acampamento nível 22 |
| IX | Supreme | Acampamento nível 26 |
| X | Apex | Acampamento nível 30 |
| XI | Helios | Pesquisa na War Academy |
| XII | Exalted | War Academy + Fire Crystal FC10 |

Nomes V e VI confirmados em PT pelo próprio jogador (2026-07-03: "Infantaria Heróica nível VI", "Infantaria Resistente nível V"). Os demais nomes na tabela são o termo em inglês (fonte em inglês) — ainda **não confirmados** contra o cliente em PT do jogador; corrigir se divergirem do texto real na tela. Os nomes provavelmente variam entre Infantaria/Lanceiro/Atirador (cada tipo tem seu próprio conjunto de nomes de tier), o que não foi pesquisado ainda — o app trata o tier como texto livre com sugestão (datalist), então isso não bloqueia o uso, só a precisão do rótulo sugerido.

Proporções de composição citadas pelos guias (ajustáveis por objetivo, não uma regra fixa):
- Balanceada/geral: **50% Infantaria / 20% Lanceiro / 30% Atirador**
- Foco em dano (ataque): 40/20/40 ou 50/10/40
- Foco em sobrevivência (defesa): 60% Infantaria / 20% / 20%
- Armadilha do Urso (Bear Trap): fortemente concentrada em Atirador — até 80% se disponível, ou 60% como alternativa (10/10/80 ou 20/20/60)

MVP do StratIQ (2026-07-03, revisado na sexta rodada) coleta uma lista de linhas **tipo + tier + quantidade** (`troopEntries`), porque o jogo mostra as tropas por tier dentro de cada tipo (ex.: "Infantaria Heróica nível VI: 7.848"), nunca um total único agregado — a primeira versão pedia só um total por tipo, o que não batia com a tela real do jogo. O motor (`sumTroopsByType` em `strategyEngine.ts`) soma as linhas por tipo para calcular `derived.totalTroops`, `derived.troopCompositionPct` e `derived.troopsDelta`, que alimentam as Strategy Cards de composição/estagnação sem mudança de lógica.

Fonte: [One Chilled Gamer — Troop Guide](https://onechilledgamer.com/whiteout-survival-troop-guide/), [WoS Tools Wiki — Troops](https://wostools.net/wiki/troops), [BlueStacks — War Academy/T11 Guide](https://www.bluestacks.com/blog/game-guides/white-out-survival/wos-troops-upgrade-guide-en.html), [A Jack Of — Best Troop Formation & Ratio](https://www.ajackof.com/games/whiteout-survival-wos/whiteout-survival-best-troop-formation-ratio/), [topuplive.com — Troop Types, Ratios & Recommendations](https://www.topuplive.com/news/whiteout-survival-troops-guide.html).

## VIP — XP necessário por nível

12 níveis de VIP no total. O jogo não mostra "% do nível" diretamente — mostra o XP acumulado dentro do nível atual (reseta ao subir de nível). Tabela de XP necessário para ir do nível anterior para cada nível:

| Nível VIP | XP necessário (do nível anterior) |
|---|---|
| 1 | — (nível inicial) |
| 2 | 2.500 |
| 3 | 5.000 |
| 4 | 12.500 |
| 5 | 30.000 |
| 6 | 40.000 |
| 7 | 70.000 |
| 8 | 100.000 |
| 9 | 350.000 |
| 10 | 600.000 |
| 11 | 1.200.000 |
| 12 | 2.400.000 |

Soma total para chegar ao VIP 12 do zero: 4.810.000 XP (confere com fontes que citam esse total). Taxa fixa de conversão: 2 gemas = 1 XP de VIP (não muda com eventos ou nível).

O app (sexta rodada, 2026-07-03) pede só o XP dentro do nível atual (`vipXp`, o número que aparece na tela do jogo) e calcula `derived.vipProgressPct` sozinho usando esta tabela (`VIP_XP_REQUIRED_FOR_LEVEL` em `strategyEngine.ts`). Antes disso o campo era uma % que o jogador tinha que estimar visualmente — informação que o jogo não expõe de forma direta.

Fonte: [Whiteout Survival Data — VIP](https://whiteoutdata.com/guides/vip/) (tabela completa consultada em 2026-07-03).

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
