# BACKLOG-v1 — Feedback do primeiro uso real

**Document ID:** BACKLOG-v1
**Version:** 1.0
**Status:** 🟡 Registrado, não implementado
**Owner:** Product / Systems Architecture
**Related:** ADR-000, MVP-001
**Last Updated:** 2026-07-03

---

## Contexto

Itens levantados no primeiro uso real da v0 (2026-07-03). Todos são pedidos legítimos e mostram que a v0 já está gerando o tipo de fricção que ela deveria gerar — mas implementá-los agora, em cima de uma v0 que ainda não completou nem uma semana de validação, repetiria exatamente o padrão de inflação de escopo que o ADR-000 identificou como o maior risco do projeto original. Por isso ficam registrados aqui, não na v0.

Critério para tirar um item daqui: a v0 já foi usada por 3-4 semanas seguidas (critério de sucesso do MVP-001) e o item continua parecendo necessário — não hipotético.

## Itens

### 1. Segundo construtor — ✅ Implementado em 2026-07-03
Flag `hasSecondBuilder` no perfil (checkbox único no setup), campo opcional `currentBuilding2` no snapshot, migração `0002_second_builder.sql`, e nova card `IDLE_CONSTRUCTION_QUEUE_2` (só dispara se o perfil tiver a flag ligada). Motivo da mudança de prioridade: uso real (6-7 check-ins) confirmou que a v0 estava gerando falso negativo na regra de fila ociosa para quem já tem o 2º construtor — deixou de ser hipotético.

### 2. Visão completa do laboratório (pesquisas já concluídas) — parcialmente endereçado
A árvore de pesquisa completa continua fora de escopo (seria a Knowledge Base do domínio Research, esforço alto). Como mitigação parcial e barata, os campos "Construção atual" e "Pesquisa atual" agora sugerem uma lista curada de construções/pesquisas comuns via `<datalist>` (não trava o preenchimento, só ajuda a padronizar nomes) — ver `src/data/knownOptions.ts`. Visão completa da árvore continua registrada como item de esforço alto, não implementada.

### 3. Aceleradores em dias/horas/minutos — ✅ Implementado em 2026-07-03
Componente `AcceleratorInput` — três subcampos (dias/horas/minutos) convertidos para decimal internamente. Nenhuma mudança de schema.

### 4. Nível do herói vs. cap do acampamento — ✅ Implementado em 2026-07-03
Achamos uma fonte com a tabela completa de nível máximo de herói por nível de Fornalha (ex.: Fornalha 17 → 43, Fornalha 18 → 46). Adicionado `derived.maxHeroLevel` ao motor (calculado a partir da Fornalha), novo operador `anyHeroAtOrAboveLevel`, e card `HERO_AT_LEVEL_CAP` que avisa quando um herói favorito já está no limite. Fonte em KNOWLEDGE-001 (seção Fornalha).

### 5. Equipamentos, habilidades e frações de estrela (estágios de ascensão) — reavaliado em 2026-07-06, ver décima rodada
Hoje heróis têm só nome/nível/estrelas (inteiro). O pedido original era modelar equipamento, habilidades e o fato de que cada estrela tem estágios de ascensão internos (fragmentos), no mesmo nível de detalhe de calculadoras como a da WoS Tools.
**Decisão (décima rodada):** não replicar a escada completa de ascensão (isso é calculadora de custo de fragmento, terreno já descartado desde a oitava rodada). Em vez disso, adicionado um par de campos opcionais e leves (`shardsOwned`/`shardsRequiredForNextStar`) só para sinalizar prioridade entre heróis — ver detalhes abaixo. Equipamento/habilidades continuam fora de escopo, sem mudança.
**Esforço estimado (equipamento/habilidades, ainda pendente):** alto (Knowledge Base do domínio Hero + mudança de `HeroEntry`).

## Como isso deveria evoluir

Itens 2, 4 e 5 apontam todos para a mesma coisa: em algum momento a v0 vai precisar de uma Knowledge Base real (heróis, pesquisas, construções como dados estruturados, não como texto livre) — exatamente o que o VISION.md original previa como v1+. Isso é sinal de que a validação está funcionando, não de que a v0 está incompleta.

Item 3 pode ser resolvido isoladamente, a qualquer momento, sem esperar o resto.

Item 1 fica no meio: é modelo de dados pequeno, mas só vale a pena decidir a forma certa depois de confirmar que está realmente bloqueando o uso semanal.

## Adendo 2026-07-03 — segunda rodada de feedback

Depois de 6-7 check-ins reais, três pedidos adicionais:

- **Evolução sem contexto (gráfico/histórico):** implementado — sparkline agora mostra valor atual, delta e datas; nova tabela de histórico por dia.
- **Padronizar "Evento atual":** implementado como dropdown fechado (8 eventos de KNOWLEDGE-001 + "Outro"), porque as Strategy Cards dependem de nomes consistentes nesse campo.
- **Heróis: acampamento/equipamentos são suficientes?** Resposta: nome/nível/estrela basta para comparar favoritos entre si (já implementado), mas não para saber se vale a pena continuar investindo num herói específico — isso precisa de cap por fornalha/acampamento e dados de equipamento, que continuam nos itens 4 e 5 desta lista, sem mudança de status (esforço alto, sem fonte confiável simples identificada ainda).

## Adendo 2026-07-03 — terceira rodada de feedback

- **Sobreposição visual logo/estado** — ✅ corrigido (hack de margin negativa no Dashboard).
- **Evolução/Decision Center "não atualizavam"** — ✅ causa raiz corrigida: consultas ordenavam por `snapshot_date` (granularidade de dia); com múltiplos check-ins no mesmo dia, a ordem entre eles não era garantida. Trocado para `created_at`, que reflete corretamente a ordem real de inserção.
- **Textos explicativos redundantes no formulário** — ✅ removidos.
- **Unidade de aceleradores repetida 5x** — ✅ unificada: 1 seletor de unidade compartilhado (Geral/Treino/Construção/Pesquisa/Cura usam a mesma unidade).
- **Eventos/pesquisas em português** — ✅ `knownOptions.ts` traduzido, alinhado ao uso real do jogador (ex.: "Mobilização da Aliança", "Rally do Herói", "Batalha da Forja"). Alguns nomes (Frostfire, Confronto do Cânion) são traduções não confirmadas contra o cliente do jogo — corrigir se o nome oficial for diferente.
- **Heróis como lista de sugestão** — ✅ `datalist` com o caminho de heróis F2P do KNOWLEDGE-001 (Mia, Hector, Bradley, Gatot, Blanchette, Eleonora, Flint) + referências para pagantes (Vulcanus, Estrella). Continua aceitando texto livre — não é o roster completo do jogo.

