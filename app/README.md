# StratIQ — v0

Nome do produto: **StratIQ** (renomeado de "Commander MVP" em 2026-07-03 — ver `docs/ADR-002-Rename-StratIQ.md`).

Implementação da v0 descrita em [`../docs/MVP-001-Escopo-e-Estrutura.md`](../docs/MVP-001-Escopo-e-Estrutura.md): formulário semanal de 2 minutos, um Decision Center com semáforo + recomendações, e 20 Strategy Cards como dados (não código), calibradas com mecânica real do jogo — ver [`../docs/KNOWLEDGE-001-Game-Mechanics.md`](../docs/KNOWLEDGE-001-Game-Mechanics.md). Sem conectores automáticos — ver [`../docs/RESEARCH-001-Data-Acquisition-Findings.md`](../docs/RESEARCH-001-Data-Acquisition-Findings.md) e [`../docs/ADR-001-Own-Connector-Not-Yet.md`](../docs/ADR-001-Own-Connector-Not-Yet.md) para o porquê.

Validado: `npx tsc -b` e `npx vite build` rodam sem erros (checado em ambiente limpo).

## Stack

React (Vite) + TypeScript + Supabase (Auth + Postgres) + Vercel (deploy).

## Setup

**1. Criar o projeto no Supabase**

Crie um projeto em [supabase.com](https://supabase.com). No SQL Editor, rode o conteúdo de `supabase/schema.sql` — cria as tabelas `profiles` e `weekly_snapshots` com Row Level Security (cada usuário só vê os próprios dados). Se o projeto já existia antes de uma mudança de schema, rode também os arquivos em `supabase/migrations/`, em ordem.

Em Authentication → Providers, deixe o Email (Magic Link) habilitado — é o único método de login usado nesta v0, para não exigir gestão de senha.

**2. Configurar variáveis de ambiente**

Passo a passo:

1. Dentro da pasta `app/`, duplique o arquivo `.env.example` e renomeie a cópia para `.env`.
   - Via terminal (Mac/Linux ou Git Bash no Windows): `cp .env.example .env`
   - Via terminal (PowerShell): `Copy-Item .env.example .env`
   - Ou manualmente: copie e cole o arquivo `.env.example` no explorador de arquivos, renomeie a cópia para `.env`.
2. No painel do Supabase, com o projeto aberto, use o botão verde **Connect** (canto superior direito — o mesmo que aparece no print que você mandou antes). Ele abre um diálogo com a **Project URL** e as chaves da API já prontas para copiar. Alternativa: menu lateral → ícone de engrenagem (**Project Settings**) → **API Keys**.
3. Copie o valor de **Project URL** (algo como `https://xxxxxxxxxxxxxxxx.supabase.co`) e cole em `VITE_SUPABASE_URL`.
4. Copie a chave pública do lado do cliente e cole em `VITE_SUPABASE_ANON_KEY`:
   - Se o projeto usa o sistema novo de chaves, é a **Publishable key** (aba "API Keys").
   - Se ainda usa o sistema antigo, é a **anon / public key** (aba "Legacy API Keys").
   - Ambas servem para o mesmo propósito aqui — é a chave segura para expor no navegador, nunca a `service_role`/`secret`.
5. Salve o arquivo `.env`. Ele deve ficar assim (com seus valores reais, sem aspas):

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O `.env` já está no `.gitignore` — não será versionado nem enviado ao repositório.

**3. Instalar e rodar localmente**

```
npm install
npm run dev
```

**4. Build de produção**

```
npm run build
npm run preview
```

**5. Deploy no Vercel**

Conecte o repositório no Vercel, aponte o diretório raiz para `app/`, e configure as mesmas duas variáveis de ambiente (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) em Project Settings → Environment Variables.

## Estrutura

```
app/
├── src/
│   ├── types/            tipos centrais (Profile, WeeklySnapshot, StrategyCard)
│   ├── lib/
│   │   ├── strategyEngine.ts   avalia Strategy Cards contra o snapshot atual
│   │   ├── semaphore.ts        calcula o semáforo (Crescimento/Economia/Batalha)
│   │   ├── mappers.ts          conversão snake_case (Supabase) <-> camelCase (app)
│   │   └── supabaseClient.ts
│   ├── data/strategyCards/     as 20 regras da v0, uma por arquivo JSON
│   ├── components/             SnapshotForm, DecisionCenter, SemaphoreBar, etc.
│   └── pages/                  Login, ProfileSetup, Dashboard
└── supabase/schema.sql
```

## Adicionar uma nova regra

Criar um novo arquivo em `src/data/strategyCards/`, seguindo o formato dos existentes, e importá-lo em `src/data/strategyCards/index.ts`. Não é necessário alterar `strategyEngine.ts` — esse é o ponto central da arquitetura "regras como dados" (ver ADR-000 / MVP-001). Se a regra usa um número ou nome específico do jogo (custo de evento, herói, prioridade), registre a fonte em `docs/KNOWLEDGE-001-Game-Mechanics.md` e cite-a no campo `explanation` do card.

## O que falta antes de considerar a v0 "pronta para uso real"

- Ajustar os thresholds das regras e do semáforo depois de mais uso real (as regras de heróis específicos e mecânica de eventos vêm de guias externos — ver fontes em KNOWLEDGE-001 — mas ainda não foram validadas contra a experiência real do jogador).
- Decidir se o onboarding (`ProfileSetup`) precisa de mais campos ou se está bom como está — ver Open Questions em MVP-001.
- Nenhum teste automatizado ainda; dado o escopo pequeno, validação manual foi considerada suficiente para a v0.
