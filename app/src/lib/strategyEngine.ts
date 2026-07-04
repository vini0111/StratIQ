import type {
  ConditionOperator,
  HeroEntry,
  Profile,
  StrategyCard,
  StrategyCondition,
  WeeklySnapshot,
} from '../types'

// O Strategy Engine avalia Strategy Cards (dados, não código) contra um
// "contexto" derivado do snapshot atual + perfil + snapshot anterior.
// Regra de ouro (ver docs/VISION): a IA nunca decide sozinha; este motor decide,
// qualquer camada de IA futura apenas explica o que ele já concluiu.

export interface EvalContext {
  [key: string]: unknown
  profile: {
    financialProfile: Profile['financialProfile']
    objective: Profile['objective']
    stateNumber: number
    hasSecondBuilder: boolean
  }
  derived: {
    reserveThreshold: number
    powerDelta: number | null
    gemsDelta: number | null
    maxHeroLevel: number
  }
}

const RESERVE_THRESHOLD_BY_PROFILE: Record<Profile['financialProfile'], number> = {
  f2p: 50000,
  low_spender: 40000,
  medium_spender: 25000,
  high_spender: 15000,
  whale: 10000,
}

// Nível máximo de herói liberado por nível de Fornalha (cresce em marcos, não
// a cada nível). Fonte: docs/KNOWLEDGE-001-Game-Mechanics.md (seção Fornalha).
// Lista ordenada; usamos o maior marco <= ao nível atual da fornalha.
const MAX_HERO_LEVEL_MILESTONES: [furnaceLevel: number, maxHeroLevel: number][] = [
  [4, 20],
  [10, 22],
  [11, 25],
  [12, 28],
  [13, 31],
  [14, 34],
  [15, 37],
  [16, 40],
  [17, 43],
  [18, 46],
  [19, 49],
  [20, 54],
  [21, 59],
  [22, 64],
  [23, 69],
  [24, 74],
  [25, 79],
  [26, 80],
]

function computeMaxHeroLevel(furnaceLevel: number): number {
  let cap = 20 // linha de base antes do 1º marco (Fornalha 4)
  for (const [level, maxLevel] of MAX_HERO_LEVEL_MILESTONES) {
    if (furnaceLevel >= level) cap = maxLevel
  }
  return cap
}

export function buildContext(
  snapshot: WeeklySnapshot,
  profile: Profile,
  previousSnapshot: WeeklySnapshot | null
): EvalContext {
  return {
    ...snapshot,
    profile: {
      financialProfile: profile.financialProfile,
      objective: profile.objective,
      stateNumber: profile.stateNumber,
      hasSecondBuilder: profile.hasSecondBuilder,
    },
    derived: {
      reserveThreshold: RESERVE_THRESHOLD_BY_PROFILE[profile.financialProfile],
      powerDelta: previousSnapshot ? snapshot.power - previousSnapshot.power : null,
      gemsDelta: previousSnapshot ? snapshot.gems - previousSnapshot.gems : null,
      maxHeroLevel: computeMaxHeroLevel(snapshot.furnaceLevel),
    },
  }
}

function getField(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => {
      if (acc == null || typeof acc !== 'object') return undefined
      return (acc as Record<string, unknown>)[key]
    }, obj)
}

function resolveValue(raw: StrategyCondition['value'], context: EvalContext) {
  if (typeof raw === 'string' && raw.startsWith('$')) {
    return getField(context, raw.slice(1))
  }
  return raw
}

// currentEvents é um array de strings (jogadores frequentemente têm mais de
// um evento ativo ao mesmo tempo). Para não duplicar cada Strategy Card em
// "versão string" e "versão array", eq/neq/contains tratam automaticamente
// o caso em que `left` é um array de strings — sem afetar o comportamento
// existente para campos que continuam sendo string simples.
function evaluateOperator(op: ConditionOperator, left: unknown, right: unknown): boolean {
  const leftIsStringArray =
    Array.isArray(left) && left.every((item) => typeof item === 'string')

  switch (op) {
    case 'eq':
      if (leftIsStringArray) return (left as string[]).includes(right as string)
      return left === right
    case 'neq':
      if (leftIsStringArray) return !(left as string[]).includes(right as string)
      return left !== right
    case 'lt':
      return typeof left === 'number' && typeof right === 'number' && left < right
    case 'lte':
      return typeof left === 'number' && typeof right === 'number' && left <= right
    case 'gt':
      return typeof left === 'number' && typeof right === 'number' && left > right
    case 'gte':
      return typeof left === 'number' && typeof right === 'number' && left >= right
    case 'in':
      return Array.isArray(right) && right.includes(left as never)
    case 'contains':
      if (leftIsStringArray && typeof right === 'string') {
        return (left as string[]).some((item) => item.toLowerCase().includes(right.toLowerCase()))
      }
      return (
        typeof left === 'string' &&
        typeof right === 'string' &&
        left.toLowerCase().includes(right.toLowerCase())
      )
    case 'anyHeroBelowStars':
      return (
        Array.isArray(left) &&
        typeof right === 'number' &&
        (left as HeroEntry[]).some((h) => h.stars < right)
      )
    case 'anyHeroAtOrAboveLevel':
      return (
        Array.isArray(left) &&
        typeof right === 'number' &&
        (left as HeroEntry[]).some((h) => h.level >= right)
      )
    case 'heroNamedBelowStars': {
      // value no formato "Nome:estrelas", ex: "Flint:4".
      // Só dispara se o jogador já listou esse herói como favorito — não
      // cobra heróis que ele nunca mencionou.
      if (!Array.isArray(left) || typeof right !== 'string') return false
      const [name, starsRaw] = right.split(':')
      const starsThreshold = Number(starsRaw)
      if (!name || Number.isNaN(starsThreshold)) return false
      return (left as HeroEntry[]).some(
        (h) => h.name.trim().toLowerCase() === name.trim().toLowerCase() && h.stars < starsThreshold
      )
    }
    default:
      return false
  }
}

export function evaluateCondition(condition: StrategyCondition, context: EvalContext): boolean {
  const left = getField(context, condition.field)
  if (left === undefined || left === null) return false
  const right = resolveValue(condition.value, context)
  if (right === undefined || right === null) return false
  return evaluateOperator(condition.op, left, right)
}

export function evaluateCard(card: StrategyCard, context: EvalContext): boolean {
  return card.conditions.every((condition) => evaluateCondition(condition, context))
}

const PRIORITY_ORDER: Record<StrategyCard['priority'], number> = {
  very_high: 0,
  high: 1,
  medium: 2,
  low: 3,
}

export function evaluateStrategyCards(
  cards: StrategyCard[],
  context: EvalContext
): StrategyCard[] {
  return cards
    .filter((card) => evaluateCard(card, context))
    .sort((a, b) => {
      const byPriority = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (byPriority !== 0) return byPriority
      return b.confidence - a.confidence
    })
}