### Novo item — Seletor de idioma (PT/EN/ES)

Pedido explícito: preparar (não construir agora) a possibilidade do jogador escolher idioma.
**Por que não agora:** i18n completo (strings da UI + conteúdo de conhecimento traduzido em 3 idiomas) é expansão de escopo real — cada Strategy Card, label e opção de formulário precisaria de 3 versões, e as condições das cards (`contains`/`eq` em `currentEvents`) precisariam parar de depender do texto literal do idioma. É trabalho de arquitetura (separar chave interna de rótulo exibido), não só tradução.
**Esforço estimado:** médio-alto (requer desacoplar valores internos usados pelo motor de regras dos rótulos exibidos ao usuário, hoje a mesma string faz os dois papéis).
**Critério para revisitar:** útil desde já se o app ganhar qualquer usuário que jogue em EN ou ES — hoje seria só para o fundador, que joga em PT.

## Adendo 2026-07-03 — quarta rodada (pedido de expansão maior)

Depois da Fornalha subir de nível, quatro pedidos maiores. Avaliados individualmente:

### A. Progressão de Fornalha (próximas melhorias) — ✅ Implementado
Ver item 4 (reaproveitou a mesma fonte) + 5 novas cards de marco de Fornalha (18: Pets, 20: Mastery Forging, 22: Chief Gear, 25: Chief Gear Charms, 30: Fire Crystal). Isso resolveu o pedido concreto que motivou a pergunta.

### B. Previsão de calendário de eventos (Timeline Engine) — ✅ Implementado em 2026-07-03
Implementado `src/lib/eventTimeline.ts`: cadência conhecida por evento (Roda da Sorte 14d, Mobilização da Aliança 28d, SvS 30d) ancorada na última vez que o próprio histórico de check-ins (`currentEvents`) registrou aquele evento como ativo. `buildContext` agora recebe o histórico completo de snapshots e expõe `derived.eventTimeline.<evento>.daysUntilNext`. Três novas cards consomem isso via template: `UPCOMING_LUCKY_WHEEL`, `UPCOMING_SVS`, `UPCOMING_ALLIANCE_MOBILIZATION`. Continua sendo estimativa (não data oficial) e melhora conforme mais check-ins acumulam — se o jogador nunca marcou um evento como ativo, a card correspondente simplesmente não dispara (sem ponto de ancoragem).

### C. Avaliação de crescimento militar / nível de tropas (Battle Domain) — ✅ Implementado em 2026-07-03 (versão enxuta)
Pedido: o app avaliar tropas, não só fornalha/VIP/gemas/poder.

Perguntado ao usuário qual granularidade ele topava preencher toda semana (só total por tipo vs. detalhe por tier vs. nada, inferindo só do Poder). Escolhida a opção enxuta: novos campos `troopsInfantry`/`troopsLancer`/`troopsMarksman` (contagem total por tipo) + `highestTierTraining` (tier mais alto em treino, T1-T12) no snapshot semanal — migração `0005_troop_tracking.sql`. Sem granularidade por tier individual (isso continua fora de escopo — ver nota abaixo).

Motor ganhou `derived.totalTroops`, `derived.troopCompositionPct` (percentual por tipo) e `derived.troopsDelta` (vs. check-in anterior). Quatro novas cards: `TROOP_COMPOSITION_LOW_MARKSMAN` (poucos Atiradores vs. proporção de referência ~30%), `TROOP_COMPOSITION_OVER_INFANTRY` (composição concentrada demais em tanque), `TROOP_GROWTH_STAGNATION` (tropa não cresce + aceleradores de treino acumulados), e `BEAR_TRAP_MARKSMAN_RATIO_LOW` (refina a card qualitativa existente de Bear Trap com o percentual real de Atiradores do jogador). Evolução do Dashboard ganhou sparkline de "Tropas (total)".

**O que ficou de fora, deliberadamente:** granularidade por tier (quantas tropas de cada T1-T12 especificamente) — exigiria uma tabela de preenchimento semanal grande; o usuário preferiu a versão enxuta. Se isso for revisitado, teria que vir com uma UI dedicada (não mais um campo de formulário simples) para não sobrecarregar o check-in semanal.

### D. Previsão de chegada de novas gerações de heróis — ✅ Implementado em 2026-07-03
Novo campo opcional `stateFoundedDate` no perfil (perguntado uma vez, não toda semana). O motor calcula `derived.stateAgeDays` e mapeia para geração via `HERO_GENERATION_MILESTONES` (faixas aproximadas de guias da comunidade, não confirmadas oficialmente — ver KNOWLEDGE-001). Nova card `NEXT_HERO_GENERATION_ETA` mostra "Geração X chega em ~Y dias" via template. Se o jogador não preencher a data, a card simplesmente não dispara (sem degradar para aviso genérico).

**Infraestrutura compartilhada:** B e D usaram a mesma peça de base — suporte a texto calculado (`{{caminho.para.valor}}`) em `recommendation`/`explanation`, implementado uma vez em `strategyEngine.ts` (`interpolate()`) e reaproveitado pelos dois. C (avaliação de tropas) continua independente e é o próximo item a abrir como rodada própria.

## Adendo 2026-07-03 — quinta rodada de feedback

Feedback de uso real antes do teste da idade do estado e das tropas (recém-implementadas). Cinco pedidos:

