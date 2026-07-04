import type { Profile, WeeklySnapshot } from '../types'

// Supabase/Postgres usa snake_case; a aplicação usa camelCase.
// Mantém essa conversão isolada aqui para não espalhar snake_case pela UI.

export function profileFromRow(row: any): Profile {
  return {
    id: row.id,
    stateNumber: row.state_number,
    alliance: row.alliance ?? '',
    financialProfile: row.financial_profile,
    objective: row.objective,
    hasSecondBuilder: row.has_second_builder ?? false,
    stateFoundedDate: row.state_founded_date ?? undefined,
    createdAt: row.created_at,
  }
}

export function profileToRow(profile: Omit<Profile, 'id' | 'createdAt'>, userId: string) {
  return {
    id: userId,
    state_number: profile.stateNumber,
    alliance: profile.alliance,
    financial_profile: profile.financialProfile,
    objective: profile.objective,
    has_second_builder: profile.hasSecondBuilder,
    state_founded_date: profile.stateFoundedDate || null,
  }
}

export function snapshotFromRow(row: any): WeeklySnapshot {
  return {
    id: row.id,
    profileId: row.profile_id,
    snapshotDate: row.snapshot_date,
    furnaceLevel: row.furnace_level,
    vipLevel: row.vip_level,
    vipProgressPct: row.vip_progress_pct,
    gems: row.gems,
    accelGeneralDays: row.accel_general_days ?? 0,
    accelTrainingDays: row.accel_training_days,
    accelConstructionDays: row.accel_construction_days,
    accelResearchDays: row.accel_research_days,
    accelHealingDays: row.accel_healing_days ?? 0,
    currentEvents: row.current_events ?? [],
    power: row.power,
    heroes: row.heroes ?? [],
    currentResearch: row.current_research ?? '',
    currentBuilding: row.current_building ?? '',
    currentBuilding2: row.current_building_2 ?? '',
    troopsInfantry: row.troops_infantry ?? 0,
    troopsLancer: row.troops_lancer ?? 0,
    troopsMarksman: row.troops_marksman ?? 0,
    highestTierTraining: row.highest_tier_training ?? undefined,
    weeklyQuestion: row.weekly_question ?? '',
    createdAt: row.created_at,
  }
}

export function snapshotToRow(
  snapshot: Omit<WeeklySnapshot, 'id' | 'profileId' | 'createdAt'>,
  profileId: string
) {
  return {
    profile_id: profileId,
    snapshot_date: snapshot.snapshotDate,
    furnace_level: snapshot.furnaceLevel,
    vip_level: snapshot.vipLevel,
    vip_progress_pct: snapshot.vipProgressPct,
    gems: snapshot.gems,
    accel_general_days: snapshot.accelGeneralDays,
    accel_training_days: snapshot.accelTrainingDays,
    accel_construction_days: snapshot.accelConstructionDays,
    accel_research_days: snapshot.accelResearchDays,
    accel_healing_days: snapshot.accelHealingDays,
    current_events: snapshot.currentEvents,
    power: snapshot.power,
    heroes: snapshot.heroes,
    current_research: snapshot.currentResearch,
    current_building: snapshot.currentBuilding,
    current_building_2: snapshot.currentBuilding2 || null,
    troops_infantry: snapshot.troopsInfantry,
    troops_lancer: snapshot.troopsLancer,
    troops_marksman: snapshot.troopsMarksman,
    highest_tier_training: snapshot.highestTierTraining || null,
    weekly_question: snapshot.weeklyQuestion,
  }
}
