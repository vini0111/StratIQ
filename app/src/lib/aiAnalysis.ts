import { supabase } from './supabaseClient'
import type { StrategyCard } from '../types'

// Chama a Edge Function analyze-checkin — nunca fala com a API da Anthropic
// direto do navegador (a chave fica só no servidor). Ver
// supabase/functions/analyze-checkin/index.ts e docs/BACKLOG-v1.md (nona
// rodada) para o desenho completo.

export interface AiAnalysisRecord {
  id: string
  profileId: string
  snapshotId: string
  question: string
  answer: string
  model: string
  createdAt: string
}

function aiAnalysisFromRow(row: any): AiAnalysisRecord {
  return {
    id: row.id,
    profileId: row.profile_id,
    snapshotId: row.snapshot_id,
    question: row.question,
    answer: row.answer,
    model: row.model,
    createdAt: row.created_at,
  }
}

export async function fetchLatestAiAnalysis(snapshotId: string): Promise<AiAnalysisRecord | null> {
  const { data, error } = await supabase
    .from('ai_analyses')
    .select('*')
    .eq('snapshot_id', snapshotId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return aiAnalysisFromRow(data)
}

// Histórico completo de perguntas/respostas do perfil (não só a mais
// recente por check-in) — pedido explícito na décima quinta rodada de
// feedback: poder consultar conversas anteriores com a IA, não só a última.
// Filtra por profile_id direto (a policy ai_analyses_select_own já cobre
// isso), sem precisar dar join com snapshots.
export async function fetchAiAnalysisHistory(profileId: string): Promise<AiAnalysisRecord[]> {
  const { data, error } = await supabase
    .from('ai_analyses')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map(aiAnalysisFromRow)
}

export async function deleteAiAnalysis(id: string): Promise<boolean> {
  const { error } = await supabase.from('ai_analyses').delete().eq('id', id)
  return !error
}

export async function requestAiAnalysis(
  snapshotId: string,
  question: string,
  contextSummary: Record<string, unknown>,
  firedCards: StrategyCard[]
): Promise<{ answer: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke('analyze-checkin', {
    body: {
      snapshotId,
      question,
      contextSummary,
      firedCards: firedCards.map((c) => ({
        name: c.name,
        priority: c.priority,
        recommendation: c.recommendation,
        explanation: c.explanation,
      })),
    },
  })

  if (error) {
    return { error: error.message || 'Falha ao chamar a análise por IA.' }
  }
  if (data?.error) {
    return { error: data.error }
  }
  return { answer: data.answer as string }
}
