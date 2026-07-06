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

### 5. Equipamentos, habilidades e frações de estrela (estágios de ascensão)
Hoje heróis têm só nome/nível/estrelas (inteiro). O pedido é modelar equipamento, habilidades e o fato de que cada estrela tem 6 estágios de ascensão internos.
**Por que não agora:** é o item de maior expansão de modelo desta lista — essencialmente o Hero Domain completo que a documentação original (pré-ADR-000) tentava modelar prematuramente. Não é um "campo a mais", é uma entidade nova inteira.
**Esforço estimado:** alto (Knowledge Base do domínio Hero + mudança de `HeroEntry`).

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
