import type { SemaphoreLevel, SemaphoreState } from '../types'
import type { EvalContext } from './strategyEngine'

// Heurística v0, deliberadamente simples e baseada apenas em tendência própria
// (sem benchmark contra outros jogadores do estado — isso exigiria dados que a
// v0 não coleta; ver docs/RESEARCH-001). Ajustar após validação de uso real.

export function computeSemaphore(context: EvalContext): SemaphoreState {
  const gems = context.gems as number
  const reserveThreshold = context.derived.reserveThreshold
  const accelConstructionDays = context.accelConstructionDays as number
  const accelResearchDays = context.accelResearchDays as number
  const accelTrainingDays = context.accelTrainingDays as number
  const currentBuilding = context.currentBuilding as string
  const currentResearch = context.currentResearch as string
  const constructionMaxed = context.constructionMaxed as boolean | undefined
  const researchMaxed = context.researchMaxed as boolean | undefined
  const powerDelta = context.derived.powerDelta

  const economy: SemaphoreLevel =
    gems < reserveThreshold * 0.5 ? 'red' : gems < reserveThreshold ? 'yellow' : 'green'

  // Fila vazia só conta como "ociosa" se não houver nada disponível para
  // construir/pesquisar no momento (ex.: esperando a Fornalha subir) — sem
  // essa distinção o semáforo fica vermelho/amarelo por um motivo que o
  // jogador não pode resolver. Ver docs/BACKLOG-v1.md (oitava rodada).
  const constructionIdle = !currentBuilding && !constructionMaxed
  const researchIdle = !currentResearch && !researchMaxed
  const bothQueuesIdle = constructionIdle && researchIdle
  const anyQueueIdle = constructionIdle || researchIdle
  const hoardingAccelerators =
    accelConstructionDays > 20 || accelResearchDays > 20 || accelTrainingDays > 20
  const growth: SemaphoreLevel = bothQueuesIdle
    ? 'red'
    : anyQueueIdle || hoardingAccelerators
      ? 'yellow'
      : 'green'

  const battle: SemaphoreLevel =
    powerDelta === null ? 'yellow' : powerDelta < 0 ? 'red' : powerDelta === 0 ? 'yellow' : 'green'

  return { growth, economy, battle }
}
