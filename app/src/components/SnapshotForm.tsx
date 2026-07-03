import { useState } from 'react'
import type { HeroEntry, Profile, WeeklySnapshot } from '../types'
import { KNOWN_BUILDINGS, KNOWN_EVENTS, KNOWN_RESEARCH } from '../data/knownOptions'
import AcceleratorInput from './AcceleratorInput'

type DraftSnapshot = Omit<WeeklySnapshot, 'id' | 'profileId' | 'createdAt'>

const emptyHero: HeroEntry = { name: '', level: 1, stars: 1 }

const blankDraft: DraftSnapshot = {
  snapshotDate: new Date().toISOString().slice(0, 10),
  furnaceLevel: 1,
  vipLevel: 0,
  vipProgressPct: 0,
  gems: 0,
  accelGeneralDays: 0,
  accelTrainingDays: 0,
  accelConstructionDays: 0,
  accelResearchDays: 0,
  accelHealingDays: 0,
  currentEvents: [],
  power: 0,
  heroes: [{ ...emptyHero }],
  currentResearch: '',
  currentBuilding: '',
  currentBuilding2: '',
  weeklyQuestion: '',
}

// Pré-preenche com os dados persistentes do último check-in (fornalha, VIP,
// gemas, poder, filas, heróis) — o jogador só edita o que realmente mudou.
// Aceleradores e evento NÃO carregam do anterior: são "estoque atual" e
// "o que está rolando esta semana", não algo que persiste igual.
function buildInitialDraft(last: WeeklySnapshot | null): DraftSnapshot {
  if (!last) return blankDraft
  return {
    ...blankDraft,
    furnaceLevel: last.furnaceLevel,
    vipLevel: last.vipLevel,
    vipProgressPct: last.vipProgressPct,
    gems: last.gems,
    power: last.power,
    heroes: last.heroes.length > 0 ? last.heroes.map((h) => ({ ...h })) : [{ ...emptyHero }],
    currentResearch: last.currentResearch,
    currentBuilding: last.currentBuilding,
    currentBuilding2: last.currentBuilding2 ?? '',
  }
}