- **Pré-preenchimento incompleto no formulário (aceleradores zerados)** — ✅ corrigido. Aceleradores agora carregam do último check-in (`buildInitialAcceleratorAmounts` em `SnapshotForm.tsx`), porque é estoque acumulado, não algo que reseta toda semana — decisão de design anterior (não carregar) foi revertida a pedido do usuário. Heróis já carregavam corretamente do check-in anterior (não era um bug de código; se apareceram zerados, o check-in anterior real provavelmente estava mesmo sem heróis preenchidos).
- **Lista de construções incompleta** — ✅ completada: Cabana do Explorador, Cabana do Caçador, Serraria, Mina de Ferro, Mina de Carvão, Casa de Cozinha, Abrigo, Hall dos Heróis (fonte: whiteoutsurvival.wiki, nomes PT traduzidos do inglês, não confirmados 1:1 contra o cliente do jogo).
- **Gráficos de evolução pouco atraentes** — ✅ redesenhados: `HistorySparkline.tsx` trocou as barras por um gráfico de área com curva suave (SVG, sem biblioteca externa), gradiente na cor de destaque, e tooltip ao passar o mouse mostrando data + valor exato.
- **Sem opção de excluir check-in equivocado** — ✅ adicionado botão "Excluir" por linha no Histórico (`HistoryTable.tsx`), com confirmação, chamando delete no Supabase (política RLS `snapshots_delete_own` já existia desde o schema inicial).
- **Visibilidade da idade do estado** — ✅ exposta no cabeçalho do Dashboard ("dia X do estado"), calculada a partir de `stateFoundedDate` independentemente de haver check-ins (antes só existia internamente como `derived.stateAgeDays` para as Strategy Cards de geração de herói).

## Adendo 2026-07-03 — sexta rodada de feedback

Cinco pedidos, incluindo um bug crítico de perda de dados:

- **Cadência diária em vez de semanal** — ✅ textos da UI ajustados ("Novo check-in", "Dúvida do dia", recomendações sem "esta semana" fixo) para não assumirem frequência semanal. Não renomeamos a tabela `weekly_snapshots`/tipo `WeeklySnapshot` no código — é só nomenclatura interna, sem efeito no uso (aceita qualquer frequência de check-in desde o início).
- **Bug crítico: página "se atualiza sozinha" e perde o preenchimento** — ✅ causa raiz encontrada e corrigida. `App.tsx` re-executava `loadProfile` a cada renovação de token do Supabase (inclusive toda vez que a aba voltava a ficar em foco, comportamento automático do cliente), porque o efeito dependia do objeto `session` inteiro em vez do ID do usuário. Isso disparava `loadingProfile=true` → tela renderiza `null` → Dashboard/SnapshotForm são desmontados → rascunho perdido. Trocada a dependência para `session?.user.id`. Adicionado também autosave do rascunho em `localStorage` (por perfil, limpo após salvar) como rede de segurança extra contra descarte de aba pelo navegador/SO (isso o código não controla, é gerenciamento de memória do dispositivo).
- **Aceleradores: trocar de unidade não convertia o valor exibido** — ✅ corrigido. Adicionado `fromDecimalDays()` em `accelerators.ts`; trocar a unidade agora recalcula os números já digitados em vez de só reinterpretá-los sob um rótulo diferente.
- **VIP: % não existe no jogo, só XP** — ✅ campo trocado de "% manual" para "XP dentro do nível atual" (`vipXp`, o número real mostrado na tela do jogo). O motor calcula `derived.vipProgressPct` sozinho usando a tabela de XP necessário por nível (fonte: whiteoutdata.com, ver KNOWLEDGE-001). Coluna `vip_progress_pct` removida do schema (valores antigos eram estimativas do jogador, não dado confiável); nova coluna `vip_xp`.
- **Tropas: o jogo não mostra total por tipo, só por tier** — ✅ modelo revisado: os 3 campos de total único (Infantaria/Lanceiro/Atirador) viraram uma lista de linhas `{tipo, tier, quantidade}` (`troopEntries`), batendo com a tela real do jogo (ex.: "Infantaria Heróica nível VI: 7.848"). Motor soma por tipo (`sumTroopsByType`) para alimentar as mesmas cards de composição/estagnação sem mudança de lógica. Nomes de tier documentados em KNOWLEDGE-001 (I-XII, com V "Resistente" e VI "Heróica" confirmados pelo jogador; demais tentativos/não confirmados).

**Migração:** `0006_vip_xp_and_troop_entries.sql` cobre as duas mudanças de schema (VIP XP + tropas) — precisa rodar no SQL editor do Supabase antes do próximo check-in.

## Nota 2026-07-05 — changelog do jogo aponta possível simplificação futura das tropas

O jogador compartilhou prints de mensagens de sistema do jogo (05/07/2026). Um item do changelog anuncia que "Detalhes do Esquadrão → Visão Geral das Tropas" passará a mostrar as proporções dos tipos de tropa por padrão — potencialmente uma tela mais simples de ler do que somar tiers manualmente. **Ainda não foi implantada no jogo do jogador** (anunciada, não ativa). Ver KNOWLEDGE-001 (seção Cerco de Inverno) para o outro item novo desse changelog (evento de aliança novo, sem dados ainda).

**Ação futura:** quando essa tela estiver ativa, revisitar o formato de `troopEntries` (ver item C, sexta rodada) — se ela mostrar % ou total por tipo diretamente, pode simplificar a entrada de dados de tropas sem perder a granularidade que já temos no histórico.

## Adendo 2026-07-05 — sétima rodada: Guia e Wiki

Pedido do usuário: seção de guia (iniciantes, SvS, alianças) + wiki (heróis, tropas, construções, eventos, pets) dentro do próprio app, citando o WoS Tools como referência de algo parecido já existente na comunidade.

**Tensão com o posicionamento do produto:** o ADR-000 original e várias conversas de produto ao longo deste projeto (ex.: a reflexão sobre TWStats) definiram StratIQ deliberadamente **contra** ser mais uma ferramenta de exibição de dados como WoS Tools/WoS Calc/WOS Nerds — o diferencial é decisão, não catálogo. Uma seção de wiki estática é, por definição, exibição de dados. Registrando essa tensão aqui explicitamente: decidimos seguir em frente porque (a) o pedido veio do próprio usuário/dono do produto, não de mim inferindo escopo, (b) o conteúdo já existia em grande parte pesquisado e sourced em KNOWLEDGE-001 — o custo marginal de expor isso como leitura no app foi baixo, não uma nova frente de pesquisa do zero, e (c) essa seção é claramente separada do Strategy Engine (não alimenta `derived`, não vira Strategy Card) — não dilui a decisão automatizada, só adiciona uma camada de onboarding/referência ao lado dela.

