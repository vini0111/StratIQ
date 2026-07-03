# ADR-000 — External Architecture Review & Scope Recommendation

**Document ID:** ADR-000
**Title:** Revisão Externa de Arquitetura e Recomendação de Escopo
**Version:** 1.0
**Status:** 🟢 Approved
**Owner:** Product / Systems Architecture (revisão externa)
**Input reviewed:** `Referência/Estratégias para Iniciantes.pdf` (transcrição completa da conversa fundacional do projeto)
**Related:** VISION-001 (draft), Fase 0.1 — Research Findings, RFC-0001 (Knowledge as a Product)
**Last Updated:** 2026-07-02

---

## Contexto

O projeto nasceu de uma necessidade concreta e pequena: reduzir o tempo gasto atualizando uma planilha de acompanhamento de conta de Whiteout Survival para menos de 2 minutos por semana. Ao longo da conversa transcrita, o escopo evoluiu — em poucas dezenas de mensagens — para uma "Strategic Decision Intelligence Platform" multi-jogo, com Digital Twin, Knowledge Engine, Timeline Engine, Prediction Engine, Simulation Engine, Confidence Engine, Explainability Engine, modelagem DDD com Bounded Contexts, Clean Architecture, Event-Driven Architecture, três repositórios independentes, dez ADRs, um processo de governança (Issue → RFC → ADR → Implementação → Knowledge Update) e um documento de arquitetura de marca — tudo isso sem nenhuma linha de código escrita e sem nenhuma versão usada por um usuário real.

Esta revisão avalia essa documentação como arquiteto de sistemas, arquiteto de produto e desenvolvedor, com o objetivo de decidir se o projeto deve prosseguir e, se sim, sob qual processo.

## Método da revisão

Leitura integral da transcrição (~4.000 linhas), avaliando: (1) solidez conceitual das decisões técnicas propostas; (2) adequação do escopo ao estágio real do projeto (pré-produto, sem usuários, provavelmente equipe de 1); (3) riscos não resolvidos que bloqueiam a viabilidade do produto; (4) padrão do processo que gerou os documentos.

## Findings

### Pontos fortes (manter)

1. **Separação de dados jogador / estado / jogo global.** Dados do jogador (mutáveis, privados), dados do estado (compartilhados entre jogadores do mesmo servidor) e dados globais do jogo (quase estáticos: heróis, construções, pesquisas) são domínios com ciclos de mudança diferentes. Modelá-los separadamente desde o início é uma decisão de dados correta e barata de manter.
2. **Regras como dados (Strategy Cards).** Expressar a lógica de recomendação como arquivos declarativos (YAML/JSON) em vez de código imperativo é um padrão de rules engine testado. Permite adicionar/ajustar estratégias sem deploy e sem tocar no núcleo do sistema.
3. **Estratégia de conectores em camadas.** Core independente de qualquer integração automática, conectores como módulos opcionais, importação manual sempre disponível como fallback. Esta é a melhor decisão arquitetural de toda a documentação: isola o produto de uma dependência externa frágil e não confirmada.
4. **"Strategy before AI".** O motor de regras decide, a IA explica. Evita que recomendações fiquem inconsistentes ou dependentes de alucinação do modelo, e permite trocar de provedor de IA sem alterar a lógica de negócio.

### Riscos (endereçar antes de continuar)