export default function SnapshotForm({
  profile,
  lastSnapshot,
  onSubmit,
  submitting,
}: {
  profile: Profile
  lastSnapshot: WeeklySnapshot | null
  onSubmit: (draft: DraftSnapshot) => void
  submitting: boolean
}) {
  const [draft, setDraft] = useState<DraftSnapshot>(() => buildInitialDraft(lastSnapshot))
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [customEventsText, setCustomEventsText] = useState('')

  function update<K extends keyof DraftSnapshot>(key: K, value: DraftSnapshot[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function toggleEvent(name: string) {
    setSelectedEvents((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    )
  }

  function updateHero(index: number, patch: Partial<HeroEntry>) {
    setDraft((prev) => ({
      ...prev,
      heroes: prev.heroes.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    }))
  }

  function addHero() {
    if (draft.heroes.length >= 6) return
    setDraft((prev) => ({ ...prev, heroes: [...prev.heroes, { ...emptyHero }] }))
  }

  function removeHero(index: number) {
    setDraft((prev) => ({ ...prev, heroes: prev.heroes.filter((_, i) => i !== index) }))
  }

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault()
        const customEvents = customEventsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
        onSubmit({
          ...draft,
          currentEvents: [...selectedEvents, ...customEvents],
          heroes: draft.heroes.filter((h) => h.name.trim().length > 0),
        })
      }}
    >
      <h3>Atualização semanal</h3>
      <p className="muted">
        {lastSnapshot
          ? 'Já preenchemos com os dados do seu último check-in — só ajuste o que mudou.'
          : 'Menos de 2 minutos. Só o que muda a recomendação.'}
      </p>

      <label>Data</label>
      <input
        type="date"
        value={draft.snapshotDate}
        onChange={(e) => update('snapshotDate', e.target.value)}
      />

      <label>Eventos ativos (pode marcar mais de um)</label>
      <div style={{ marginBottom: 12 }}>
        {KNOWN_EVENTS.map((ev) => (
          <label
            key={ev}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
          >
            <input
              type="checkbox"
              style={{ width: 'auto', margin: 0 }}
              checked={selectedEvents.includes(ev)}
              onChange={() => toggleEvent(ev)}
            />
            {ev}
          </label>
        ))}
      </div>
      <label>Outros eventos (separados por vírgula, opcional)</label>
      <input
        type="text"
        value={customEventsText}
        onChange={(e) => setCustomEventsText(e.target.value)}
      />

      <div className="grid-2">
        <div>
          <label>Nível da Fornalha</label>
          <input
            type="number"
            value={draft.furnaceLevel}
            onChange={(e) => update('furnaceLevel', Number(e.target.value))}
          />
        </div>
        <div>
          <label>Nível VIP</label>
          <input
            type="number"
            value={draft.vipLevel}
            onChange={(e) => update('vipLevel', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid-2">
        <div>
          <label>Progresso VIP (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={draft.vipProgressPct}
            onChange={(e) => update('vipProgressPct', Number(e.target.value))}
          />
        </div>
        <div>
          <label>Gemas</label>
          <input
            type="number"
            value={draft.gems}
            onChange={(e) => update('gems', Number(e.target.value))}
          />
        </div>
      </div>

      <label>Poder</label>
      <input
        type="number"
        value={draft.power}
        onChange={(e) => update('power', Number(e.target.value))}
      />
      <p className="muted" style={{ marginTop: -8, fontSize: 12 }}>
        Se a fornalha estiver em upgrade, isso já aparece em "Construção atual" abaixo — não é
        preciso indicar progresso separado.
      </p>

      <label>Aceleradores disponíveis agora</label>
      <p className="muted" style={{ marginTop: -8, marginBottom: 8, fontSize: 12 }}>
        Mesma ordem do jogo. Escolha a unidade (dias, horas ou minutos) e informe a quantidade
        nela — não precisa converter.
      </p>
      <AcceleratorInput label="Aceleração Geral" onChange={(v) => update('accelGeneralDays', v)} />
      <AcceleratorInput
        label="Treinamento de tropas"
        onChange={(v) => update('accelTrainingDays', v)}
      />
      <AcceleratorInput
        label="Construção"
        onChange={(v) => update('accelConstructionDays', v)}
      />
      <AcceleratorInput label="Pesquisa" onChange={(v) => update('accelResearchDays', v)} />
      <AcceleratorInput label="Cura" onChange={(v) => update('accelHealingDays', v)} />

      <div className="grid-2">
        <div>
          <label>Construção atual {profile.hasSecondBuilder ? '(1º construtor)' : ''}</label>
          <input
            type="text"
            list="buildings-list"
            placeholder="Vazio = fila ociosa"
            value={draft.currentBuilding}
            onChange={(e) => update('currentBuilding', e.target.value)}
          />
        </div>
        <div>
          <label>Pesquisa atual</label>
          <input
            type="text"
            list="research-list"
            placeholder="Vazio = fila ociosa"
            value={draft.currentResearch}
            onChange={(e) => update('currentResearch', e.target.value)}
          />
        </div>
      </div>

      {profile.hasSecondBuilder && (
        <>
          <label>Construção atual (2º construtor)</label>
          <input
            type="text"
            list="buildings-list"
            placeholder="Vazio = fila ociosa"
            value={draft.currentBuilding2 ?? ''}
            onChange={(e) => update('currentBuilding2', e.target.value)}
          />
        </>
      )}

      <datalist id="buildings-list">
        {KNOWN_BUILDINGS.map((b) => (
          <option key={b} value={b} />
        ))}
      </datalist>
      <datalist id="research-list">
        {KNOWN_RESEARCH.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <label>Heróis favoritos</label>
      {draft.heroes.map((hero, i) => (
        <div className="hero-row" key={i}>
          <input
            type="text"
            placeholder="Nome"
            value={hero.name}
            onChange={(e) => updateHero(i, { name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Nível"
            value={hero.level}
            onChange={(e) => updateHero(i, { level: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Estrelas"
            min={1}
            max={5}
            value={hero.stars}
            onChange={(e) => updateHero(i, { stars: Number(e.target.value) })}
          />
          <button type="button" className="secondary" onClick={() => removeHero(i)}>
            Remover
          </button>
        </div>
      ))}
      {draft.heroes.length < 6 && (
        <button type="button" className="secondary" onClick={addHero} style={{ marginBottom: 12 }}>
          + herói
        </button>
      )}

      <label>Dúvida da semana (opcional)</label>
      <textarea
        rows={2}
        value={draft.weeklyQuestion}
        onChange={(e) => update('weeklyQuestion', e.target.value)}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : 'Salvar atualização'}
      </button>
    </form>
  )
}