**O que foi implementado:**
- Novo domínio de conteúdo `WikiArticle` (`types/index.ts`): `{ id, category, title, summary, sections: [{heading?, paragraphs}], source }`. Cada artigo é um arquivo próprio em `src/data/wiki/` (mesmo padrão de "um arquivo por unidade" já usado nas Strategy Cards), agregados em `src/data/wiki/index.ts`.
- 10 artigos: 3 guias (iniciante, SvS, alianças) + 7 de wiki (heróis: sistema de gerações + roster do Estado 4465; tropas: tipos/contra-ataque + tiers/progressão; construções: Fornalha + produção; eventos: recorrentes incluindo o Cerco de Inverno em observação; pets — domínio pesquisado pela primeira vez nesta rodada).
- Nova página `Wiki.tsx`: busca client-side (título/resumo/corpo, sem backend) + filtro por categoria + lista + detalhe do artigo. Acesso via link "guia e wiki" no cabeçalho do Dashboard (`App.tsx` ganhou um `showWiki` state, sem adicionar biblioteca de rotas).
- Pesquisado nesta rodada: Pets (raridade, categorias de habilidade, evolução/Marcas de Avanço, prioridade F2P), mecânica de Aliança (cargos R1-R5, tecnologia/doações, loja, pedidos de ajuda), checklist de iniciante (prioridades dos primeiros dias). Os demais artigos reaproveitam pesquisa já registrada em KNOWLEDGE-001 (Heróis, Tropas, Fornalha, Eventos, SvS).

## Adendo 2026-07-05 — oitava rodada: reavaliação estratégica + falso positivo de fila ociosa

Usuário levantou explicitamente se ainda compensa investir no StratIQ, dado que o WoS Tools (visitado diretamente nesta rodada, não só de memória) se mostrou um produto maduro: 9+ calculadoras (construção, tropas, War Academy, gear, charms, pesquisa, pets, experts, VIP), wiki completa, guias, contas com sync, bot de Discord, tier premium. Confirma e reforça a tensão já registrada na sétima rodada sobre a seção Guia/Wiki — nesse terreno (calculadora/wiki/referência) o WoS Tools é objetivamente mais completo e bem-mantido, e StratIQ não deveria tentar competir de frente ali.

**Conclusão da reavaliação:** o único território onde StratIQ continua diferenciado é o Strategy Engine — síntese automática e proativa entre domínios a partir de um check-in periódico leve, entregando "o que fazer agora" sem o jogador precisar abrir uma calculadora específica e interpretar o resultado sozinho. Nenhuma ferramenta comunitária avaliada até agora (WoS Tools incluído) faz isso. Recomendação: parar de expandir a seção Guia/Wiki e concentrar esforço futuro no motor de decisão.

**Pergunta sobre API em tempo real:** usuário deu o exemplo concreto de que o Decision Center aponta o 2º construtor como ocioso mesmo quando o jogador já upou tudo que dava e só está esperando a Fornalha subir de nível para desbloquear a próxima construção — pediu para avaliar se uma API em tempo real resolveria isso.

Resposta, com base em RESEARCH-001 (já existente, não uma pesquisa nova): existe um caminho de terceiro validado (WOS Control, `woscontrol.com/api-docs`), mas ele expõe dados de perfil/estado/ranking (poder, kills, aliança, posição) — o tipo de dado que alimenta bots de aliança e leaderboard —, não o estado ao vivo de filas de construção/pesquisa do cliente do jogo. Ou seja: mesmo integrando essa API, o problema relatado **não seria resolvido**, porque esse dado específico não é exposto por nenhuma API pública/semi-pública conhecida. A recomendação original do RESEARCH-001 (não construir conector próprio no MVP; WOS Control como opção v1+ só após tração validada, nunca como dependência crítica) permanece válida e não foi revisitada.

**Fix real, implementado nesta rodada:** os três campos "Nada disponível agora" (`constructionMaxed`, `construction2Maxed`, `researchMaxed`) — checkboxes que só aparecem no formulário quando o campo de construção/pesquisa correspondente está vazio. Quando marcado, suprime tanto a Strategy Card de fila ociosa (`IDLE_CONSTRUCTION_QUEUE`, `IDLE_CONSTRUCTION_QUEUE_2`, `IDLE_RESEARCH_QUEUE`) quanto o semáforo de crescimento (`semaphore.ts`), que antes ficava amarelo/vermelho pelo mesmo motivo. Não persiste de um check-in para o outro (o jogador declara de novo a cada vez que precisar) — decisão deliberada para evitar o risco oposto (a flag ficar "true" esquecida depois que a Fornalha sobe e novas opções aparecem, silenciando um aviso que passou a ser válido de novo).

**Migração:** `0007_queue_maxed_override.sql`.

## Adendo 2026-07-05 — nona rodada: análise por IA + card de promoção de tropas

Usuário perguntou (a) se dava para responder com os dados atuais dúvidas concretas do check-in do dia 05 (acelerar Fornalha, gastar gemas em VIP, promover vs. treinar tropas, equipamento de herói), e (b) se fazia sentido a IA gerar uma análise em cima do campo "dúvida do dia".

