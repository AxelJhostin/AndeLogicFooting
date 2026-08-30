export const PROJECT_SCHEMA_VERSION = 7

import type { StandardProfileId } from '../standards/profiles'

export type StandardProfile = StandardProfileId

export type FootingType = 'isolated' | 'strip' | 'combined' | 'strap' | 'trapezoidal' | 'edge' | 'corner' | 'mat'

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

export type StripFootingInputs = {
  serviceLineLoadKnM: number
  factoredLineLoadKnM: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  wallThicknessM: number
  footingWidthM: number
  footingThicknessM: number
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  transverseBarSpacingM: number
  longitudinalBarSpacingM: number
  developmentAvailableLengthM: number
}

export type CombinedFootingInputs = {
  serviceColumn1LoadKn: number
  serviceColumn2LoadKn: number
  factoredColumn1LoadKn: number
  factoredColumn2LoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  column1WidthM: number
  column1LengthM: number
  column1CenterFromLeftM: number
  column2WidthM: number
  column2LengthM: number
  column2CenterFromLeftM: number
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  longitudinalBottomBarSpacingM: number
  longitudinalTopBarSpacingM: number
  transverseBarSpacingM: number
  longitudinalDevelopmentAvailableM: number
  transverseDevelopmentAvailableM: number
}

export type StrapFootingInputs = {
  serviceExteriorLoadKn: number
  serviceInteriorLoadKn: number
  factoredExteriorLoadKn: number
  factoredInteriorLoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  exteriorFootingWidthM: number
  exteriorFootingLengthM: number
  exteriorFootingThicknessM: number
  interiorFootingWidthM: number
  interiorFootingLengthM: number
  interiorFootingThicknessM: number
  footingCenterSpacingM: number
  exteriorColumnWidthM: number
  exteriorColumnLengthM: number
  exteriorColumnCenterFromOuterEdgeM: number
  interiorColumnWidthM: number
  interiorColumnLengthM: number
  strapBeamWidthM: number
  strapBeamDepthM: number
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  padLongitudinalBarSpacingM: number
  padTransverseBarSpacingM: number
  beamLongitudinalBarCount: number
  padDevelopmentAvailableM: number
  beamDevelopmentAvailableM: number
}

export type TrapezoidalFootingInputs = {
  serviceColumn1LoadKn: number
  serviceColumn2LoadKn: number
  factoredColumn1LoadKn: number
  factoredColumn2LoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  leftFootingWidthM: number
  rightFootingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  column1WidthM: number
  column1LengthM: number
  column1CenterFromLeftM: number
  column2WidthM: number
  column2LengthM: number
  column2CenterFromLeftM: number
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  longitudinalBottomBarSpacingM: number
  longitudinalTopBarSpacingM: number
  transverseBarSpacingM: number
  longitudinalDevelopmentAvailableM: number
  transverseDevelopmentAvailableM: number
}

export type EdgeFootingInputs = {
  serviceAxialLoadKn: number
  factoredAxialLoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  columnWidthM: number
  columnLengthM: number
  edgeSide: 'left' | 'right'
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  longitudinalBarSpacingM: number
  transverseBarSpacingM: number
  longitudinalDevelopmentAvailableM: number
  transverseDevelopmentAvailableM: number
}

export type CornerPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

export type CornerFootingInputs = {
  serviceAxialLoadKn: number
  factoredAxialLoadKn: number
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  columnWidthM: number
  columnLengthM: number
  cornerPosition: CornerPosition
  concreteCoverM: number
  barDiameterM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  longitudinalBarSpacingM: number
  transverseBarSpacingM: number
  longitudinalDevelopmentAvailableM: number
  transverseDevelopmentAvailableM: number
}

export type MatColumnInput = {
  id: string
  label: string
  serviceLoadKn: number
  factoredLoadKn: number
  widthM: number
  lengthM: number
  centerXM: number
  centerYM: number
}

