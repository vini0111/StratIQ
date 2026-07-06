// Edge Function: analyze-checkin
//
// Análise por IA sob demanda para o campo "dúvida do dia" (ver
// docs/BACKLOG-v1.md, nona rodada). Princípio arquitetural do projeto desde
// o início ("VISION"/ADR-000): o Strategy Engine decide, a IA só explica o
// que o motor já concluiu — nunca o contrário. Por isso esta function NÃO
// recomputa o motor server-side: o cliente já rodou strategyEngine.ts
// (fonte única de verdade) e envia aqui só o resultado (cards que
// dispararam + números relevantes) para a IA comentar em cima disso. Isso
// evita duplicar/dessincronizar a lógica do motor entre cliente e servidor.
//
// A chave da API da Anthropic fica só aqui (secret do Supabase), nunca no
// navegador. Deploy: `supabase functions deploy analyze-checkin`.
// Secret necessário: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
// (o usuário precisa gerar essa chave em console.anthropic.com).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001'

interface FiredCard {
  name: string
  priority: string
  recommendation: string
  explanation: string
}

interface AnalyzeRequest {
  snapshotId: string
  question: string
  // Subconjunto de derived + campos crus relevantes, já calculados pelo
  // cliente via strategyEngine.ts — não recalculado aqui de propósito.
  contextSummary: Record<string, unknown>
  firedCards: FiredCard[]
}

function buildSystemPrompt(): string {
  return [
    'Você é um analista que EXPLICA decisões já tomadas por um motor de regras determinístico (Strategy Cards) dentro do StratIQ, um app de apoio à decisão para o jogo Whiteout Survival.',
    'Regras rígidas:',
    '1. Você NUNCA decide nada por conta própria nem inventa recomendações que não estejam fundamentadas nos dados fornecidos (as cards que dispararam e os números do contexto). O motor decide; você só explica e contextualiza.',
    '2. Se a pergunta do jogador for sobre algo que os dados fornecidos não cobrem (ex.: equipamento de herói, que este app ainda não rastreia), diga honestamente que não há esse dado disponível em vez de arriscar um palpite.',
    '3. Responda em português, de forma direta e concisa (poucos parágrafos curtos, sem listas longas).',
    '4. Sempre que citar um número, baseie-se exatamente no contexto fornecido — não invente valores.',
  ].join('\n')
}

function buildUserPrompt(req: AnalyzeRequest): string {
  const cardsText = req.firedCards.length
    ? req.firedCards
        .map((c) => `- [${c.priority}] ${c.name}: "${c.recommendation}" — ${c.explanation}`)
        .join('\n')
    : '(nenhuma Strategy Card disparou neste check-in)'

  return [
    'Contexto do check-in atual (calculado pelo motor, já confiável):',
    JSON.stringify(req.contextSummary, null, 2),
    '',
    'Recomendações que o motor já gerou para este check-in:',
    cardsText,
    '',
    `Dúvida do jogador: "${req.question}"`,
    '',
    'Responda a dúvida do jogador usando só o que está acima.',
  ].join('\n')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Sem autenticação.' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // Cliente Supabase escopado ao JWT do usuário — respeita as políticas de
    // RLS já existentes, não usa a service role key.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Usuário não autenticado.' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as AnalyzeRequest
    if (!body.snapshotId || !body.question) {
      return new Response(JSON.stringify({ error: 'snapshotId e question são obrigatórios.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY não configurada nos secrets do Supabase.' }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 500,
        system: buildSystemPrompt(),
        messages: [{ role: 'user', content: buildUserPrompt(body) }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      console.error('Erro na API da Anthropic:', errText)
      return new Response(JSON.stringify({ error: 'Falha ao chamar a IA.' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    const anthropicData = await anthropicRes.json()
    const answer: string = anthropicData.content?.[0]?.text ?? '(sem resposta da IA)'

    const { error: insertError } = await supabase.from('ai_analyses').insert({
      profile_id: userData.user.id,
      snapshot_id: body.snapshotId,
      question: body.question,
      answer,
      model: ANTHROPIC_MODEL,
    })
    if (insertError) {
      console.error('Falha ao salvar análise:', insertError)
      // Não falha a resposta ao usuário por causa disso — a análise já foi
      // gerada, só não ficou salva no histórico.
    }

    return new Response(JSON.stringify({ answer }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Erro inesperado em analyze-checkin:', err)
    return new Response(JSON.stringify({ error: 'Erro inesperado.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
