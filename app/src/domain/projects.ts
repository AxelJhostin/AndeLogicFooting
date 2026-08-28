export const PROJECT_SCHEMA_VERSION = 1

import type { StandardProfileId } from '../standards/profiles'

export type StandardProfile = StandardProfileId

export type FootingInputs = {
  axialLoadKn: number
  factoredAxialLoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  columnWidthM: number
  columnLengthM: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  developmentAvailableLengthWidthM: number
  developmentAvailableLengthLengthM: number
  punchingCriticalSectionOffsetM: number
  barsParallelToWidthMaxSpacingM: number
  barsParallelToLengthMaxSpacingM: number
}

export const DEFAULT_FOOTING_THICKNESS_M = 0.45

export type ProjectDocument = {
  schemaVersion: number
  projectId: string
  name: string
  createdAt: string
  updatedAt: string
  productVersion: string
  engineVersion: string
  standardProfile: StandardProfile
  inputSnapshot: FootingInputs
  warnings: string[]
}

const now = () => new Date().toISOString()

export function createNewProject(): ProjectDocument {
  const timestamp = now()

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: crypto.randomUUID(),
    name: 'Zapata sin título',
    createdAt: timestamp,
    updatedAt: timestamp,
    productVersion: '0.1.0-prototype',
    engineVersion: 'not-implemented',
    standardProfile: 'NEC-2015-GUIDE-TRACEABLE',
    inputSnapshot: {
      axialLoadKn: 0,
      factoredAxialLoadKn: 0,
      allowableBearingKpa: 0,
      bearingCapacityBasis: 'gross',
      removedOverburdenKpa: 0,
      concreteUnitWeightKnM3: 24,
      soilCoverDepthM: 0,
      soilUnitWeightKnM3: 0,
      columnWidthM: 0.3,
      columnLengthM: 0.3,
      footingWidthM: 1.5,
      footingLengthM: 1.5,
      footingThicknessM: DEFAULT_FOOTING_THICKNESS_M,
      concreteCoverM: 0.075,
      barDiameterM: 0.016,
      concreteStrengthMpa: 0,
      steelYieldStrengthMpa: 0,
      developmentAvailableLengthWidthM: 0,
      developmentAvailableLengthLengthM: 0,
      punchingCriticalSectionOffsetM: 0,
      barsParallelToWidthMaxSpacingM: 0,
      barsParallelToLengthMaxSpacingM: 0,
    },
    warnings: [
      'El contacto de servicio y la demanda de cortante son módulos internos; la resistencia estructural normativa todavía no está implementada.',
    ],
  }
}

