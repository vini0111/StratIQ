// Tipos centrais do MVP.
// Mantidos deliberadamente simples (ver docs/MVP-001-Escopo-e-Estrutura.md):
// sem Knowledge Base formal, sem Digital Twin como estrutura de dados.

export type FinancialProfile =
  | 'f2p'
  | 'low_spender'
  | 'medium_spender'
  | 'high_spender'
  | 'whale'

export type Objective =
  | 'growth'
  | 'pvp'
  | 'bear_trap'
  | 'svs'
  | 'arena'
  | 'rally'
  | 'alliance_leadership'
  | 'balanced'

export interface Profile {
  id: string
  stateNumber: number
  alliance: string
  financialProfile: FinancialProfile
  objective: Objective
  hasSecondBuilder: boolean
  createdAt?: string
}

export interface HeroEntry {
  name: string
  level: number
  stars: number
}

export interface WeeklySnapshot {
  id?: string
  profileId: string
  snapshotDate: string
  furnaceLevel: number
  vipLevel: number
  vipProgressPct: number
  gems: number
  accelGeneralDays: number
  accelTrainingDays: number
  accelConstructionDays: number
  accelResearchDays: number
  accelHealingDays: number
  currentEvents: string[]
  power: number
  heroes: HeroEntry[]
  currentResearch: string
  currentBuilding: string
  currentBuilding2?: string
  weeklyQuestion?: string
  createdAt?: string
}

// --- Strategy Engine ---

export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'in'
  | 'contains'
  | 'anyHeroBelowStars'
  | 'heroNamedBelowStars'
  | 'anyHeroAtOrAboveLevel'

export interface StrategyCondition {
  field: string
  op: ConditionOperator
  // Valores literais, ou uma referência dinâmica ao contexto usando "$caminho.para.campo"
  value: string | number | boolean | (string | number)[]
}

export type Priority = 'very_high' | 'high' | 'medium' | 'low'
export type Domain = 'economy' | 'growth' | 'battle' | 'heroes' | 'events'
export type Impact = 'low' | 'medium' | 'high'

export interface StrategyCard {
  id: string
  name: string
  domain: Domain
  priority: Priority
  conditions: StrategyCondition[]
  recommendation: string
  explanation: string
  impact: Impact
  confidence: number
}

export type SemaphoreLevel = 'green' | 'yellow' | 'red'

export interface SemaphoreState {
  growth: SemaphoreLevel
  economy: SemaphoreLevel
  battle: SemaphoreLevel
}