export type MatFootingInputs = {
  allowableBearingKpa: number
  bearingCapacityBasis: 'gross' | 'net'
  removedOverburdenKpa: number
  settlementPressureBasis: 'gross' | 'net'
  subgradeModulusKnM3: number
  allowableTotalSettlementMm: number
  allowableDifferentialSettlementMm: number
  concreteUnitWeightKnM3: number
  soilCoverDepthM: number
  soilUnitWeightKnM3: number
  footingWidthM: number
  footingLengthM: number
  footingThicknessM: number
  columns: MatColumnInput[]
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
  footingType: FootingType
  inputSnapshot: FootingInputs
  stripInputSnapshot: StripFootingInputs
  combinedInputSnapshot: CombinedFootingInputs
  strapInputSnapshot: StrapFootingInputs
  trapezoidalInputSnapshot: TrapezoidalFootingInputs
  edgeInputSnapshot: EdgeFootingInputs
  cornerInputSnapshot: CornerFootingInputs
  matInputSnapshot: MatFootingInputs
  warnings: string[]
}

export const DEFAULT_STRIP_FOOTING_INPUTS: StripFootingInputs = {
  serviceLineLoadKnM: 180,
  factoredLineLoadKnM: 270,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  wallThicknessM: 0.2,
  footingWidthM: 1.2,
  footingThicknessM: 0.35,
  concreteCoverM: 0.075,
  barDiameterM: 0.012,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  transverseBarSpacingM: 0.15,
  longitudinalBarSpacingM: 0.15,
  developmentAvailableLengthM: 0.42,
}

export const DEFAULT_COMBINED_FOOTING_INPUTS: CombinedFootingInputs = {
  serviceColumn1LoadKn: 700,
  serviceColumn2LoadKn: 900,
  factoredColumn1LoadKn: 980,
  factoredColumn2LoadKn: 1260,
  allowableBearingKpa: 200,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 2.2,
  footingLengthM: 5.4,
  footingThicknessM: 0.55,
  column1WidthM: 0.45,
  column1LengthM: 0.45,
  column1CenterFromLeftM: 0.8,
  column2WidthM: 0.5,
  column2LengthM: 0.5,
  column2CenterFromLeftM: 4.2,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBottomBarSpacingM: 0.15,
  longitudinalTopBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 1.1,
  transverseDevelopmentAvailableM: 1.1,
}

export const DEFAULT_STRAP_FOOTING_INPUTS: StrapFootingInputs = {
  serviceExteriorLoadKn: 600,
  serviceInteriorLoadKn: 900,
  factoredExteriorLoadKn: 900,
  factoredInteriorLoadKn: 1350,
  allowableBearingKpa: 250,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  exteriorFootingWidthM: 2,
  exteriorFootingLengthM: 1.6,
  exteriorFootingThicknessM: 0.5,
  interiorFootingWidthM: 2.4,
  interiorFootingLengthM: 2.2,
  interiorFootingThicknessM: 0.55,
  footingCenterSpacingM: 5,
  exteriorColumnWidthM: 0.4,
  exteriorColumnLengthM: 0.4,
  exteriorColumnCenterFromOuterEdgeM: 0.5,
  interiorColumnWidthM: 0.5,
  interiorColumnLengthM: 0.5,
  strapBeamWidthM: 0.35,
  strapBeamDepthM: 0.65,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  padLongitudinalBarSpacingM: 0.15,
  padTransverseBarSpacingM: 0.15,
  beamLongitudinalBarCount: 6,
  padDevelopmentAvailableM: 1.1,
  beamDevelopmentAvailableM: 1.2,
}

