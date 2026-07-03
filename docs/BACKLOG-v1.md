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

### 4. Nível do herói vs. cap do acampamento
Pedido para sinalizar quando um herói está no limite de nível permitido pelo acampamento/fornalha atual, para não desperdiçar recursos nele.
**Por que não agora:** exige saber a regra do jogo que liga cap de herói a nível de fornalha/acampamento — conhecimento de domínio que ainda não está modelado. Também é Knowledge Base.
**Esforço estimado:** médio-alto (precisa da regra do jogo documentada antes de virar código).

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
