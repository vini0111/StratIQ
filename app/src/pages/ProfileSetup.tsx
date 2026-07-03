import { useState } from 'react'
import type { FinancialProfile, Objective, Profile } from '../types'
import Brand from '../components/Brand'

const FINANCIAL_PROFILES: { value: FinancialProfile; label: string }[] = [
  { value: 'f2p', label: 'F2P' },
  { value: 'low_spender', label: 'Até R$30/mês' },
  { value: 'medium_spender', label: 'Até R$100/mês' },
  { value: 'high_spender', label: 'Até R$300/mês' },
  { value: 'whale', label: 'Whale' },
]

const OBJECTIVES: { value: Objective; label: string }[] = [
  { value: 'growth', label: 'Crescimento rápido' },
  { value: 'pvp', label: 'PvP' },
  { value: 'bear_trap', label: 'Bear Trap' },
  { value: 'svs', label: 'SvS' },
  { value: 'arena', label: 'Arena' },
  { value: 'rally', label: 'Rally' },
  { value: 'alliance_leadership', label: 'Liderança de aliança' },
  { value: 'balanced', label: 'Equilibrado' },
]

export default function ProfileSetup({
  initialProfile,
  onSubmit,
  onCancel,
  submitting,
}: {
  initialProfile?: Profile
  onSubmit: (profile: Omit<Profile, 'id' | 'createdAt'>) => void
  onCancel?: () => void
  submitting: boolean
}) {
  const [stateNumber, setStateNumber] = useState<number>(initialProfile?.stateNumber ?? 0)
  const [alliance, setAlliance] = useState(initialProfile?.alliance ?? '')
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(
    initialProfile?.financialProfile ?? 'f2p'
  )
  const [objective, setObjective] = useState<Objective>(initialProfile?.objective ?? 'balanced')
  const [hasSecondBuilder, setHasSecondBuilder] = useState(initialProfile?.hasSecondBuilder ?? false)

  const isEditing = !!initialProfile

  return (
    <form
      className="card"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ stateNumber, alliance, financialProfile, objective, hasSecondBuilder })
      }}
    >
      <Brand size={24} />
      <h1 style={{ marginTop: 20 }}>{isEditing ? 'Editar perfil' : 'Configuração inicial'}</h1>
      <p className="muted">
        {isEditing
          ? 'Ajuste o que mudou desde o cadastro inicial (ex.: desbloqueou o 2º construtor, trocou de aliança).'
          : 'Só o essencial para personalizar as recomendações. Sem cadastro extenso — isso não é onboarding de várias telas, é preenchido uma vez e pronto.'}
      </p>

      <label>Número do estado</label>
      <input
        type="number"
        required
        value={stateNumber || ''}
        onChange={(e) => setStateNumber(Number(e.target.value))}
      />

      <label>Aliança</label>
      <input type="text" value={alliance} onChange={(e) => setAlliance(e.target.value)} />

      <label>Perfil financeiro</label>
      <select
        value={financialProfile}
        onChange={(e) => setFinancialProfile(e.target.value as FinancialProfile)}
      >
        {FINANCIAL_PROFILES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label>Objetivo principal</label>
      <select value={objective} onChange={(e) => setObjective(e.target.value as Objective)}>
        {OBJECTIVES.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          style={{ width: 'auto', margin: 0 }}
          checked={hasSecondBuilder}
          onChange={(e) => setHasSecondBuilder(e.target.checked)}
        />
        Já desbloqueei um 2º construtor
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Começar'}
      </button>
      {isEditing && onCancel && (
        <button type="button" className="secondary" style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancelar
        </button>
      )}
    </form>
  )
}