**Resposta à pergunta (a), por tema:**
- Fornalha: direcional sim (Fornalha é sempre prioridade #1, já documentado), ROI exato não (isso é calculadora, terreno que decidimos não disputar na oitava rodada).
- Gemas para VIP: sim, já resolvido pelo motor (`VIP_NEAR_LEVEL_UP` + `SAVE_GEMS_BASELINE_RESERVE` + `derived.vipProgressPct`).
- Promover vs. treinar tropas: parcial — não temos custo exato por tier (calculadora), mas temos o suficiente para um sinal estratégico. Nova card `TROOP_PROMOTE_VS_TRAIN` (ver abaixo).
- Equipamento de herói: não. `HeroEntry` nunca teve campo de equipamento (item 5 do BACKLOG original, sempre classificado como maior expansão de modelo pendente) — e é exatamente onde o WoS Tools tem 3 calculadoras dedicadas (Hero Gear, Chief Gear, Chief Charms), reforçando a decisão da oitava rodada de não competir nesse terreno.

**Nova Strategy Card — `TROOP_PROMOTE_VS_TRAIN`:** novo campo derivado `derived.hasMultipleTroopTiers` (`strategyEngine.ts`) detecta se o jogador tem mais de um tier do mesmo tipo de tropa ao mesmo tempo (via `troopEntries`, já coletado desde a sexta rodada) — sinal de que promover o tier inferior pode ser mais barato em tempo do que treinar do zero no tier atual. Prioridade baixa, recomendação em termos gerais (o motor não conhece custos exatos por tier).

**Análise por IA sob demanda — implementada:** botão "Perguntar à IA" que aparece quando a "dúvida do dia" está preenchida. Desenho arquitetural, preservando a regra de ouro do projeto ("o motor decide, a IA só explica"):
- O **cliente** já roda `strategyEngine.ts` normalmente e monta o contexto + as Strategy Cards que dispararam — isso NÃO é recalculado no servidor, evitando duplicar/dessincronizar a lógica do motor entre cliente e Edge Function.
- Nova Edge Function `supabase/functions/analyze-checkin` recebe esse resultado já pronto (contexto + cards) + a pergunta do jogador, monta um prompt que instrui a IA a **só explicar o que já foi calculado**, nunca inventar recomendação nova, e admitir quando a pergunta é sobre um dado que o app não rastreia (ex.: equipamento de herói) em vez de arriscar palpite.
- Chama a API da Anthropic (`claude-haiku-4-5-20251001`) com a chave guardada como secret do Supabase (`ANTHROPIC_API_KEY`) — nunca no navegador.
- Resposta persistida na nova tabela `ai_analyses` (pergunta + resposta + modelo + data), com RLS própria. Cliente busca a análise mais recente do check-in ao carregar (`fetchLatestAiAnalysis`) e permite perguntar de novo.
- Custo estimado por chamada: ~US$0,004-0,012 (Haiku a ~US$1/US$5 por milhão de tokens de entrada/saída) — negligível mesmo em uso diário.
- **Primeira Edge Function do projeto** — até aqui só usávamos Postgres/Auth do Supabase. Isso é infraestrutura nova, registrada aqui por ser uma mudança arquitetural, não só mais uma Strategy Card.

**Pendências de deploy que só o usuário pode fazer** (chave de API e deploy de function não são ações que о Claude executa por conta própria):
1. Rodar a migração `0008_ai_analyses.sql` no SQL editor do Supabase. — ✅ confirmado pelo usuário em 2026-07-06.
2. Gerar uma chave de API em console.anthropic.com. — ✅ confirmado pelo usuário em 2026-07-06.
3. Rodar `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` (via CLI, projeto linkado). — pendência ainda não confirmada; sem isso a function responde com erro explícito ("ANTHROPIC_API_KEY não configurada") em vez de falhar silenciosamente.
4. Deploy da function `analyze-checkin` — ✅ feito em 2026-07-06 diretamente via MCP do Supabase (`deploy_edge_function`), sem precisar do CLI local. Status confirmado `ACTIVE`.

**Nota 2026-07-06:** o botão "Perguntar à IA" só aparece no Dashboard quando o check-in **mais recente** tem o campo "Dúvida do dia" preenchido — se o usuário não viu o botão após o deploy, o motivo mais provável é que o último check-in salvo é anterior a essa funcionalidade (ou o campo ficou em branco), não uma falha de deploy. Logs da function (`get_logs`) confirmam zero invocações até o momento — consistente com "nunca foi acionada", não com "está com erro".

## Adendo 2026-07-06 — décima rodada: priorização leve de heróis por fragmentos

Usuário viu a calculadora de upgrade de estrelas da WoS Tools (interface "DE 0★-0 ATÉ 5★ Max", com sub-níveis de ascensão) e perguntou se valia a pena modelar essa granularidade para melhorar a recomendação de "investir ou não nesse herói".

**Avaliação:** essa granularidade é essencialmente custo de fragmento por transição de estrela — exatamente o território de calculadora que a oitava rodada já decidiu não disputar com a WoS Tools. Replicar a escada de ascensão inteira exigiria manter uma tabela de custo por raridade/geração (fonte não trivial de sourcing confiável) e pediria ao jogador para digitar dados detalhados a cada check-in, contra o objetivo de manter o check-in leve.

**Alternativa implementada:** dois campos opcionais em `HeroEntry` — `shardsOwned` e `shardsRequiredForNextStar` — preenchidos apenas se o jogador quiser sinalizar um herói específico que está priorizando (ambos os números aparecem direto na tela do herói no jogo, sem exigir nenhuma tabela de custo mantida pelo app). Só aparecem no formulário para heróis abaixo de 5 estrelas.

Novo campo derivado `derived.heroNearStarUpgradeName`/`derived.heroNearStarUpgradePct` (`strategyEngine.ts`) calcula, entre os heróis com os dois campos preenchidos, qual está mais perto de completar a próxima estrela. Nova card `HERO_SHARDS_NEAR_STAR_UPGRADE` dispara quando esse progresso passa de 80%, recomendando concentrar recursos nesse herói em vez de espalhar entre vários — mesma heurística de "terminar o que já está quase completo" usada em `VIP_NEAR_LEVEL_UP`.

**O que ficou de fora, deliberadamente:** custo exato de fragmentos por estrela/raridade, equipamento, habilidades — tudo isso continua no item 5 do backlog original, sem mudança de status.

## Adendo 2026-07-08 — décima quinta rodada: seis correções de uso real

Usuário encaminhou uma mensagem oficial in-game (Beast Cage/Pets) e listou cinco outros pontos observados usando o app no dia a dia. Todos com causa raiz real, não hipotética:

**1. Falso positivo: Pets "liberados" na Fornalha 18 sem estar disponível no jogo.** Causa: a mensagem oficial da equipe do jogo (2026-07-08) avisa que a captura de pets só fica disponível a partir de 2026-07-09 02:30 UTC — um rollout de conteúdo independente do nível de Fornalha, que a card `FURNACE_18_PETS_UNLOCKED` não conseguia enxergar (só olhava `furnaceLevel`). ✅ Corrigido: novo campo `derived.todayIso` no motor (data de hoje em ISO) + operadores `gte`/`lte`/`gt`/`lt` passaram a aceitar comparação de strings (útil para datas ISO, onde ordem lexicográfica = ordem cronológica) + card ganhou uma terceira condição exigindo `derived.todayIso >= "2026-07-09"`. Documentado em KNOWLEDGE-001 (seção Pets), com ressalva de que não sabemos se essa data vale para todos os servidores.

**2. Silêncio do motor quando há Lucky Wheel ativa mas gemas insuficientes para maximizar.** Pergunta do usuário, não bug: `SPEND_GEMS_LUCKY_WHEEL` só dispara com `gems >= 159000` (o suficiente para os 120 giros completos) — abaixo disso, a card fica em silêncio de propósito, porque o motor não tem uma regra sourced para "vale a pena gastar parcialmente". Decisão: manter o comportamento atual (silêncio é mais honesto que uma recomendação sem base). Se isso incomodar no uso contínuo, um nível "medium priority" de participação parcial é um item futuro de baixo esforço, mas precisa de uma fonte confiável sobre o retorno de giros parciais antes de implementar — não adicionado agora.

**3. Lucky Wheel tem tema rotativo (herói em destaque) que o motor ignorava.** Confirmado pelo usuário: a rotação atual tem Zinman como tema, que ele não considera útil pro perfil dele (nota: KNOWLEDGE-001 documenta Zinman como utilidade SSS-tier, não dano — pode ser relevante mesmo não sendo um herói de combate; o motor deliberadamente não arbitra isso). ✅ Implementado: campo opcional `luckyWheelFeaturedHero` no snapshot (migração `0009`), input condicional no formulário (só aparece com "Roda da Sorte" marcada), nova card `LUCKY_WHEEL_FEATURED_HERO_CONTEXT` que nomeia o tema e pede pro jogador confirmar relevância — sem o motor opinar sobre a força do herói (fora do que já está sourced na seção Heróis).

**4. "Hall of Chiefs" e "Rally do Herói" são o mesmo evento.** Estavam modelados como duas entradas separadas em `KNOWN_EVENTS` desde a terceira rodada (quando "Hall of Chiefs" foi listado como nome próprio não traduzido). Usuário confirmou que é o mesmo evento. ✅ Corrigido: removida a entrada duplicada — nenhuma Strategy Card referenciava "Hall of Chiefs" especificamente, então a mudança não quebra nada existente.

**5. Sparkline de "Tropas (total)" caiu ao promover tropas de tier.** Causa raiz dupla: (a) a métrica é contagem bruta por design (soma direta de `troopEntries`), então promover tropas de tier baixo para tier alto reduz a contagem mesmo fortalecendo o exército (consome várias tropas baixas para gerar menos tropas altas) — isso não é um bug, é a métrica errada pra essa pergunta; (b) a card `TROOP_GROWTH_STAGNATION` (`troopsDelta <= 0` + aceleradores de treino acumulados) tinha o mesmo risco de falso positivo durante uma promoção real. ✅ Corrigido: legenda explicativa abaixo do sparkline apontando "Poder" como o indicador líquido confiável (já existe como campo/sparkline próprio, captura o efeito da promoção corretamente) + override manual `troopsPromoting` (migração `0009`, mesmo padrão do `constructionMaxed`/`researchMaxed` da oitava rodada) que suprime `TROOP_GROWTH_STAGNATION` quando marcado. Não persiste entre check-ins, mesmo raciocínio de não deixar a flag esquecida.

**6. Sem forma de consultar respostas anteriores da IA.** Usuário testou a análise por IA, não gostou da resposta, e pediu acesso ao histórico de conversas (não só a mais recente por check-in, que já existia). ✅ Implementado: `fetchAiAnalysisHistory(profileId)` busca todos os registros de `ai_analyses` do perfil (a policy `ai_analyses_select_own` já cobria isso, sem migração nova necessária) + seção "Ver histórico de análises por IA" no Dashboard (colapsável, carregada sob demanda) + botão excluir por registro (reaproveitando a policy `ai_analyses_delete_own`, já existente desde a migração `0008`).

**Migração:** `0009_lucky_wheel_hero_and_troop_promotion.sql` (aplicada diretamente via MCP do Supabase nesta rodada, sem precisar do usuário rodar no SQL editor).

## Adendo 2026-07-08 — décima sexta rodada: ordenar tropas por tier

Pedido simples: linhas de tropa apareciam na ordem em que foram digitadas, então tiers novos e mais fortes (ex.: VII - Brave, recém-desbloqueado) apareciam no fim da lista em vez de primeiro. ✅ Implementado: `troopTierRank()` em `knownOptions.ts` (posição do tier em `KNOWN_TROOP_TIERS` = força relativa) + renderização das linhas em `SnapshotForm.tsx` ordenada por força decrescente, preservando os índices originais para os handlers de editar/remover. Tier ainda não reconhecido (sendo digitado, ou fora da lista) fica no fim até resolver para um valor válido — não é reordenado a cada tecla digitada. Sem mudança de schema/migração.

## Adendo 2026-07-09 — décima sétima rodada: gráfico de VIP trocado para progresso no nível atual

Usuário observou que o gráfico "VIP" em Evolução (nível bruto) quase não se movia entre check-ins — subir de nível VIP é lento, então a linha ficava reta a maior parte do tempo, sem transmitir progresso real.

**Avaliação:** o app já calculava `derived.vipProgressPct` (progresso % dentro do nível atual, a partir do XP informado) desde a sexta rodada, só que apenas para o check-in mais recente (usado nas Strategy Cards) — nunca tinha sido recalculado por snapshot histórico para alimentar um gráfico.

✅ Implementado: `computeVipProgressPct` (antes privada em `strategyEngine.ts`) exportada; `HistorySparkline.tsx` ganhou o campo `'vipProgressPct'` (recalcula a % por snapshot do histórico, não lê um valor bruto salvo) e um prop opcional `suffix` (usado para exibir "%" no valor atual, no delta e no tooltip, sem afetar o cálculo). Dashboard troca o sparkline `field="vipLevel"` por `field="vipProgressPct"`, com o rótulo mostrando o nível atual entre parênteses (ex.: "VIP (nível 9 — progresso p/ o próximo)") para não perder a informação do nível bruto. Sem mudança de schema/migração — `vipXp` já era salvo desde a sexta rodada.

## Adendo 2026-07-09 — décima oitava rodada: expansão de escopo para "visão completa da conta"

Usuário encaminhou um resumo detalhado do status da conta (aliança, equipamento de herói, pets, níveis de prédio da cidade) e, ao perguntar o que fazer com esses dados fora de escopo, respondeu que via valor em expandir o app para cobrir esses domínios: "entendo que ter a visão de toda a conta irá nos ajudar no futuro nas tomadas de decisão".

**Decisão de escopo/ordem** (perguntada ao usuário, confirmada): um domínio por rodada, começando por Pets → equipamento de herói → prédios da cidade → aliança; e, por enquanto, só **captura de dados** (formulário + histórico + contexto para a IA), sem Strategy Cards novas — mesmo critério já usado nos domínios anteriores (card só quando há regra sourced e validada com uso real).

**Pets (primeiro domínio, implementado nesta rodada):** novo tipo `PetEntry { name, level }` e campo opcional `petEntries?: PetEntry[]` em `WeeklySnapshot` — modelo enxuto, sem os marcos de evolução (Marcas de Avanço/Selvagens) documentados em KNOWLEDGE-001, que ficam fora por ora. `KNOWN_PETS` em `knownOptions.ts` com os 6 pets já documentados (sugestão via datalist, lista parcial). Seção "Pets (opcional)" no `SnapshotForm.tsx`, mesmo padrão de linhas repetíveis (add/remove) usado em tropas e heróis. Migração `0010_pet_entries.sql` (coluna `pet_entries jsonb not null default '[]'`, aplicada diretamente via MCP do Supabase). Sem Strategy Card nova.

**Próximas rodadas desta expansão:** equipamento de herói (rarity + nível de enhancement por slot), prédios da cidade (níveis além da Fornalha), aliança (nome/rank/participação em eventos) — cada um em rodada própria, mesmo padrão.

## Adendo 2026-07-09 — décima nona rodada: equipamento de herói (Hero Gear)

Segundo domínio da expansão "visão completa da conta" (item 5 do BACKLOG original + décima oitava rodada). Pesquisa prévia confirmou (BlueStacks, whiteoutsurvival.wiki): equipamento tem 4 slots fixos (Elmo/Manopla/Cinto/Bota) + 1 slot exclusivo para heróis de raridade máxima (Lendário); raridade em 5 níveis; nível de enhancement vai de 0 a 100 (depois disso, ascensão). A nomenclatura de raridade usada no formulário (Comum/Incomum/Raro/Épico/Lendário) segue o que o próprio jogador reportou ver no cliente em PT — os guias em inglês descrevem a mesma estrutura de 5 níveis por cor (Grey/Green/Blue/Purple/Gold), tratado como equivalente.

✅ Implementado: tipos `GearSlot`, `GearRarity`, `HeroGearEntry {heroName, slot, rarity, level}` e campo opcional `heroGearEntries?: HeroGearEntry[]` em `WeeklySnapshot`. `KNOWN_GEAR_SLOTS`/`KNOWN_GEAR_RARITIES` em `knownOptions.ts` (selects fechados, não texto livre — ao contrário de tier de tropa, aqui a lista é exaustiva e sourced). Seção "Equipamento de herói (opcional)" no `SnapshotForm.tsx`, mesmo padrão de linhas repetíveis. Migração `0011_hero_gear_entries.sql` (coluna `hero_gear_entries jsonb not null default '[]'`, aplicada via MCP do Supabase). Sem Strategy Card nova — mesmo critério dos domínios anteriores desta expansão.

## Adendo 2026-07-09 — vigésima rodada: prédios da cidade

Terceiro domínio da expansão "visão completa da conta". Diferença deste domínio: ao revisar o resumo de conta do usuário, os nomes de prédio que ele reportou ("Quartel", "Hospital", "Campo de Lanceiros", "Campo de Atiradores", "Academia") não batem literalmente com `KNOWN_BUILDINGS` (que tem "Acampamento de Infantaria", "Enfermaria", "Acampamento de Lanceiros", "Acampamento de Atiradores", "Academia de Guerra") — não está confirmado se são sinônimos informais ou prédios distintos. Em vez de arriscar mesclar/renomear errado (como foi feito com segurança no caso "Hall of Chiefs" = "Rally do Herói" na décima quinta rodada, ali com confirmação explícita do jogador), optei por **não alterar `KNOWN_BUILDINGS`** e tratar o campo como texto livre + sugestão — mesmo padrão já usado em `currentBuilding`. Fica como item aberto para confirmação futura.

✅ Implementado: tipo `BuildingLevelEntry {name, level}` e campo opcional `buildingLevels?: BuildingLevelEntry[]` em `WeeklySnapshot`. Seção "Prédios da cidade (opcional)" no `SnapshotForm.tsx` (texto livre com datalist de `KNOWN_BUILDINGS`, não lista fechada). Migração `0012_building_levels.sql` (coluna `building_levels jsonb not null default '[]'`, aplicada via MCP do Supabase). Sem Strategy Card nova.

**Restam desta expansão:** aliança (nome/rank/participação em eventos) — próxima e última rodada planejada.

## Adendo 2026-07-09 — vigésima primeira rodada: aliança (fecha a expansão "visão completa da conta")

Quarto e último domínio planejado desta expansão. Nome da aliança já existia (`profile.alliance`, definido uma vez no perfil) — o que faltava era ranking (muda com o tempo) e participação em eventos.

✅ Implementado: campos opcionais `allianceRank?: number` e `allianceParticipatesAllEvents?: boolean` direto em `WeeklySnapshot` (sem lista repetível — só um valor por check-in, diferente de pets/gear/prédios). Migração `0013_alliance_fields.sql` (colunas nullable, **sem default** — ausência significa "não respondido", diferente do padrão `not null default false` usado em flags de override como `constructionMaxed`, onde `false` é um valor válido e intencional). Seção "Aliança" no `SnapshotForm.tsx`, carregando o rank/participação do check-in anterior por padrão (mesmo tratamento de campos estáveis como Fornalha/VIP). Sem Strategy Card nova.

**Expansão "visão completa da conta" concluída** (rodadas 18-21): Pets, Equipamento de Herói, Prédios da Cidade, Aliança — todos como captura de dados (visibilidade + contexto para IA), nenhum ainda com Strategy Card própria. Card fica para quando surgir uma regra sourced e validada com uso real em algum desses domínios, mesmo critério usado desde a oitava rodada.

## Adendo 2026-07-09 — vigésima segunda rodada: prédios ordenados, formulário de herói+equipamento fundido, primeiras Strategy Cards de Equipamento de Herói

Usuário fez um check-in real pós-expansão e pediu três coisas: (1) ordenar prédios da cidade por nível (maior primeiro); (2) fundir a seção de Equipamento de Herói dentro de "Heróis favoritos", preenchendo tudo por herói numa passada só; (3) avaliar se os dados reais já capturados (heróis+equipamento, prédios, eventos) justificam alguma Strategy Card nova.

**1) Prédios ordenados:** mesmo padrão de `troopTierRank` (décima sexta rodada) aplicado a `buildingLevels` — `.sort()` por `level` decrescente no render de `SnapshotForm.tsx`, preservando o índice original para os handlers de editar/remover. Sem mudança de schema.

