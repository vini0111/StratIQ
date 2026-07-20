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

// Pets (Beast Cage, desbloqueado na Fornalha 18 + rollout de conteúdo — ver
// docs/KNOWLEDGE-001-Game-Mechanics.md seção Pets). Modelo enxuto de
// captura: só nome + nível, sem evolução (Marcas de Avanço/Selvagens) —
// esse domínio começou como visão geral da conta (décima oitava rodada,
// ver docs/BACKLOG-v1.md), sem Strategy Cards ainda; cards ficam para
// quando houver uma regra sourced e validada com uso real.
export interface PetEntry {
  name: string
  level: number
}

// Equipamento de herói (Hero Gear, desbloqueado na Fornalha 15). 4 slots
// fixos + 1 slot exclusivo só para heróis de raridade máxima (Lendário).
// Raridade em 5 níveis crescentes: Comum < Incomum < Raro < Épico < Lendário
// — nomenclatura confirmada pelo jogador contra o cliente em PT (o jogo usa
// essas palavras, não as cores usadas nos guias em inglês — Grey/Green/
// Blue/Purple/Gold descrevem a mesma estrutura de 5 níveis). Nível é o
// enhancement do item (0 a 100, depois disso pode ascender). Ver
// docs/KNOWLEDGE-001-Game-Mechanics.md (seção Equipamento de Herói).
export type GearSlot = 'elmo' | 'manopla' | 'cinto' | 'bota' | 'exclusivo'
export type GearRarity = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export interface HeroGearEntry {
  heroName: string
  slot: GearSlot
  rarity: GearRarity
  level: number
}

// Nível dos prédios da cidade além da Fornalha (que já tem campo próprio,
// furnaceLevel). Texto livre + sugestão via KNOWN_BUILDINGS (mesmo padrão de
// currentBuilding) em vez de lista fechada — o jogador reportou nomes que
// não batem 1:1 com KNOWN_BUILDINGS (ex.: "Quartel", "Hospital", "Campo de
// Lanceiros/Atiradores") e ainda não confirmamos se são sinônimos dos nomes
// já mapeados ou prédios distintos. Ver docs/KNOWLEDGE-001-Game-Mechanics.md
// (seção Fornalha/Cidade) e docs/BACKLOG-v1.md (vigésima rodada).
export interface BuildingLevelEntry {
  name: string
  level: number
}

// Chief Gear (equipamento de comandante, desbloqueado na Fornalha 22) — 6
// slots que desbloqueiam juntos: Elmo/Relógio (Lanceiro), Casaco/Calça
// (Infantaria), Anel/Bengala (Atirador). Progride por raridade em cores
// (Verde < Azul < Roxo < Roxo T1 < Dourado < Dourado T1 < Dourado T2 <
// Vermelho < Vermelho T1 < Vermelho T2 < Vermelho T3) e, dentro de cada cor,
// estrelas (0-3). Slot e raridade ficam como texto livre (não lista fechada
// como em Hero Gear) porque, diferente do Equipamento de Herói, ainda não
// temos confirmação do jogador contra o cliente em PT — mesma cautela usada
// em Prédios da Cidade. Ver docs/KNOWLEDGE-001-Game-Mechanics.md (seção
// Chief Gear) e docs/BACKLOG-v1.md (vigésima quinta rodada).
export interface ChiefGearEntry {
  slot: string
  tier: string
  stars: number
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
  // Pets desbloqueados (Beast Cage) — captura simples de nome + nível, sem
  // recomendação atrelada por enquanto. Ver docs/BACKLOG-v1.md (décima
  // oitava rodada).
  petEntries?: PetEntry[]
  // Equipamento de herói (opcional, por herói+slot). Ver docs/BACKLOG-v1.md
  // (décima nona rodada).
  heroGearEntries?: HeroGearEntry[]
  // Nível dos prédios da cidade (fora a Fornalha). Ver docs/BACKLOG-v1.md
  // (vigésima rodada).
  buildingLevels?: BuildingLevelEntry[]
  // Ranking da aliança no servidor (número que o próprio jogo mostra) e se a
  // aliança participa de todos os eventos — captura simples, sem Strategy
  // Card atrelada. O nome da aliança já é capturado em profile.alliance
  // (definido uma vez no perfil, não muda a cada check-in); rank e
  // participação variam e por isso ficam aqui. Ver docs/BACKLOG-v1.md
  // (vigésima primeira rodada, última desta expansão de escopo).
  allianceRank?: number
  allianceParticipatesAllEvents?: boolean
  // Chief Gear (opcional, captura simples por slot). Ver docs/BACKLOG-v1.md
  // (vigésima quinta rodada).
  chiefGearEntries?: ChiefGearEntry[]
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
