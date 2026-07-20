import type { WeeklySnapshot } from '../types'

// "Próximos marcos" — vigésima quinta rodada (ver docs/BACKLOG-v1.md).
// Widget de orientação futura: NÃO é uma Strategy Card (não entra no motor
// de decisão nem no semáforo), é um componente de exibição que projeta
// quando os próximos desbloqueios de conteúdo por nível de Fornalha devem
// chegar, usando o ritmo real observado no histórico de check-ins da conta
// (dias por nível), em vez de uma data fixa ou uma regra do motor. Fica
// separado de strategyEngine.ts de propósito — é informativo, não uma
// recomendação/decisão.

export interface FurnaceMilestone {
  level: number
  description: string
}

// Desbloqueios por nível de Fornalha já documentados e sourced em
// docs/KNOWLEDGE-001-Game-Mechanics.md (seção Fornalha/Cidade e seções dos
// domínios específicos — Equipamento de Herói, Pets, Chief Gear). Lista
// parcial: só os marcos que este app já rastreia de alguma forma (cap de
// herói, domínios com captura de dados), não a árvore de conteúdo inteira
// do jogo.
export const FURNACE_MILESTONES: FurnaceMilestone[] = [
  { level: 4, description: 'Heróis podem chegar ao nível 20' },
  { level: 10, description: 'Heróis podem chegar ao nível 22' },
  { level: 11, description: 'Heróis podem chegar ao nível 25' },
  { level: 12, description: 'Heróis podem chegar ao nível 28' },
  { level: 13, description: 'Heróis podem chegar ao nível 31' },
  { level: 14, description: 'Heróis podem chegar ao nível 34' },
  { level: 15, description: 'Equipamento de Herói (Hero Gear) desbloqueado' },
  { level: 16, description: 'Heróis podem chegar ao nível 40' },
  { level: 18, description: 'Pets (Beast Cage) desbloqueado' },
  { level: 20, description: 'Mastery Forging disponível (peça Lendária no enhancement 20+)' },
  { level: 22, description: 'Chief Gear (equipamento de comandante) desbloqueado' },
  { level: 25, description: 'Chief Charms desbloqueado' },
]

// Ritmo observado: dias corridos por nível de Fornalha, calculado entre o
// primeiro e o último check-in com furnaceLevel diferente no histórico. Não
// assume ritmo constante (o jogo desacelera conforme o nível sobe — ver
// KNOWLEDGE-001, síntese da vigésima quarta rodada), é só a média observada
// até agora; serve como estimativa grosseira, não uma previsão precisa.
// Retorna null se não há dados suficientes (menos de 2 níveis distintos de
// Fornalha no histórico).
export function computeFurnacePaceDaysPerLevel(snapshots: WeeklySnapshot[]): number | null {
  if (snapshots.length < 2) return null
  const sorted = [...snapshots].sort((a, b) => a.snapshotDate.localeCompare(b.snapshotDate))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const levelDelta = last.furnaceLevel - first.furnaceLevel
  if (levelDelta <= 0) return null
  const firstDate = new Date(first.snapshotDate)
  const lastDate = new Date(last.snapshotDate)
  const daysDelta = (lastDate.getTime() - firstDate.getTime()) / 86_400_000
  if (daysDelta <= 0) return null
  return daysDelta / levelDelta
}

export interface UpcomingMilestone extends FurnaceMilestone {
  levelsAway: number
  estimatedDaysAway: number | null
}

// Próximos marcos acima do nível atual, com estimativa de dias restantes
// quando há ritmo observado (paceDaysPerLevel). limit controla quantos
// mostrar (padrão 3, para não sobrecarregar o widget).
export function computeNextFurnaceMilestones(
  currentLevel: number,
  paceDaysPerLevel: number | null,
  limit = 3
): UpcomingMilestone[] {
  return FURNACE_MILESTONES.filter((m) => m.level > currentLevel)
    .slice(0, limit)
    .map((m) => {
      const levelsAway = m.level - currentLevel
      return {
        ...m,
        levelsAway,
        estimatedDaysAway: paceDaysPerLevel !== null ? Math.round(levelsAway * paceDaysPerLevel) : null,
      }
    })
}
