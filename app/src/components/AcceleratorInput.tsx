import { useState } from 'react'

// O jogo mostra aceleradores em dias OU horas OU minutos (não simultaneamente).
// Internamente guardamos um decimal de dias (sem mudar o schema).

type Unit = 'days' | 'hours' | 'minutes'

const UNIT_LABELS: Record<Unit, string> = {
  days: 'Dias',
  hours: 'Horas',
  minutes: 'Minutos',
}

function toDecimalDays(amount: number, unit: Unit) {
  if (unit === 'hours') return amount / 24
  if (unit === 'minutes') return amount / 1440
  return amount
}

export default function AcceleratorInput({
  label,
  onChange,
}: {
  label: string
  onChange: (decimalDays: number) => void
}) {
  const [unit, setUnit] = useState<Unit>('days')
  const [amount, setAmount] = useState(0)

  function handleUnitChange(nextUnit: Unit) {
    setUnit(nextUnit)
    onChange(toDecimalDays(amount, nextUnit))
  }

  function handleAmountChange(raw: string) {
    const n = Number(raw) || 0
    setAmount(n)
    onChange(toDecimalDays(n, unit))
  }

  return (
    <div className="grid-2" style={{ marginBottom: 12 }}>
      <div>
        <label className="muted">{label}</label>
        <select value={unit} onChange={(e) => handleUnitChange(e.target.value as Unit)}>
          {(Object.keys(UNIT_LABELS) as Unit[]).map((u) => (
            <option key={u} value={u}>
              {UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="muted">Quantidade</label>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>
    </div>
  )
}
