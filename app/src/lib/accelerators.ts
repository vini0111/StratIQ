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

// Inverso de toDecimalDays — usado para re-exibir um valor (guardado
// internamente sempre em dias) na unidade que o usuário escolher no
// seletor. Sem isso, trocar a unidade só reinterpreta o mesmo número em vez
// de convertê-lo (bug relatado: valores em dias com casas decimais não
// viravam horas ao mudar o seletor).
export function fromDecimalDays(days: number, unit: AcceleratorUnit): number {
  if (unit === 'hours') return days * 24
  if (unit === 'minutes') return days * 1440
  return days
}
