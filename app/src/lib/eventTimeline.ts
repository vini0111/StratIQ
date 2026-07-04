import type { WeeklySnapshot } from '../types'

// Previsão simples de "próximo evento" usando a cadência conhecida
// (KNOWLEDGE-001) + a última vez que o próprio jogador registrou aquele
// evento como ativo no histórico de check-ins. Não é uma data oficial do
// jogo — é uma estimativa que melhora conforme mais check-ins acumulam.
// currentEvents deve conter exatamente esses nomes (mesmos do checkbox em
// KNOWN_EVENTS) para a âncora funcionar.

export interface EventCadenceDef {
  eventName: string
  key: string
  cadenceDays: number
}

export const EVENT_CADENCES: EventCadenceDef[] = [
  { eventName: 'Roda da Sorte', key: 'rodaDaSorte', cadenceDays: 14 },
  { eventName: 'Mobilização da Aliança', key: 'mobilizacaoDaAlianca', cadenceDays: 28 },
  { eventName: 'SvS', key: 'svs', cadenceDays: 30 },
]

export interface EventTimelineEntry {
  eventName: string
  lastSeenDate: string | null
  daysSinceLastSeen: number | null
  daysUntilNext: number | null
}

const MS_PER_DAY = 86_400_000

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY)
}

export function computeEventTimeline(
  snapshots: WeeklySnapshot[],
  today: Date = new Date()
): Record<string, EventTimelineEntry> {
  const result: Record<string, EventTimelineEntry> = {}

  for (const { eventName, key, cadenceDays } of EVENT_CADENCES) {
    let lastSeenDate: string | null = null
    for (let i = snapshots.length - 1; i >= 0; i--) {
      if (snapshots[i].currentEvents?.includes(eventName)) {
        lastSeenDate = snapshots[i].snapshotDate
        break
      }
    }

    if (!lastSeenDate) {
      result[key] = { eventName, lastSeenDate: null, daysSinceLastSeen: null, daysUntilNext: null }
      continue
    }

    const daysSince = daysBetween(new Date(lastSeenDate), today)
    const cyclesPassed = Math.floor(Math.max(daysSince, 0) / cadenceDays)
    const daysUntilNext = (cyclesPassed + 1) * cadenceDays - daysSince

    result[key] = {
      eventName,
      lastSeenDate,
      daysSinceLastSeen: daysSince,
      daysUntilNext,
    }
  }

  return result
}
