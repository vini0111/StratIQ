# MVP-001 — Escopo e Estrutura da v0

**Document ID:** MVP-001
**Version:** 1.0 (Draft)
**Status:** 🟡 Proposed
**Owner:** Product / Systems Architecture
**Related:** ADR-000, RESEARCH-001
**Last Updated:** 2026-07-02

---

## Objetivo

Colocar uma versão utilizável nas mãos do próprio usuário em dias, não meses, e validar por 3-4 semanas de uso real antes de retomar qualquer documento de arquitetura ampliada. Esta v0 é deliberadamente pequena: ela existe para testar a premissa central do produto — "poucos dados de entrada geram recomendações realmente úteis" — não para demonstrar a arquitetura completa.

## Princípios aplicados (de ADR-000)

- Importação manual apenas. Nenhum conector automático nesta fase (ver RESEARCH-001).
- Regras como dados, não como `if`s hardcoded — mantém o único padrão de "Strategy Cards" que vale a pena adotar desde já.
- Sem DDD formal, sem Event-Driven, sem múltiplos repositórios. Um repositório, uma aplicação.
- Critério de sucesso: uso semanal voluntário pelo próprio usuário, não "features entregues".

## Escopo (dentro do MVP)

**Entrada de dados** — um único formulário curto, preenchível em menos de 2 minutos, com os campos já validados no conceito original: Data, Fornalha, VIP, Gemas, dias de aceleradores (Construção/Pesquisa/Treino), Aliança, Evento atual, Poder, Nível/Estrelas de até 5 heróis favoritos, pesquisa atual, construção atual.

**Tela única (Decision Center)** — mostra, a partir do último snapshot: um semáforo por área (Crescimento, Economia, Batalha), e uma lista curta de 3-5 recomendações priorizadas geradas pelas regras. Não é dashboard de dados — cada item da tela responde "o que eu faço agora".

**Motor de regras v0** — 8 a 12 Strategy Cards cobrindo os casos já citados no conceito original (guardar gemas antes da Lucky Wheel, priorizar VIP, não desperdiçar aceleradores, priorizar pesquisa vs. construção). Formato de dados (YAML/JSON), não código — para que novas regras sejam adicionadas sem deploy.

**Histórico simples** — cada preenchimento vira um snapshot armazenado; gráfico básico de evolução (Fornalha, VIP, Gemas) usando os snapshots acumulados.

## Fora de escopo (adiado explicitamente)

Conectores automáticos de dados, IA conversacional, Digital Twin como conceito de engenharia, Simulation/Prediction/Confidence Engine, suporte a múltiplos jogos, múltiplos repositórios, ADRs além dos já registrados, notificações, comparação entre jogadores. Tudo isso permanece registrado como *Future Considerations* no VISION-001 — não é descartado, é adiado até haver uso validado.

## Modelo de dados (mínimo)

- `profiles` — usuário, estado, aliança, perfil financeiro, objetivo (definidos uma vez no onboarding).
- `weekly_snapshots` — um registro por atualização: os campos do formulário acima + timestamp.
- `strategy_cards` — regras carregadas de arquivos de configuração (não precisa ser tabela de banco na v0; pode ser arquivo versionado no repositório).

Sem tabelas de heróis/eventos/construções do jogo inteiro — isso é conhecimento estático que pode viver em constantes/config na v0, sem virar "Knowledge Base" formal ainda.

## Stack

React (Vite) + Supabase (Auth + Database) + Vercel — a escolha já validada em projeto anterior do usuário, sem introduzir Next.js, Edge Functions ou infraestrutura adicional nesta fase.

## Critério de sucesso da v0

O usuário preenche o snapshot semanalmente por 3-4 semanas seguidas, sem lembrete externo, porque a recomendação gerada é útil o suficiente para valer o esforço de 2 minutos.

## Próximos passos após validação

Se o critério de sucesso for atingido: retomar VISION.md v1 / PRD / NFR com escopo ajustado ao aprendizado real de uso, e só então avaliar o conector opcional do WOS Control (RESEARCH-001) como primeira automação. Se não for atingido: revisar as regras e a proposta de valor antes de adicionar qualquer camada nova.

## Open Questions

- Quais das 8-12 regras iniciais realmente merecem entrar na v0, com base na frequência de decisão (semanal) vs. relevância?
- O onboarding (perfil financeiro, objetivo, tempo disponível) entra na v0 ou pode ser adiado para depois da primeira semana de uso?
