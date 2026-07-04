import { useEffect, useState } from 'react'
import type { HeroEntry, Profile, TroopEntry, WeeklySnapshot } from '../types'
import {
  KNOWN_BUILDINGS,
  KNOWN_EVENTS,
  KNOWN_HEROES,
  KNOWN_RESEARCH,
  KNOWN_TROOP_TIERS,
  KNOWN_TROOP_TYPES,
} from '../data/knownOptions'
import { ACCELERATOR_UNIT_LABELS, AcceleratorUnit, fromDecimalDays, toDecimalDays } from '../lib/accelerators'
import AcceleratorInput from './AcceleratorInput'

type DraftSnapshot = Omit<WeeklySnapshot, 'id' | 'profileId' | 'createdAt'>

const emptyHero: HeroEntry = { name: '', level: 1, stars: 1 }
const emptyTroopEntry: TroopEntry = { type: 'infantry', tier: '', quantity: 0 }

const blankDraft: DraftSnapshot = {
  snapshotDate: new Date().toISOString().slice(0, 10),
  furnaceLevel: 1,
  vipLevel: 0,
  vipXp: 0,
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
  troopEntries: [],
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

// Autosave em localStorage — defesa extra contra perda de dados em cima do
// próprio bug corrigido em App.tsx (recarregamento indevido a cada refresh
// de token). Mesmo com aquele bug resolvido, o navegador/SO pode descartar
// a aba por memória (comum em celular) e recarregar do zero ao voltar —
// isso o código não controla. Guardado por perfil, limpo após salvar com
// sucesso.
interface PersistedDraft {
  draft: DraftSnapshot
  selectedEvents: string[]
  customEventsText: string
  acceleratorUnit: AcceleratorUnit
  acceleratorAmounts: typeof emptyAcceleratorAmounts
}

function draftStorageKey(profileId: string) {
  return `stratiq-draft-${profileId}`
}

function loadPersistedDraft(profileId: string): PersistedDraft | null {
  try {
    const raw = localStorage.getItem(draftStorageKey(profileId))
    return raw ? (JSON.parse(raw) as PersistedDraft) : null
  } catch {
    return null
  }
}

function persistDraft(profileId: string, data: PersistedDraft) {
  try {
    localStorage.setItem(draftStorageKey(profileId), JSON.stringify(data))
  } catch {
    // localStorage indisponível (modo privado, cota cheia etc.) — autosave é
    // só uma rede de segurança extra, não crítico se falhar silenciosamente.
  }
}

function clearPersistedDraft(profileId: string) {
  try {
    localStorage.removeItem(draftStorageKey(profileId))
  } catch {
    // ver comentário em persistDraft
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
    vipXp: last.vipXp,
    gems: last.gems,
    power: last.power,
    heroes: last.heroes.length > 0 ? last.heroes.map((h) => ({ ...h })) : [{ ...emptyHero }],
    currentResearch: last.currentResearch,
    currentBuilding: last.currentBuilding,
    currentBuilding2: last.currentBuilding2 ?? '',
    troopEntries: last.troopEntries.map((t) => ({ ...t })),
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
  const persisted = loadPersistedDraft(profile.id)
  const [draft, setDraft] = useState<DraftSnapshot>(() => persisted?.draft ?? buildInitialDraft(lastSnapshot))
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() => persisted?.selectedEvents ?? [])
  const [customEventsText, setCustomEventsText] = useState(() => persisted?.customEventsText ?? '')
  const [acceleratorUnit, setAcceleratorUnit] = useState<AcceleratorUnit>(() => persisted?.acceleratorUnit ?? 'days')
  const [acceleratorAmounts, setAcceleratorAmounts] = useState(
    () => persisted?.acceleratorAmounts ?? buildInitialAcceleratorAmounts(lastSnapshot)
  )

  // Salva o rascunho a cada mudança — ver comentário em PersistedDraft acima.
  useEffect(() => {
    persistDraft(profile.id, { draft, selectedEvents, customEventsText, acceleratorUnit, acceleratorAmounts })
  }, [draft, selectedEvents, customEventsText, acceleratorUnit, acceleratorAmounts, profile.id])

  function update<K extends keyof DraftSnapshot>(key: K, value: DraftSnapshot[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function updateAccelerator(key: keyof typeof emptyAcceleratorAmounts, amount: number) {
    setAcceleratorAmounts((prev) => ({ ...prev, [key]: amount }))
  }

  // Trocar a unidade deve recalcular os números já digitados, não só
  // reinterpretar o mesmo valor sob um rótulo diferente (bug relatado:
  // valor em dias com casas decimais não convertia ao trocar para horas).
  function changeAcceleratorUnit(newUnit: AcceleratorUnit) {
    setAcceleratorAmounts((prev) => {
      const next = { ...prev }
      for (const key of Object.keys(prev) as (keyof typeof emptyAcceleratorAmounts)[]) {
        const days = toDecimalDays(prev[key], acceleratorUnit)
        next[key] = Math.round(fromDecimalDays(days, newUnit) * 100) / 100
      }
      return next
    })
    setAcceleratorUnit(newUnit)
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

  function updateTroopEntry(index: number, patch: Partial<TroopEntry>) {
    setDraft((prev) => ({
      ...prev,
      troopEntries: prev.troopEntries.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }))
  }

  function addTroopEntry() {
    setDraft((prev) => ({ ...prev, troopEntries: [...prev.troopEntries, { ...emptyTroopEntry }] }))
  }

  function removeTroopEntry(index: number) {
    setDraft((prev) => ({ ...prev, troopEntries: prev.troopEntries.filter((_, i) => i !== index) }))
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
          troopEntries: draft.troopEntries.filter((t) => t.tier.trim().length > 0),
        })
        clearPersistedDraft(profile.id)
      }}
    >
      <h3>Novo check-in</h3>
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
          <label>XP de VIP (progresso no nível atual)</label>
          <input
            type="number"
            min={0}
            value={draft.vipXp}
            onChange={(e) => update('vipXp', Number(e.target.value) || 0)}
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
      <p className="muted" style={{ marginTop: -8, fontSize: 12 }}>
        O número que aparece na tela de VIP do jogo, tipo "X / Y para o próximo nível" — informe só
        o X. O app calcula a % sozinho a partir da tabela de XP necessário por nível.
      </p>

      <label>Poder</label>
      <input
        type="number"
        value={draft.power}
        onChange={(e) => update('power', Number(e.target.value))}
      />

      <label>Tropas (uma linha por tipo + tier que você tiver)</label>
      <p className="muted" style={{ marginTop: -2, fontSize: 12 }}>
        O jogo mostra por tier dentro de cada tipo (ex.: "Infantaria Heróica nível VI: 7.848"), não
        um total único. Adicione uma linha para cada combinação que aparecer na sua tela.
      </p>
      {draft.troopEntries.map((entry, i) => (
        <div className="hero-row" key={i}>
          <select
            value={entry.type}
            onChange={(e) => updateTroopEntry(i, { type: e.target.value as TroopEntry['type'] })}
          >
            {KNOWN_TROOP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            list="troop-tiers-list"
            placeholder="Tier (ex.: VI - Heróica)"
            value={entry.tier}
            onChange={(e) => updateTroopEntry(i, { tier: e.target.value })}
          />
          <input
            type="number"
            min={0}
            placeholder="Quantidade"
            value={entry.quantity}
            onChange={(e) => updateTroopEntry(i, { quantity: Number(e.target.value) || 0 })}
          />
          <button type="button" className="secondary" onClick={() => removeTroopEntry(i)}>
            Remover
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addTroopEntry} style={{ marginBottom: 12 }}>
        + linha de tropa
      </button>
      <datalist id="troop-tiers-list">
        {KNOWN_TROOP_TIERS.map((t) => (
          <option key={t} value={t} />
        ))}
      </datalist>

      <label>Tier mais alto em treino agora</label>
      <input
        type="text"
        list="troop-tiers-list"
        placeholder="ex.: VII - Brave"
        value={draft.highestTierTraining ?? ''}
        onChange={(e) => update('highestTierTraining', e.target.value)}
      />

      <label>Aceleradores disponíveis agora</label>
      <div style={{ marginBottom: 8 }}>
        <label className="muted">Unidade (vale para todos abaixo)</label>
        <select
          value={acceleratorUnit}
          onChange={(e) => changeAcceleratorUnit(e.target.value as AcceleratorUnit)}
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

      <label>Dúvida do dia (opcional)</label>
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
