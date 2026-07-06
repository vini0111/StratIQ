import type {
  ConditionOperator,
  HeroEntry,
  Profile,
  StrategyCard,
  StrategyCondition,
  TroopEntry,
  WeeklySnapshot,
} from '../types'
import { computeEventTimeline, type EventTimelineEntry } from './eventTimeline'

// O Strategy Engine avalia Strategy Cards (dados, não código) contra um
// "contexto" derivado do snapshot atual + perfil + histórico. Regra de ouro
// (ver docs/VISION): a IA nunca decide sozinha; este motor decide, qualquer
// camada de IA futura apenas explica o que ele já concluiu.

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
    vipProgressPct: number
    powerDelta: number | null
    gemsDelta: number | null
    maxHeroLevel: number
    eventTimeline: Record<string, EventTimelineEntry>
    stateAgeDays: number | null
    currentHeroGeneration: number | null
    nextHeroGeneration: number | null
    daysUntilNextHeroGeneration: number | null
    totalTroops: number
    troopCompositionPct: { infantry: number; lancer: number; marksman: number }
    troopsDelta: number | null
    hasMultipleTroopTiers: boolean
    heroNearStarUpgradeName: string | null
    heroNearStarUpgradePct: number
  }
}

const RESERVE_THRESHOLD_BY_PROFILE: Record<Profile['financialProfile'], number> = {
  f2p: 50000,
  low_spender: 40000,
  medium_spender: 25000,
  high_spender: 15000,
  whale: 10000,
}

// XP de VIP necessário para subir de cada nível para o seguinte (índice =
// nível de destino). O jogo não expõe "% do nível" diretamente — só o XP
// acumulado dentro do nível atual, que reseta ao subir. O usuário informa
// esse XP bruto (vipXp) e o motor calcula a % sozinho. 12 é o nível máximo.
// Fonte: docs/KNOWLEDGE-001-Game-Mechanics.md (seção VIP, whiteoutdata.com).
const VIP_XP_REQUIRED_FOR_LEVEL: Record<number, number> = {
  2: 2500,
  3: 5000,
  4: 12500,
  5: 30000,
  6: 40000,
  7: 70000,
  8: 100000,
  9: 350000,
  10: 600000,
  11: 1200000,
  12: 2400000,
}
const VIP_MAX_LEVEL = 12

function computeVipProgressPct(vipLevel: number, vipXp: number): number {
  if (vipLevel >= VIP_MAX_LEVEL) return 100
  const requiredForNext = VIP_XP_REQUIRED_FOR_LEVEL[vipLevel + 1]
  if (!requiredForNext) return 0
  return Math.min(100, Math.max(0, (vipXp / requiredForNext) * 100))
}

// Nível máximo de herói liberado por nível de Fornalha (cresce em marcos, não
// a cada nível). Fonte: docs/KNOWLEDGE-001-Game-Mechanics.md (seção Fornalha).
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

// Geração de herói por idade do estado (dias desde a fundação). Fonte:
// docs/KNOWLEDGE-001-Game-Mechanics.md (seção Heróis) — faixas aproximadas
// coletadas de guias, não confirmadas oficialmente.
const HERO_GENERATION_MILESTONES: [ageDays: number, generation: number][] = [
  [1, 1],
  [40, 2],
  [120, 3],
  [200, 4],
  [280, 5],
  [360, 6],
  [440, 7],
  [520, 8],
]

function computeHeroGenerationInfo(stateAgeDays: number | null): {
  currentHeroGeneration: number | null
  nextHeroGeneration: number | null
  daysUntilNextHeroGeneration: number | null
} {
  if (stateAgeDays === null) {
    return { currentHeroGeneration: null, nextHeroGeneration: null, daysUntilNextHeroGeneration: null }
  }
  let currentGeneration = 1
  let nextThreshold: number | null = null
  for (const [ageThreshold, generation] of HERO_GENERATION_MILESTONES) {
    if (stateAgeDays >= ageThreshold) {
      currentGeneration = generation
    } else {
      nextThreshold = ageThreshold
      break
    }
  }
  return {
    currentHeroGeneration: currentGeneration,
    nextHeroGeneration: nextThreshold !== null ? currentGeneration + 1 : null,
    daysUntilNextHeroGeneration: nextThreshold !== null ? nextThreshold - stateAgeDays : null,
  }
}

// Battle Domain (avaliação de tropas) — MVP enxuto: só total por tipo, sem
// granularidade por tier individual. Ver docs/BACKLOG-v1.md item C e
// docs/KNOWLEDGE-001-Game-Mechanics.md (seção Tropas) para a origem das
// proporções de referência usadas nas Strategy Cards.
// Soma as linhas de troopEntries (uma por tier possuído, ex.: "Infantaria
// Heróica nível VI: 7.848") por tipo — é assim que o jogo mostra o dado
// (por tier dentro de cada tipo, nunca um total agregado direto). Ver
// docs/BACKLOG-v1.md (sexta rodada) e KNOWLEDGE-001 (seção Tropas).
function sumTroopsByType(entries: TroopEntry[]): { infantry: number; lancer: number; marksman: number } {
  const totals = { infantry: 0, lancer: 0, marksman: 0 }
  for (const entry of entries) {
    totals[entry.type] += entry.quantity
  }
  return totals
}

function computeTroopComposition(
  infantry: number,
  lancer: number,
  marksman: number
): { infantry: number; lancer: number; marksman: number } {
  const total = infantry + lancer + marksman
  if (total === 0) return { infantry: 0, lancer: 0, marksman: 0 }
  return {
    infantry: (infantry / total) * 100,
    lancer: (lancer / total) * 100,
    marksman: (marksman / total) * 100,
  }
}