1. **Dependência central não resolvida: aquisição de dados.** Toda a proposta de valor ("o app te diz o que fazer sem você digitar nada") depende de obter dados do jogo automaticamente. A investigação (Fase 0.1) terminou em probabilidades especulativas (55% API HTTP privada, 30% gRPC, 15% socket binário), sem nenhuma validação empírica com proxy/APK. Esse é o risco técnico que determina se o produto é "aplicativo de anotação manual" ou "plataforma automática" — e ele foi adiado enquanto milhares de linhas de arquitetura especulativa foram produzidas em cima dele.
2. **Exposição legal não resolvida.** Engenharia reversa de uma API privada da Century Games foi identificada como possível violação dos Termos de Serviço. A conversa reconheceu o risco ("depois vamos avaliar a questão legal") mas nunca chegou a uma decisão. Isso não pode ficar pendente indefinidamente — o app tem risco real de bloqueio de conta ou notificação de cessar-e-desistir se o conector for construído por engenharia reversa sem avaliação prévia.
3. **Inflação de escopo sem validação de demanda.** A única evidência de mercado citada foi "existem projetos da comunidade fazendo pedaços disso" — o que indica demanda, mas também concorrência já especializada. Não há validação de que o próprio usuário (ou qualquer terceiro) usaria a versão v1 semana após semana antes de qualquer decisão de arquitetura multi-jogo, simulação ou marca ter sido tomada.
4. **Processo desproporcional ao estágio e ao tamanho da equipe.** DDD, Clean Architecture, Event-Driven, três repositórios, dez ADRs e um fluxo de governança com RFC são práticas de equipes de 15-20 pessoas em produtos com tração. Aplicadas a um projeto pré-MVP, sem usuários, provavelmente com um único desenvolvedor, o custo de manutenção do processo passa a exceder o valor entregue.
5. **Nenhuma versão usada.** Depois de todo o processo documental, o produto ainda não existe em nenhuma forma testável — nem a versão mínima original (planilha/tela de 1 aba). O padrão observado na conversa é de escalonamento contínuo de ambição a cada resposta, sem nenhum ponto de checagem de realidade ("isso ainda cabe no que consigo construir e manter sozinho?").

## Decisão

O projeto deve prosseguir, porém sob um processo revisado que inverte a ordem seguida até aqui: validar antes de arquitetar, construir antes de documentar em excesso.

1. **Construir a v0 em dias, não meses.** A versão original (uma tela/planilha com os ~15 campos citados no início da conversa + um punhado de regras simples de recomendação) deve ser construída e usada pelo próprio usuário por 3-4 semanas antes de qualquer novo documento de arquitetura ser escrito.
2. **Resolver empiricamente a questão de dados antes de comprometer o roadmap a ela.** Uma sessão prática com mitmproxy/Charles + emulador Android responde em horas o que a especulação não resolveu em semanas. O resultado dessa investigação decide se "conector automático" entra no roadmap e em que prazo.
3. **Avaliar o risco legal antes de construir qualquer conector por engenharia reversa.** Decisão explícita — aceitar o risco, mitigar (ex.: apenas leitura, rate limit, sem automação de gameplay) ou descartar essa via — antes de investir engenharia nela.
4. **Congelar o restante do escopo "enterprise" até existir um usuário validando a v0.** Simulation Engine, Confidence Engine, Prediction Engine, plataforma multi-jogo, arquitetura de marca, DDD/Event-Driven formal e o fluxo de governança RFC ficam registrados como *Future Considerations*, não como próxima sprint.
5. **Manter os quatro pontos fortes identificados acima** desde o desenho inicial do banco de dados e do motor de regras — eles custam pouco agora e evitam retrabalho real mais tarde, ao contrário da cerimônia arquitetural.

## Consequências

**Positivas:** ciclo de feedback real em dias em vez de meses; risco técnico e legal mais importante do projeto resolvido cedo, quando ainda é barato mudar de direção; arquitetura cresce a partir de necessidade comprovada, não de especulação; menor custo de manutenção de processo para uma equipe pequena.

**Trade-offs aceitos:** o projeto renuncia, por ora, à ambição de "plataforma multi-jogo" e "produto pronto para abrir para a comunidade" como objetivo imediato — essas permanecem como visão de longo prazo (registrada no VISION-001), não como requisito do próximo incremento.

## Open Questions

- O conector de dados será viável tecnicamente e aceitável do ponto de vista de risco/ToS? (Responder via investigação prática, não teórica.)
- Qual é a definição mínima de "valor" para a v0 — que perguntas ela precisa responder corretamente para justificar continuar?
- Quem, além do próprio usuário, validará a v0 antes de decisões de escopo maiores?

## Next Steps

Com este ADR aprovado, o próximo passo é estruturar o projeto seguindo a ordem proposta: (1) v0 funcional com importação manual, (2) validação de uso real, (3) investigação prática de dados, (4) só então retomar os documentos de arquitetura ampliada (Vision v1, PRD, NFR, ADRs 001+) com escopo ajustado a essa decisão.
