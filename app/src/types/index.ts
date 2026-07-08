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
  stateFoundedDate?: string
  createdAt?: string
}

export interface HeroEntry {
  name: string
  level: number
  stars: number
  // Fragmentos acumulados para a próxima estrela — opcionais, só fazem
  // sentido informar para heróis abaixo do teto (5 estrelas). Ambos os
  // números vêm direto da tela do herói no jogo (o próprio jogo mostra
  // "atual/necessário"), sem precisar de tabela de custo por estrela/raridade
  // mantida pelo app — ver docs/BACKLOG-v1.md (décima quarta rodada) para a
  // decisão de não replicar a calculadora de shards de ferramentas como a
  // WoSTools.
  shardsOwned?: number
  shardsRequiredForNextStar?: number
}

export type TroopType = 'infantry' | 'lancer' | 'marksman'

export interface TroopEntry {
  type: TroopType
  tier: string
  quantity: number
}

export interface WeeklySnapshot {
  id?: string
  profileId: string
  snapshotDate: string
  furnaceLevel: number
  vipLevel: number
  vipXp: number
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
  constructionMaxed?: boolean
  construction2Maxed?: boolean
  researchMaxed?: boolean
  troopEntries: TroopEntry[]
  highestTierTraining?: string
  weeklyQuestion?: string
  // Tema da Roda da Sorte nessa rotação (opcional, texto livre) — o evento
  // muda o herói em destaque a cada vez, e o motor não tem como saber isso
  // sozinho. Ver docs/BACKLOG-v1.md (décima quinta rodada).
  luckyWheelFeaturedHero?: string
  // Override manual, mesma lógica de constructionMaxed/researchMaxed:
  // promover tropas de um tier para outro reduz a contagem bruta total
  // (falso positivo em TROOP_GROWTH_STAGNATION). Não persiste entre
  // check-ins.
  troopsPromoting?: boolean
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

// gt/gte/lt/lte também aceitam duas strings — comparação lexicográfica, útil
// para datas em formato ISO (AAAA-MM-DD), onde ordem lexicográfica = ordem
// cronológica. Usado por derived.todayIso (ver strategyEngine.ts).

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

// --- Guia / Wiki (conteúdo educativo, não alimenta o Strategy Engine) ---

export type WikiCategory = 'guia' | 'herois' | 'tropas' | 'construcoes' | 'eventos' | 'pets'

export interface WikiSection {
  heading?: string
  paragraphs: string[]
}

export interface WikiArticle {
  id: string
  category: WikiCategory
  title: string
  summary: string
  sections: WikiSection[]
  source?: string
}
