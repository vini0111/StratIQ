import { useEffect, useMemo, useState } from 'react'
import type { Profile, WeeklySnapshot } from '../types'
import { supabase } from '../lib/supabaseClient'
import { snapshotFromRow, snapshotToRow } from '../lib/mappers'
import { buildContext, computeStateAgeDays, evaluateStrategyCards } from '../lib/strategyEngine'
import { computeSemaphore } from '../lib/semaphore'
import { strategyCards } from '../data/strategyCards'
import SnapshotForm from '../components/SnapshotForm'
import DecisionCenter from '../components/DecisionCenter'
import HistorySparkline from '../components/HistorySparkline'
import HistoryTable from '../components/HistoryTable'
import Brand from '../components/Brand'

export default function Dashboard({
  profile,
  onEditProfile,
  onOpenWiki,
}: {
  profile: Profile
  onEditProfile: () => void
  onOpenWiki: () => void
}) {
  const [snapshots, setSnapshots] = useState<WeeklySnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    loadSnapshots()
  }, [])

  async function loadSnapshots() {
    setLoading(true)
    // Ordena por created_at (timestamp completo), não por snapshot_date.
    // snapshot_date é só a data escolhida no formulário (granularidade de
    // dia) — com múltiplos check-ins no mesmo dia (comum em teste), ordenar
    // só por ela não garante qual é realmente o mais recente. created_at
    // sempre reflete a ordem real de inserção.
    const { data, error } = await supabase
      .from('weekly_snapshots')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Falha ao carregar snapshots:', error)
      setError(`Não foi possível carregar seus dados: ${error.message}`)
    } else {
      setSnapshots((data ?? []).map(snapshotFromRow))
    }
    setLoading(false)
  }

  async function handleDeleteSnapshot(id: string) {
    setError(null)
    const { error } = await supabase.from('weekly_snapshots').delete().eq('id', id)
    if (error) {
      console.error('Falha ao excluir snapshot:', error)
      setError(`Não foi possível excluir: ${error.message}`)
      return
    }
    await loadSnapshots()
  }

  async function handleNewSnapshot(draft: Omit<WeeklySnapshot, 'id' | 'profileId' | 'createdAt'>) {
    setSubmitting(true)
    setError(null)
    setSavedAt(null)
    const { error } = await supabase
      .from('weekly_snapshots')
      .insert(snapshotToRow(draft, profile.id))

    setSubmitting(false)
    if (error) {
      console.error('Falha ao salvar snapshot:', error)
      setError(`Não foi possível salvar: ${error.message}`)
      return
    }
    await loadSnapshots()
    setSavedAt(new Date().toLocaleTimeString('pt-BR'))
  }

  const latest = snapshots[snapshots.length - 1] ?? null
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null

  const { semaphore, recommendations } = useMemo(() => {
    if (!latest) return { semaphore: null, recommendations: [] }
    const context = buildContext(latest, profile, previous, snapshots)
    return {
      semaphore: computeSemaphore(context),
      recommendations: evaluateStrategyCards(strategyCards, context),
    }
  }, [latest, previous, profile, snapshots])

  // Idade do estado independe de haver check-ins — só depende da data
  // informada no perfil. Calculada à parte para aparecer mesmo antes do
  // primeiro check-in. Ver docs/BACKLOG-v1.md (quinta rodada de feedback).
  const stateAgeDays = computeStateAgeDays(profile.stateFoundedDate, new Date())

  return (
    <div>
      <Brand size={24} />
      <p className="muted" style={{ marginTop: 6, marginBottom: 20 }}>
        Estado {profile.stateNumber} · {profile.alliance || 'sem aliança'}
        {stateAgeDays !== null && ` · dia ${stateAgeDays} do estado`} ·{' '}
        <button
          type="button"
          onClick={onEditProfile}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          editar perfil
        </button>{' '}
        ·{' '}
        <button
          type="button"
          onClick={onOpenWiki}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            padding: 0,
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          guia e wiki
        </button>
      </p>

      {error && (
        <div className="card" style={{ borderColor: 'var(--red)' }}>
          <strong style={{ color: 'var(--red)' }}>Erro ao salvar/carregar</strong>
          <p className="muted">{error}</p>
        </div>
      )}

      {savedAt && !error && (
        <div className="card" style={{ borderColor: 'var(--green)' }}>
          <strong style={{ color: 'var(--green)' }}>✓ Atualização salva às {savedAt}</strong>
        </div>
      )}

      {!loading && latest && semaphore && (
        <DecisionCenter semaphore={semaphore} recommendations={recommendations} />
      )}

      {!loading && !latest && (
        <div className="card">
          <p className="muted">
            Ainda sem check-ins. Preencha o primeiro abaixo para ver suas recomendações.
          </p>
        </div>
      )}

      {snapshots.length > 1 && (
        <div className="card">
          <h3>Evolução</h3>
          <HistorySparkline snapshots={snapshots} field="furnaceLevel" label="Fornalha" />
          <HistorySparkline snapshots={snapshots} field="vipLevel" label="VIP" />
          <HistorySparkline snapshots={snapshots} field="gems" label="Gemas" />
          <HistorySparkline snapshots={snapshots} field="power" label="Poder" />
          <HistorySparkline snapshots={snapshots} field="totalTroops" label="Tropas (total)" />
        </div>
      )}

      {snapshots.length > 0 && (
        <div className="card">
          <h3>Histórico</h3>
          <HistoryTable snapshots={snapshots} onDelete={handleDeleteSnapshot} />
        </div>
      )}

      {!loading && (
        <SnapshotForm
          profile={profile}
          lastSnapshot={latest}
          onSubmit={handleNewSnapshot}
          submitting={submitting}
        />
      )}

      <button className="secondary" onClick={() => supabase.auth.signOut()}>
        Sair
      </button>
    </div>
  )
}
