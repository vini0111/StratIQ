// O jogo mostra aceleradores em dias, horas OU minutos (uma unidade por vez,
// compartilhada entre todas as categorias). Internamente guardamos sempre um
// decimal de dias (sem mudar o schema do banco).

export type AcceleratorUnit = 'days' | 'hours' | 'minutes'

export const ACCELERATOR_UNIT_LABELS: Record<AcceleratorUnit, string> = {
  days: 'Dias',
  hours: 'Horas',
  minutes: 'Minutos',
}

export function toDecimalDays(amount: number, unit: AcceleratorUnit): number {
  if (unit === 'hours') return amount / 24
  if (unit === 'minutes') return amount / 1440
  return amount
}
