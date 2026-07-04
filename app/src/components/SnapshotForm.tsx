import { useState } from 'react'
import type { HeroEntry, Profile, WeeklySnapshot } from '../types'
import {
  KNOWN_BUILDINGS,
  KNOWN_EVENTS,
  KNOWN_HEROES,
  KNOWN_RESEARCH,
  KNOWN_TROOP_TIERS,
} from '../data/knownOptions'
import { ACCELERATOR_UNIT_LABELS, AcceleratorUnit, toDecimalDays } from '../lib/accelerators'
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
  troopsInfantry: 0,
  troopsLancer: 0,
  troopsMarksman: 0,
  highestTierTraining: '',
  weeklyQuestion: '',
}

const emptyAcceleratorAmounts = {
  general: 0,
  training: 0,
  construction: 0,
  research: 0,
  healing: 0,
}

// Pré-preenche aceleradores com o estoque do último check-in (unidade
// "dias", que é o que fica salvo internamente) — o jogador ajusta a partir
// daí em vez de partir de zero toda semana. Pedido explícito do usuário:
// zerar esse campo obrigava a redigitar o estoque inteiro toda atualização.
function buildInitialAcceleratorAmounts(last: WeeklySnapshot | null): typeof emptyAcceleratorAmounts {
  if (!last) return emptyAcceleratorAmounts
  return {
    general: last.accelGeneralDays,
    training: last.accelTrainingDays,
    construction: last.accelConstructionDays,
    research: last.accelResearchDays,
    healing: last.accelHealingDays,
  }
}

// Pré-preenche com os dados persistentes do último check-in (fornalha, VIP,
// gemas, poder, filas, heróis, tropas) — o jogador só edita o que realmente
// mudou. Evento NÃO carrega do anterior: é "o que está rolando esta
// semana", não algo que persiste igual. Aceleradores carregam do anterior
// (ver buildInitialAcceleratorAmounts) — é estoque acumulado, não um valor
// que reseta toda semana.
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
    troopsInfantry: last.troopsInfantry,
    troopsLancer: last.troopsLancer,
    troopsMarksman: last.troopsMarksman,
    highestTierTraining: last.highestTierTraining ?? '',
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
  const [acceleratorUnit, setAcceleratorUnit] = useState<AcceleratorUnit>('days')
  const [acceleratorAmounts, setAcceleratorAmounts] = useState(() =>
    buildInitialAcceleratorAmounts(lastSnapshot)
  )

  function update<K extends keyof DraftSnapshot>(key: K, value: DraftSnapshot[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function updateAccelerator(key: keyof typeof emptyAcceleratorAmounts, amount: number) {
    setAcceleratorAmounts((prev) => ({ ...prev, [key]: amount }))
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
          accelGeneralDays: toDecimalDays(acceleratorAmounts.general, acceleratorUnit),
          accelTrainingDays: toDecimalDays(acceleratorAmounts.training, acceleratorUnit),
          accelConstructionDays: toDecimalDays(acceleratorAmounts.construction, acceleratorUnit),
          accelResearchDays: toDecimalDays(acceleratorAmounts.research, acceleratorUnit),
          accelHealingDays: toDecimalDays(acceleratorAmounts.healing, acceleratorUnit),
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

      <label>Tropas (total por tipo)</label>
      <div className="grid-2">
        <div>
          <label className="muted">Infantaria</label>
          <input
            type="number"
            min={0}
            value={draft.troopsInfantry}
            onChange={(e) => update('troopsInfantry', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="muted">Lanceiros</label>
          <input
            type="number"
            min={0}
            value={draft.troopsLancer}
            onChange={(e) => update('troopsLancer', Number(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="muted">Atiradores (Marksman)</label>
          <input
            type="number"
            min={0}
            value={draft.troopsMarksman}
            onChange={(e) => update('troopsMarksman', Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="muted">Tier mais alto em treino</label>
          <input
            type="text"
            list="troop-tiers-list"
            placeholder="ex.: T8"
            value={draft.highestTierTraining ?? ''}
            onChange={(e) => update('highestTierTraining', e.target.value)}
          />
        </div>
      </div>
      <datalist id="troop-tiers-list">
        {KNOWN_TROOP_TIERS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <label>Aceleradores disponíveis agora</label>
      <div style={{ marginBottom: 8 }}>
        <label className="muted">Unidade (vale para todos abaixo)</label>
        <select
          value={acceleratorUnit}
          onChange={(e) => setAcceleratorUnit(e.target.value as AcceleratorUnit)}
        >
          {(Object.keys(ACCELERATOR_UNIT_LABELS) as AcceleratorUnit[]).map((u) => (
            <option key={u} value={u}>
              {ACCELERATOR_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
      <div className="grid-2">
        <AcceleratorInput
          label="Aceleração Geral"
          value={acceleratorAmounts.general}
          onChange={(v) => updateAccelerator('general', v)}
        />
        <AcceleratorInput
          label="Treinamento de tropas"
          value={acceleratorAmounts.training}
          onChange={(v) => updateAccelerator('training', v)}
        />
      </div>
      <div className="grid-2">
        <AcceleratorInput
          label="Construção"
          value={acceleratorAmounts.construction}
          onChange={(v) => updateAccelerator('construction', v)}
        />
        <AcceleratorInput
          label="Pesquisa"
          value={acceleratorAmounts.research}
          onChange={(v) => updateAccelerator('research', v)}
        />
      </div>
      <div className="grid-2">
        <AcceleratorInput
          label="Cura"
          value={acceleratorAmounts.healing}
          onChange={(v) => updateAccelerator('healing', v)}
        />
        <div />
      </div>

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
      <datalist id="heroes-list">
        {KNOWN_HEROES.map((h) => (
          <option key={h} value={h} />
        ))}
      </datalist>

      <label>Heróis favoritos</label>
      {draft.heroes.map((hero, i) => (
        <div className="hero-row" key={i}>
          <input
            type="text"
            list="heroes-list"
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