/** Mantiene legibles los proyectos locales creados antes de añadir entradas de contacto de servicio. */
export function normalizeProjectDocument(project: ProjectDocument): ProjectDocument {
  const legacyInputs = project.inputSnapshot as Partial<FootingInputs>
  const footingThicknessM = Number.isFinite(legacyInputs.footingThicknessM) && legacyInputs.footingThicknessM! > 0
    ? legacyInputs.footingThicknessM!
    : DEFAULT_FOOTING_THICKNESS_M
  const concreteUnitWeightKnM3 = Number.isFinite(legacyInputs.concreteUnitWeightKnM3) && legacyInputs.concreteUnitWeightKnM3! > 0
    ? legacyInputs.concreteUnitWeightKnM3!
    : 24
  const bearingCapacityBasis = legacyInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross'
  const concreteCoverM = Number.isFinite(legacyInputs.concreteCoverM) && legacyInputs.concreteCoverM! >= 0
    ? legacyInputs.concreteCoverM!
    : 0.075
  const barDiameterM = Number.isFinite(legacyInputs.barDiameterM) && legacyInputs.barDiameterM! > 0
    ? legacyInputs.barDiameterM!
    : 0.016
  const punchingCriticalSectionOffsetM = Number.isFinite(legacyInputs.punchingCriticalSectionOffsetM) && legacyInputs.punchingCriticalSectionOffsetM! >= 0
    ? legacyInputs.punchingCriticalSectionOffsetM!
    : 0
  const legacyProfile: string = project.standardProfile
  const standardProfile = legacyProfile === 'NEC-2015-GUIDE-TRACEABLE' || legacyProfile === 'NEC-PUBLIC-2014-PENDING' || legacyProfile === 'NEC-PENDING'
    ? 'NEC-2015-GUIDE-TRACEABLE'
    : 'ARCHIVED-UNSUPPORTED'

  return {
    ...project,
    standardProfile,
    inputSnapshot: {
      ...project.inputSnapshot,
      footingThicknessM,
      bearingCapacityBasis,
      removedOverburdenKpa: Number.isFinite(legacyInputs.removedOverburdenKpa) && legacyInputs.removedOverburdenKpa! >= 0 ? legacyInputs.removedOverburdenKpa! : 0,
      concreteUnitWeightKnM3,
      soilCoverDepthM: Number.isFinite(legacyInputs.soilCoverDepthM) && legacyInputs.soilCoverDepthM! >= 0 ? legacyInputs.soilCoverDepthM! : 0,
      soilUnitWeightKnM3: Number.isFinite(legacyInputs.soilUnitWeightKnM3) && legacyInputs.soilUnitWeightKnM3! >= 0 ? legacyInputs.soilUnitWeightKnM3! : 0,
      factoredAxialLoadKn: Number.isFinite(legacyInputs.factoredAxialLoadKn) && legacyInputs.factoredAxialLoadKn! >= 0 ? legacyInputs.factoredAxialLoadKn! : 0,
      concreteCoverM,
      barDiameterM,
      concreteStrengthMpa: Number.isFinite(legacyInputs.concreteStrengthMpa) && legacyInputs.concreteStrengthMpa! >= 0 ? legacyInputs.concreteStrengthMpa! : 0,
      steelYieldStrengthMpa: Number.isFinite(legacyInputs.steelYieldStrengthMpa) && legacyInputs.steelYieldStrengthMpa! >= 0 ? legacyInputs.steelYieldStrengthMpa! : 0,
      developmentAvailableLengthWidthM: Number.isFinite(legacyInputs.developmentAvailableLengthWidthM) && legacyInputs.developmentAvailableLengthWidthM! >= 0 ? legacyInputs.developmentAvailableLengthWidthM! : 0,
      developmentAvailableLengthLengthM: Number.isFinite(legacyInputs.developmentAvailableLengthLengthM) && legacyInputs.developmentAvailableLengthLengthM! >= 0 ? legacyInputs.developmentAvailableLengthLengthM! : 0,
      punchingCriticalSectionOffsetM,
      barsParallelToWidthMaxSpacingM: Number.isFinite(legacyInputs.barsParallelToWidthMaxSpacingM) && legacyInputs.barsParallelToWidthMaxSpacingM! >= 0 ? legacyInputs.barsParallelToWidthMaxSpacingM! : 0,
      barsParallelToLengthMaxSpacingM: Number.isFinite(legacyInputs.barsParallelToLengthMaxSpacingM) && legacyInputs.barsParallelToLengthMaxSpacingM! >= 0 ? legacyInputs.barsParallelToLengthMaxSpacingM! : 0,
    },
  }
}

export function isProjectDocument(value: unknown): value is ProjectDocument {
  if (!value || typeof value !== 'object') return false

  const document = value as Partial<ProjectDocument>
  return (
    document.schemaVersion === PROJECT_SCHEMA_VERSION &&
    typeof document.projectId === 'string' &&
    typeof document.name === 'string' &&
    typeof document.createdAt === 'string' &&
    typeof document.updatedAt === 'string' &&
    typeof document.standardProfile === 'string' &&
    typeof document.inputSnapshot === 'object' &&
    document.inputSnapshot !== null &&
    Array.isArray(document.warnings)
  )
}
