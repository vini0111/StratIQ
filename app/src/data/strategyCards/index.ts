import type { StrategyCard } from '../../types'

// Cada regra é um arquivo de dados independente (Strategy Card).
// Adicionar/ajustar uma regra = editar/criar um JSON aqui, sem tocar no motor
// (src/lib/strategyEngine.ts). Ver docs/MVP-001-Escopo-e-Estrutura.md e
// docs/KNOWLEDGE-001-Game-Mechanics.md (fonte do conhecimento por trás de
// cada card citada no campo "explanation").

import saveGemsBaselineReserve from './save_gems_baseline_reserve.json'
import spendGemsLuckyWheel from './spend_gems_lucky_wheel.json'
import vipNearLevelUp from './vip_near_level_up.json'
import acceleratorHoardingConstruction from './accelerator_hoarding_construction.json'
import acceleratorHoardingResearch from './accelerator_hoarding_research.json'
import acceleratorHoardingTraining from './accelerator_hoarding_training.json'
import idleConstructionQueue from './idle_construction_queue.json'
import idleConstructionQueue2 from './idle_construction_queue_2.json'
import idleResearchQueue from './idle_research_queue.json'
import favoriteHeroLowestStars from './favorite_hero_lowest_stars.json'
import powerStagnation from './power_stagnation.json'
import svsEventPriority from './svs_event_priority.json'
import bearTrapEventPriority from './bear_trap_event_priority.json'
import allianceMobilizationSaveSpeedups from './alliance_mobilization_save_speedups.json'
import bearTrapDpsComposition from './bear_trap_dps_composition.json'
import frostfireSoloPrep from './frostfire_solo_prep.json'
import researchTreeGrowthFirst from './research_tree_growth_first.json'
import f2pHeroPriorityFlint from './f2p_hero_priority_flint.json'
import f2pHeroPriorityBlanchette from './f2p_hero_priority_blanchette.json'
import f2pHeroPriorityEleonora from './f2p_hero_priority_eleonora.json'
import zinmanUtilityPriority from './zinman_utility_priority.json'
import furnace18PetsUnlocked from './furnace_18_pets_unlocked.json'
import furnace20MasteryForging from './furnace_20_mastery_forging.json'
import furnace22ChiefGear from './furnace_22_chief_gear.json'
import furnace25ChiefGearCharms from './furnace_25_chief_gear_charms.json'
import furnace30FireCrystal from './furnace_30_fire_crystal.json'
import heroAtLevelCap from './hero_at_level_cap.json'

export const strategyCards = [
  saveGemsBaselineReserve,
  spendGemsLuckyWheel,
  vipNearLevelUp,
  acceleratorHoardingConstruction,
  acceleratorHoardingResearch,
  acceleratorHoardingTraining,
  idleConstructionQueue,
  idleConstructionQueue2,
  idleResearchQueue,
  favoriteHeroLowestStars,
  powerStagnation,
  svsEventPriority,
  bearTrapEventPriority,
  allianceMobilizationSaveSpeedups,
  bearTrapDpsComposition,
  frostfireSoloPrep,
  researchTreeGrowthFirst,
  f2pHeroPriorityFlint,
  f2pHeroPriorityBlanchette,
  f2pHeroPriorityEleonora,
  zinmanUtilityPriority,
  furnace18PetsUnlocked,
  furnace20MasteryForging,
  furnace22ChiefGear,
  furnace25ChiefGearCharms,
  furnace30FireCrystal,
  heroAtLevelCap,
] as unknown as StrategyCard[]
