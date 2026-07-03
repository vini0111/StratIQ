# ADR-001 — Conector Próprio: Ainda Não

**Document ID:** ADR-001
**Version:** 1.0
**Status:** 🟢 Approved
**Owner:** Product / Systems Architecture
**Related:** ADR-000, RESEARCH-001, BACKLOG-v1
**Last Updated:** 2026-07-03

---

## Contexto

Depois de confirmar que a API pública do WOS Control não devolve dados suficientes (só fornalha, aliança e estado — nenhum dos campos estratégicos: VIP, gemas, poder, heróis, pesquisa, construção, aceleradores), a pergunta natural foi: então vale a pena investir em construir nossa própria API/conector, via engenharia reversa do protocolo do jogo?

Há também uma preocupação legítima levantada: aprofundar o motor de regras usando só a conta do usuário-fundador parece um esforço que só beneficiaria essa conta específica.

## Decisão

Não construir um conector próprio agora. Dois motivos independentes, cada um suficiente sozinho.

**1. O risco não mudou desde o RESEARCH-001.** Engenharia reversa da API privada do jogo continua sendo violação de ToS, com risco real de banimento da conta usada para testar/validar o produto — exatamente a conta que sustenta toda a validação da v0 até agora. O protocolo pode mudar a qualquer atualização do jogo, sem aviso, exigindo manutenção contínua de um único desenvolvedor. Nada disso mudou; só descartamos uma alternativa mais barata (WOS Control), o que não altera o cálculo de risco da alternativa mais cara.

**2. Não resolve o problema relatado.** O feedback foi "recomendações genéricas". Isso é causado pela profundidade do motor de regras (12 Strategy Cards simples), não pela fonte do dado. Automatizar a coleta faria a mesma pergunta ser respondida com a mesma regra rasa, só que com dados atualizados automaticamente. Construir uma API própria resolveria atrito de digitação — não resolveria a causa que mais pesou no feedback.

## Sobre a preocupação de "só pensar na minha conta"

Essa preocupação é válida para *dados*, mas não se aplica a *regras*. A arquitetura já separa as duas coisas desde o ADR-002 original (dados pertencem ao jogador, conhecimento pertence à plataforma):

- Os campos `profile.financialProfile`, `profile.objective`, e os campos do snapshot são genéricos — qualquer jogador que preencher os mesmos campos recebe as mesmas regras aplicadas ao seu próprio contexto. Nenhuma Strategy Card está amarrada ao FID, estado ou aliança do fundador.
- O que precisa aprofundar não é "a conta do Vinícius" — é o **conhecimento do jogo** (gerações de heróis, prioridades de pesquisa, mecânica de eventos, fases do servidor). Esse conhecimento é o mesmo para qualquer jogador de Whiteout Survival, independente de quem preenche o formulário.

Ou seja: aprofundar o motor de regras é trabalho que beneficia qualquer usuário futuro, não só a conta de teste atual. É exatamente o oposto de "pensar só na minha conta" — é investir no ativo (Knowledge Base) que a VISION.md original identificou como o verdadeiro patrimônio da plataforma.

## Quando reconsiderar

Registrar como gatilhos explícitos para revisitar esta decisão:

- O motor de regras foi aprofundado com conhecimento real do jogo e o usuário (ou outros testadores) ainda apontam atrito de preenchimento manual como o principal motivo para não usar toda semana.
- Existem outros usuários reais (não só o fundador) validando que usariam o produto regularmente se a coleta fosse automática.
- Há musculo (tempo/equipe) suficiente para absorver manutenção contínua de uma integração não oficial que pode quebrar a qualquer atualização do jogo.

Sem pelo menos um desses sinais, construir a API própria é investir na coisa errada no momento errado.

## Consequência

Próximo passo aprovado: aprofundar a Knowledge Base / Strategy Cards com conhecimento real do jogo (heróis, pesquisa, eventos, fases de servidor), mantendo entrada manual. Conector próprio permanece registrado como opção futura, não descartada — apenas não priorizada agora.