export const DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS: TrapezoidalFootingInputs = {
  serviceColumn1LoadKn: 500,
  serviceColumn2LoadKn: 700,
  factoredColumn1LoadKn: 750,
  factoredColumn2LoadKn: 1050,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  leftFootingWidthM: 1.5,
  rightFootingWidthM: 2.5,
  footingLengthM: 6,
  footingThicknessM: 0.5,
  column1WidthM: 0.4,
  column1LengthM: 0.4,
  column1CenterFromLeftM: 0.75,
  column2WidthM: 0.4,
  column2LengthM: 0.4,
  column2CenterFromLeftM: 5.035714285714286,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBottomBarSpacingM: 0.15,
  longitudinalTopBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 0.8,
  transverseDevelopmentAvailableM: 0.8,
}

export const DEFAULT_EDGE_FOOTING_INPUTS: EdgeFootingInputs = {
  serviceAxialLoadKn: 160,
  factoredAxialLoadKn: 240,
  allowableBearingKpa: 250,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 2.4,
  footingLengthM: 0.6,
  footingThicknessM: 0.5,
  columnWidthM: 0.4,
  columnLengthM: 0.45,
  edgeSide: 'left',
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 0.5,
  transverseDevelopmentAvailableM: 1,
}

export const DEFAULT_CORNER_FOOTING_INPUTS: CornerFootingInputs = {
  serviceAxialLoadKn: 40,
  factoredAxialLoadKn: 60,
  allowableBearingKpa: 450,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 0.525,
  footingLengthM: 0.525,
  footingThicknessM: 0.5,
  columnWidthM: 0.45,
  columnLengthM: 0.45,
  cornerPosition: 'bottom-left',
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 1.1,
  transverseDevelopmentAvailableM: 1.1,
}