// Detecta se o jogador tem mais de um tier do MESMO tipo de tropa ao mesmo
// tempo (ex.: Infantaria V e Infantaria VI simultaneamente) — sinal de que
// pode valer mais promover o tier mais baixo do que treinar tropas novas no
// tier atual do zero (promoção custa só a diferença de tempo entre tiers;
// treinar do zero paga o tempo cheio). Não sabemos QUAL tier é mais baixo
// (tier é texto livre, sem ordem numérica confiável no motor), só que há
// mais de um — a Strategy Card fala em termos gerais, não aponta o tier
// específico. Ver docs/KNOWLEDGE-001-Game-Mechanics.md (seção Tropas).
function computeHasMultipleTroopTiers(entries: TroopEntry[]): boolean {
  const tiersByType: Record<string, Set<string>> = {}
  for (const entry of entries) {
    if (!entry.tier.trim()) continue
    if (!tiersByType[entry.type]) tiersByType[entry.type] = new Set()
    tiersByType[entry.type].add(entry.tier.trim())
  }
  return Object.values(tiersByType).some((tiers) => tiers.size > 1)
}

// Progresso relativo de fragmentos para a próxima estrela, entre os heróis
// que o jogador escolheu informar (campo opcional). Deliberadamente NÃO
// mantemos uma tabela de "fragmentos necessários por raridade/estrela" — o
// jogador informa os dois números direto da tela do herói no jogo (que já
// mostra "atual/necessário"), o motor só calcula a % e aponta o mais
// próximo de completar. Ver docs/BACKLOG-v1.md (décima quarta rodada) para a
// decisão de não replicar a calculadora de shards de ferramentas como a
// WoSTools — o objetivo aqui é priorização entre heróis, não custo exato.
function computeHeroShardProgress(heroes: HeroEntry[]): {
  heroNearStarUpgradeName: string | null
  heroNearStarUpgradePct: number
} {
  let bestName: string | null = null
  let bestPct = 0
  for (const hero of heroes) {
    if (hero.stars >= 5) continue // já no teto de estrela, nada a priorizar
    if (
      hero.shardsOwned === undefined ||
      hero.shardsRequiredForNextStar === undefined ||
      hero.shardsRequiredForNextStar <= 0
    ) {
      continue
    }
    const pct = Math.min(100, (hero.shardsOwned / hero.shardsRequiredForNextStar) * 100)
    if (pct > bestPct) {
      bestPct = pct
      bestName = hero.name
    }
  }
  return { heroNearStarUpgradeName: bestName, heroNearStarUpgradePct: bestPct }
}

export function computeStateAgeDays(stateFoundedDate: string | undefined, today: Date): number | null {
  if (!stateFoundedDate) return null
  const founded = new Date(stateFoundedDate)
  if (Number.isNaN(founded.getTime())) return null
  return Math.floor((today.getTime() - founded.getTime()) / 86_400_000)
}

export function buildContext(
  snapshot: WeeklySnapshot,
  profile: Profile,
  previousSnapshot: WeeklySnapshot | null,
  allSnapshots: WeeklySnapshot[] = []
): EvalContext {
  const stateAgeDays = computeStateAgeDays(profile.stateFoundedDate, new Date())
  const heroGenerationInfo = computeHeroGenerationInfo(stateAgeDays)
  const troopsByType = sumTroopsByType(snapshot.troopEntries ?? [])
  const totalTroops = troopsByType.infantry + troopsByType.lancer + troopsByType.marksman
  const previousTroopsByType = previousSnapshot ? sumTroopsByType(previousSnapshot.troopEntries ?? []) : null
  const previousTotalTroops = previousTroopsByType
    ? previousTroopsByType.infantry + previousTroopsByType.lancer + previousTroopsByType.marksman
    : null

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
      vipProgressPct: computeVipProgressPct(snapshot.vipLevel, snapshot.vipXp),
      powerDelta: previousSnapshot ? snapshot.power - previousSnapshot.power : null,
      gemsDelta: previousSnapshot ? snapshot.gems - previousSnapshot.gems : null,
      maxHeroLevel: computeMaxHeroLevel(snapshot.furnaceLevel),
      eventTimeline: computeEventTimeline(allSnapshots.length > 0 ? allSnapshots : [snapshot]),
      stateAgeDays,
      ...heroGenerationInfo,
      totalTroops,
      troopCompositionPct: computeTroopComposition(
        troopsByType.infantry,
        troopsByType.lancer,
        troopsByType.marksman
      ),
      troopsDelta: previousTotalTroops !== null ? totalTroops - previousTotalTroops : null,
      hasMultipleTroopTiers: computeHasMultipleTroopTiers(snapshot.troopEntries ?? []),
      ...computeHeroShardProgress(snapshot.heroes ?? []),
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

// Suporte a texto calculado: "{{caminho.para.valor}}" é substituído pelo
// valor real do contexto no momento da renderização. Se o caminho não
// existir (não deveria acontecer, já que as condições da própria card
// garantem que o valor existe antes dela disparar), o placeholder é mantido
// visível para facilitar debug em vez de quebrar silenciosamente.
function interpolate(text: string, context: EvalContext): string {
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, path: string) => {
    const value = getField(context, path)
    if (value === undefined || value === null) return match
    if (typeof value === 'number') return String(Math.round(value))
    return String(value)
  })
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
    .map((card) => ({
      ...card,
      recommendation: interpolate(card.recommendation, context),
      explanation: interpolate(card.explanation, context),
    }))
}