**2) Formulário fundido:** removida a seção solta "Equipamento de herói (opcional)", que exigia digitar o nome do herói de novo e já tinha gerado uma entrada inconsistente na prática (um herói do jogador com duas linhas de "elmo", uma delas nível 0 — resíduo de uso da UI antiga). Agora cada herói em "Heróis favoritos" mostra os 5 slots (Elmo/Manopla/Cinto/Bota/Exclusivo) inline, com upsert por (heroName, slot) em vez de índice de array solto (`setHeroGear`/`findGearEntry`, substituindo `updateGearEntry`/`addGearEntry`/`removeGearEntry`). Renomear um herói migra automaticamente o equipamento já preenchido para o novo nome, evitando entradas órfãs. Sem migração — mesma coluna `hero_gear_entries`, só reorganização de UI.

**3) Duas Strategy Cards novas**, as primeiras do domínio Equipamento de Herói (capturado desde a décima nona rodada sem card atrelada até agora). Dois novos campos derivados em `strategyEngine.ts` (`computeHeroGearInsights`):
- `HERO_GEAR_MASTERY_FORGING_READY` (confiança 0.6, prioridade média): dispara quando alguma peça é Lendária com enhancement 20+ e a Fornalha já é 20+ — fato sourced em KNOWLEDGE-001 (seção Equipamento de Herói). Verificado contra o check-in mais recente via consulta direta ao Supabase: o slot Exclusivo da Molly é Lendário mas só nível 1, e a Fornalha está em 19 — a card corretamente não disparou para esse dado.
- `HERO_GEAR_SLOT_IMBALANCE` (confiança 0.4, prioridade baixa, deliberadamente sem recomendar ação): sinaliza quando os 4 slots base do mesmo herói (Elmo/Manopla/Cinto/Bota) têm gap de nível de enhancement >= 5 entre o mais forte e o mais fraco. Disparou para Molly no check-in analisado (Cinto raro nível 5 contra Elmo/Manopla/Bota épico nível 10) — a card só reporta o fato observado, porque não há fonte confirmando se equilibrar investimento entre slots é mecanicamente melhor do que concentrar num só (regra do projeto: sem fonte, sem recomendação de ação).