export const DEFAULT_MAT_FOOTING_INPUTS: MatFootingInputs = {
  allowableBearingKpa: 150,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  settlementPressureBasis: 'gross',
  subgradeModulusKnM3: 15000,
  allowableTotalSettlementMm: 25,
  allowableDifferentialSettlementMm: 12.5,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 6,
  footingLengthM: 8,
  footingThicknessM: 0.7,
  columns: [
    { id: 'C1', label: 'Columna 1', serviceLoadKn: 600, factoredLoadKn: 900, widthM: 0.5, lengthM: 0.5, centerXM: 2, centerYM: 1.5 },
    { id: 'C2', label: 'Columna 2', serviceLoadKn: 800, factoredLoadKn: 1200, widthM: 0.5, lengthM: 0.5, centerXM: 6, centerYM: 1.5 },
    { id: 'C3', label: 'Columna 3', serviceLoadKn: 700, factoredLoadKn: 1050, widthM: 0.5, lengthM: 0.5, centerXM: 2, centerYM: 4.5 },
    { id: 'C4', label: 'Columna 4', serviceLoadKn: 900, factoredLoadKn: 1350, widthM: 0.5, lengthM: 0.5, centerXM: 6, centerYM: 4.5 },
  ],
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
    footingType: 'isolated',
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
    stripInputSnapshot: { ...DEFAULT_STRIP_FOOTING_INPUTS },
    combinedInputSnapshot: { ...DEFAULT_COMBINED_FOOTING_INPUTS },
    strapInputSnapshot: { ...DEFAULT_STRAP_FOOTING_INPUTS },
    trapezoidalInputSnapshot: { ...DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS },
    edgeInputSnapshot: { ...DEFAULT_EDGE_FOOTING_INPUTS },
    cornerInputSnapshot: { ...DEFAULT_CORNER_FOOTING_INPUTS },
    matInputSnapshot: { ...DEFAULT_MAT_FOOTING_INPUTS, columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column) => ({ ...column })) },
    warnings: [
      'Las demandas se calculan internamente; las resistencias disponibles se presentan como referencias de guía trazables y no como aprobación normativa.',
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
  const legacyProject = project as ProjectDocument & {
    footingType?: FootingType
    stripInputSnapshot?: Partial<StripFootingInputs>
    combinedInputSnapshot?: Partial<CombinedFootingInputs>
    strapInputSnapshot?: Partial<StrapFootingInputs>
    trapezoidalInputSnapshot?: Partial<TrapezoidalFootingInputs>
    edgeInputSnapshot?: Partial<EdgeFootingInputs>
    cornerInputSnapshot?: Partial<CornerFootingInputs>
    matInputSnapshot?: Partial<MatFootingInputs>
  }
  const stripInputs = legacyProject.stripInputSnapshot ?? {}
  const combinedInputs = legacyProject.combinedInputSnapshot ?? {}
  const strapInputs = legacyProject.strapInputSnapshot ?? {}
  const trapezoidalInputs = legacyProject.trapezoidalInputSnapshot ?? {}
  const edgeInputs = legacyProject.edgeInputSnapshot ?? {}
  const cornerInputs = legacyProject.cornerInputSnapshot ?? {}
  const matInputs = legacyProject.matInputSnapshot ?? {}
  const standardProfile = legacyProfile === 'NEC-2015-GUIDE-TRACEABLE' || legacyProfile === 'NEC-PUBLIC-2014-PENDING' || legacyProfile === 'NEC-PENDING'
    ? 'NEC-2015-GUIDE-TRACEABLE'
    : 'ARCHIVED-UNSUPPORTED'

  return {
    ...project,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    standardProfile,
    footingType: legacyProject.footingType === 'strip' || legacyProject.footingType === 'combined' || legacyProject.footingType === 'strap' || legacyProject.footingType === 'trapezoidal' || legacyProject.footingType === 'edge' || legacyProject.footingType === 'corner' || legacyProject.footingType === 'mat' ? legacyProject.footingType : 'isolated',
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
    stripInputSnapshot: {
      ...DEFAULT_STRIP_FOOTING_INPUTS,
      ...stripInputs,
      bearingCapacityBasis: stripInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
    },
    combinedInputSnapshot: {
      ...DEFAULT_COMBINED_FOOTING_INPUTS,
      ...combinedInputs,
      bearingCapacityBasis: combinedInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
    },
    strapInputSnapshot: {
      ...DEFAULT_STRAP_FOOTING_INPUTS,
      ...strapInputs,
      bearingCapacityBasis: strapInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
    },
    trapezoidalInputSnapshot: {
      ...DEFAULT_TRAPEZOIDAL_FOOTING_INPUTS,
      ...trapezoidalInputs,
      bearingCapacityBasis: trapezoidalInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
    },
    edgeInputSnapshot: {
      ...DEFAULT_EDGE_FOOTING_INPUTS,
      ...edgeInputs,
      bearingCapacityBasis: edgeInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
      edgeSide: edgeInputs.edgeSide === 'right' ? 'right' : 'left',
    },
    cornerInputSnapshot: {
      ...DEFAULT_CORNER_FOOTING_INPUTS,
      ...cornerInputs,
      bearingCapacityBasis: cornerInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
      cornerPosition: cornerInputs.cornerPosition === 'bottom-right' || cornerInputs.cornerPosition === 'top-left' || cornerInputs.cornerPosition === 'top-right'
        ? cornerInputs.cornerPosition
        : 'bottom-left',
    },
    matInputSnapshot: {
      ...DEFAULT_MAT_FOOTING_INPUTS,
      ...matInputs,
      bearingCapacityBasis: matInputs.bearingCapacityBasis === 'net' ? 'net' : 'gross',
      settlementPressureBasis: matInputs.settlementPressureBasis === 'net' ? 'net' : 'gross',
      columns: Array.isArray(matInputs.columns) && matInputs.columns.length
        ? matInputs.columns.map((column) => ({ ...column }))
        : DEFAULT_MAT_FOOTING_INPUTS.columns.map((column) => ({ ...column })),
    },
  }
}

export function isProjectDocument(value: unknown): value is ProjectDocument {
  if (!value || typeof value !== 'object') return false

  const document = value as Partial<ProjectDocument>
  return (
    typeof document.schemaVersion === 'number' &&
    document.schemaVersion >= 1 &&
    document.schemaVersion <= PROJECT_SCHEMA_VERSION &&
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
