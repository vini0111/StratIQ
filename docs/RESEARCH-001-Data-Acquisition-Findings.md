# RESEARCH-001 — Aquisição de Dados: Findings Técnicos e Legais

**Document ID:** RESEARCH-001
**Version:** 1.0
**Status:** 🟢 Approved
**Owner:** Product / Systems Architecture
**Related:** ADR-000 (Open Question #1), Fase 0.1 do conceito original
**Last Updated:** 2026-07-02

---

## Pergunta

"Dá para obter dados do jogo automaticamente, e é legal fazer isso?" — levantada no início do projeto e deixada em aberto no ADR-000.

## Método

Pesquisa em fontes públicas (canais oficiais da Century Games, repositórios da comunidade, ferramentas de terceiros em operação) em julho de 2026. **Não é** uma auditoria técnica de primeira mão (captura de tráfego com mitmproxy, engenharia reversa de APK) — é uma checagem do que já está publicamente demonstrado, o suficiente para substituir a especulação do documento original por evidência.

## Findings técnicos

1. Não existe API pública oficial da Century Games para dados de jogador, estado, aliança ou ranking. Isso confirma a conclusão original.
2. Existe pelo menos um endpoint oficial documentável: `wos-giftcode-api.centurygame.com`, usado para resgate de gift codes. Recebe FID + timestamp + assinatura MD5 (salt conhecido publicamente pela comunidade) e retorna dados básicos do jogador. Isso prova que o backend do jogo é acessível via HTTP simples com autenticação por assinatura — **não** gRPC nem protocolo binário proprietário, como se especulava no documento original.
3. Existe um ecossistema de terceiros maduro construído sobre esse tipo de acesso. O WOS Control (woscontrol.com) mantém uma API pública documentada (v1) com endpoints `/player/{fid}`, `/state/{state_id}`, `/alliance`, `/transfer/{state_id}`, `/leaderboard` — exatamente os dados que este projeto precisaria. Está ativa em julho de 2026, com centenas de alianças usando. Vários bots Discord/Telegram open-source no GitHub replicam esse mesmo acesso de forma independente.
4. **Conclusão técnica:** a pergunta "dá para obter automaticamente?" já está respondida empiricamente pela comunidade — **sim, dá**, e o caminho (HTTP + assinatura) está validado publicamente há tempo suficiente para deixar de ser tratado como incerto.

## Findings legais

1. O Terms of Service da Century Games proíbe explicitamente: (a) engenharia reversa/decompilação para extrair código-fonte ou lógica dos serviços; (b) scraping, reprodução ou redistribuição de material sem autorização por escrito; (c) desenvolvimento ou distribuição de software "auto", "macro" ou "cheat utility".
2. O enforcement documentado publicamente (avisos oficiais da Century Games) mira consistentemente em **automação de gameplay** (macros/scripts que alteram resultados de eventos) e **serviços de recarga não autorizados** — não foi encontrado nenhum caso de ação legal contra ferramentas companheiras somente-leitura.
3. Não há registro de cease-and-desist, processo ou remoção forçada contra o WOS Control ou os diversos bots de aliança, apesar de operarem publicamente e em escala há anos.
4. O próprio WOS Control já assume o risco operacional na documentação (código de erro `403 — API key banned or domain banned`), tratando bloqueio técnico como risco esperado do negócio, não como algo que os impediu de operar.

## Avaliação de risco

| Tipo de risco | Nível | Observação |
|---|---|---|
| Jurídico direto (processo, notificação formal) | Baixo | Nenhuma evidência de perseguição legal a ferramentas somente-leitura |
| Contratual (violação de ToS) | Real | O texto proíbe engenharia reversa explicitamente, independente de haver enforcement |
| Operacional (banimento de conta, bloqueio de chave/IP, quebra por mudança de protocolo) | Médio-Alto | É a única penalidade observada na prática — e a que mais importa para o planejamento |
| Dependência de terceiro (se usarmos WOS Control em vez de conector próprio) | Médio | Troca risco de engenharia reversa por risco de disponibilidade/preço/limite de terceiro |

## Conclusão

- **Dá para obter automaticamente?** Sim — tecnicamente validado pela comunidade há anos, via HTTP + assinatura, replicável.
- **É legal?** Não é autorizado pelo ToS — formalmente é violação contratual. Mas o risco real observado na prática é operacional (banimento/bloqueio), não jurídico, e a Century Games parece tolerar de fato esse ecossistema de terceiros, mesmo sem sancioná-lo oficialmente.

## Recomendação para o MVP

Não construir conector próprio por engenharia reversa no MVP — não é necessário para provar valor, e o ADR-000 já definiu que o core deve ser independente de qualquer integração automática.

- **v0/MVP:** importação manual apenas, como no conceito original de "atualização semanal em 2 minutos". Zero risco legal/operacional.
- **v1+ (opcional, só após validação de uso):** avaliar consumir a API do WOS Control como conector opcional — sem fazer engenharia reversa própria, apenas consumindo um serviço já existente e assumindo essa dependência como não-crítica (o app continua funcionando 100% no manual caso o conector caia).
- **Conector próprio:** só reconsiderar se o produto tiver tração validada e o risco operacional puder ser isolado (ex.: conta de teste dedicada, nunca a conta de produção do usuário).

## Sources

- [Terms of Service — Century Games](https://www.centurygames.com/terms-of-service/)
- [Whiteout Survival (@WOS_Global) — aviso sobre scripts/macros](https://x.com/WOS_Global/status/1873552321269162019)
- [Whiteout Survival (@WOS_Global) — aviso sobre serviços de recarga não autorizados](https://x.com/WOS_Global/status/1933343567491314050)
- [WOS Control — API Documentation](https://woscontrol.com/api-docs)
- [wos-gift-code (GitHub) — implementação aberta do endpoint de gift code](https://github.com/Crosswind/wos-gift-code)
- [Gift Code Center — Century Games](https://wos-giftcode.centurygame.com/)