**Correção adicional, achada ao consultar o Supabase para embasar a resposta ao usuário:** `FURNACE_18_PETS_UNLOCKED` continuava avisando "Pets disponível" mesmo depois do jogador já ter 3 pets registrados no check-in. Nova condição `derived.hasAnyPets == false` suprime a card assim que houver pelo menos um pet — mesmo raciocínio de "aviso fica obsoleto depois que o jogador já agiu" usado em `constructionMaxed`/`researchMaxed`/`troopsPromoting`.

**Observação levantada, não decidida:** o check-in mais recente marcou "Rally do Herói" e "Salão dos chefes" como eventos simultâneos e distintos — o que contradiz a fusão "Hall of Chiefs = Rally do Herói" decidida na décima quinta rodada (na época, com confirmação explícita do jogador de que eram o mesmo evento). Não alterado nesta rodada; fica como pergunta em aberto — se for confirmado que são eventos diferentes, a fusão da décima quinta rodada precisa ser revertida. O mesmo check-in também trouxe vários nomes de evento novos, sem confirmação de recorrência (Vitória por pênalti, Hora do Gol, Rei do Futebol, Benefícios de recarga, Posto de suprimentos, Irmão de guerra, Campeonato da aliança) — parecem um evento temático (futebol) de tempo limitado; não adicionados a `KNOWN_EVENTS` por ora, ficaram só como texto livre no check-in.

