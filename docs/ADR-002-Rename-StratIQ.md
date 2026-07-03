# ADR-002 — Rename para StratIQ e Escopo do Redesign Visual

**Document ID:** ADR-002
**Version:** 1.0
**Status:** 🟢 Approved
**Owner:** Product / Systems Architecture
**Related:** VISION-001, BRAND_ARCHITECTURE (mencionado na transcrição original, nunca formalizado)
**Last Updated:** 2026-07-03

---

## Contexto

O usuário trouxe uma identidade visual completa (nome, tagline, paleta de cores, tipografia, ícone, mockups de tela) para o projeto, até então rodando sob o codinome interno "Commander MVP" (ou "Whiteout Commander" na documentação de visão original). A conversa fundacional do projeto já havia previsto esse momento: manter um codinome interno durante a Fase 0 e decidir a marca só quando a arquitetura estivesse consolidada e o MVP funcional — ver `Vamos avançar com a proposta de Fase 0` na transcrição original. Como a v0 já está em uso real (múltiplas rodadas de check-in e ajuste), este é um momento razoável para formalizar o nome.

## Decisão

1. **Nome do produto passa a ser StratIQ.** Aplicado em: título do app, README, `package.json`, wordmark nas três telas (Login, ProfileSetup, Dashboard).
2. **Paleta e tipografia do moodboard aplicadas à v0 existente.** Cores (`#00b5ff` accent, `#0d1b2a`/`#14233a`/`#1b2b45` como fundo/superfícies, `#e6edf3` texto, `#8fa3b8` texto secundário) e tipografia (Exo 2 para títulos, Raleway para corpo) atualizadas em `src/index.css`. O ícone real (PNG 1254×1254, fornecido pelo usuário em 2026-07-03) está em `app/public/Logo.png`; uma versão redimensionada para uso na UI/favicon (256×256, ~64KB) foi gerada em `app/public/logo-icon.png` — o arquivo original era pesado demais (1.5MB) para ser servido em cada carregamento de página. `src/components/Brand.tsx` usa `logo-icon.png` diretamente, substituindo a aproximação SVG inicial.
3. **A navegação multi-página do mockup (Dashboard/Análises/Batalhas/Aliança/Eventos/Configurações como telas separadas) NÃO foi implementada agora.** O mockup mostra uma visão de produto madura, consistente com o roadmap de longo prazo já registrado no VISION.md original — mas a v0 continua com a decisão do MVP-001 de uma única tela (Decision Center). Motivo: essa navegação expandida é estrutura de apresentação para funcionalidades que ainda não existem (análises, batalhas, aliança como domínios separados) — construir a navegação antes do conteúdo geraria telas vazias, não valor. Mesma disciplina do ADR-000: validar o núcleo antes de expandir a superfície.

## Consequências

**Positivas:** identidade visual consistente aplicada sem risco — mudança é puramente de apresentação (CSS, texto, um componente novo), não toca modelo de dados, motor de regras ou Supabase. Zero risco de regressão funcional.

**Adiado, não descartado:** a estrutura de navegação de página única passa a ter um limite natural — se a lista de Strategy Cards continuar crescendo (hoje 20) e a tela ficar longa demais, a divisão em seções (mesmo sem art nova) pode ser reconsiderada. Isso deve vir como necessidade validada de uso, não como réplica do mockup.

## Nota sobre fidelidade visual

Resolvido em 2026-07-03: o ícone real foi fornecido e está em uso (`app/public/Logo.png` original + `logo-icon.png` otimizado).

## Nota operacional — pasta do projeto renomeada

Durante esta sessão, a pasta local do projeto foi renomeada de `Plataforma de inteligência para jogos de estratégia persistentes` para `StratIQ`, o que derrubou temporariamente a conexão de arquivos. Reconectada ao novo caminho sem perda de dados (`.git`, `app/`, `docs/` intactos). Fica registrado porque outras integrações locais (variáveis de ambiente, atalhos, scripts) que referenciem o caminho antigo por nome também precisam ser atualizadas manualmente.