## Adendo 2026-07-10 — vigésima terceira rodada: revertida a fusão Hall of Chiefs / Rally do Herói

Usuário confirmou a observação levantada no fim da vigésima segunda rodada: "Rally do Herói" e "Salão dos chefes" **são** eventos distintos — a fusão feita na décima quinta rodada estava errada (baseada numa confirmação do jogador que não se sustentou quando os dois apareceram ativos ao mesmo tempo num check-in real). Também confirmou que os nomes de evento temático de futebol (Vitória por pênalti, Hora do Gol, Rei do Futebol, etc.) são temporários e podem continuar como texto livre, sem entrar em `KNOWN_EVENTS`.

✅ Corrigido: `Salão dos chefes` voltou a `KNOWN_EVENTS` (`knownOptions.ts`) como entrada própria, com o comentário do arquivo atualizado explicando a reversão. Nenhuma Strategy Card referencia "Rally do Herói" ou "Hall of Chiefs" especificamente (confirmado via busca no código), então a mudança não quebra nenhuma regra existente — é só a lista de checkboxes do formulário ficando mais precisa de novo. Nota correspondente adicionada em KNOWLEDGE-001 (seção Eventos). Sem migração — `KNOWN_EVENTS` não é uma tabela, é uma constante do app.

**Correção adicional na mesma rodada — `HERO_GEAR_SLOT_IMBALANCE` comparava níveis entre raridades diferentes, o que é enganoso.** O jogador apontou o erro direto no exemplo usado para validar a card: Molly tem 3 peças Épico nível 10 e o Cinto Raro nível 5 — a versão original comparava os 4 slots base entre si sem olhar raridade e apontava o Cinto como "atrasado". O jogador explicou a mecânica real: não vale a pena evoluir o enhancement de uma peça antes dela subir de raridade, então o Cinto ficar em nível mais baixo enquanto está numa raridade menor é escolha deliberada, não descuido — só faria sentido comparar níveis entre peças da mesma raridade. ✅ Corrigido: `computeHeroGearInsights` (`strategyEngine.ts`) agora agrupa as peças do herói por raridade antes de procurar o gap de nível, e só compara dentro do mesmo grupo. Com essa correção, o exemplo da Molly deixa de disparar a card (correto — as peças em raridades diferentes não são comparáveis). A card só dispara agora quando há 2+ peças do mesmo herói na mesma raridade com gap de nível ≥5.
