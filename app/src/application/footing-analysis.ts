import type { ProjectDocument } from '../domain/projects'
import { calculateServiceContact, type ServiceContactResult } from '../domain/footing/service-contact'
import { calculateOneWayShearDemand, type OneWayShearDemandResult } from '../domain/footing/one-way-shear-demand'
import { calculateFlexureDemand, type FlexureDemandResult } from '../domain/footing/flexure-demand'
import { calculatePunchingShearDemand, type PunchingShearDemandResult } from '../domain/footing/punching-shear-demand'
import { calculateReinforcementLayout, type ReinforcementLayoutResult } from '../domain/footing/reinforcement-layout'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../domain/footing/minimum-reinforcement'
import { calculateGuideRequiredReinforcement, type GuideRequiredReinforcementResult } from '../domain/footing/required-reinforcement'
import { compareGuideReinforcement, type GuideReinforcementComparisonResult } from '../domain/footing/reinforcement-comparison'
import { checkGuideOneWayShear, type GuideOneWayShearCheckResult } from '../domain/footing/one-way-shear-guide-check'
import { checkGuidePunchingShear, type GuidePunchingShearResult } from '../domain/footing/punching-shear-guide-check'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from '../domain/footing/development-length-guide-check'
import { validateGuideRequiredReinforcementInputs, type ValidationIssue } from '../domain/validation/footing-input'

export type FootingAnalysis = {
  contact: ServiceContactResult
  oneWay: OneWayShearDemandResult
  flexure: FlexureDemandResult
  punchingDemand: PunchingShearDemandResult | null
  reinforcementLayout: ReinforcementLayoutResult
  minimumReinforcement: MinimumReinforcementResult
  requiredReinforcement: GuideRequiredReinforcementResult
  reinforcement: GuideReinforcementComparisonResult
  oneWayGuide: GuideOneWayShearCheckResult
  punchingGuide: GuidePunchingShearResult
  development: GuideDevelopmentLengthResult
}

export type FootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: ValidationIssue[] }
  | { status: 'calculated'; analysis: FootingAnalysis }

/**
 * Orquesta las verificaciones disponibles para un caso dentro del alcance.
 * La UI consume este resultado; no replica fórmulas ni decide criterios técnicos.
 */
export function analyzeFootingCase(project: ProjectDocument): FootingAnalysisOutcome {
  const data = project.inputSnapshot
  const issues = validateGuideRequiredReinforcementInputs(data)
  if (issues.length > 0) return { status: 'invalid-input', issues }

  const contact = calculateServiceContact({
    appliedServiceLoadKn: data.axialLoadKn,
    footingWidthM: data.footingWidthM,
    footingLengthM: data.footingLengthM,
    footingThicknessM: data.footingThicknessM,
    concreteUnitWeightKnM3: data.concreteUnitWeightKnM3,
    soilCoverDepthM: data.soilCoverDepthM,
    soilUnitWeightKnM3: data.soilUnitWeightKnM3,
    allowableBearingKpa: data.allowableBearingKpa,
    bearingCapacityBasis: data.bearingCapacityBasis,
    removedOverburdenKpa: data.removedOverburdenKpa,
  })
  const oneWay = calculateOneWayShearDemand({
    factoredAxialLoadKn: data.factoredAxialLoadKn,
    footingWidthM: data.footingWidthM,
    footingLengthM: data.footingLengthM,
    columnWidthM: data.columnWidthM,
    columnLengthM: data.columnLengthM,
    footingThicknessM: data.footingThicknessM,
    concreteCoverM: data.concreteCoverM,
    barDiameterM: data.barDiameterM,
  })
  const flexure = calculateFlexureDemand({
    factoredAxialLoadKn: data.factoredAxialLoadKn,
    footingWidthM: data.footingWidthM,
    footingLengthM: data.footingLengthM,
    columnWidthM: data.columnWidthM,
    columnLengthM: data.columnLengthM,
  })
  let punchingDemand: PunchingShearDemandResult | null = null
  if (data.punchingCriticalSectionOffsetM > 0) {
    try {
      punchingDemand = calculatePunchingShearDemand({
        factoredAxialLoadKn: data.factoredAxialLoadKn,
        footingWidthM: data.footingWidthM,
        footingLengthM: data.footingLengthM,
        columnWidthM: data.columnWidthM,
        columnLengthM: data.columnLengthM,
        criticalSectionOffsetM: data.punchingCriticalSectionOffsetM,
      })
    } catch {
      // La demanda declarada de punzonamiento es opcional para la referencia de guía.
    }
  }
  const reinforcementLayout = calculateReinforcementLayout({
    footingWidthM: data.footingWidthM,
    footingLengthM: data.footingLengthM,
    concreteCoverM: data.concreteCoverM,
    barDiameterM: data.barDiameterM,
    barsParallelToWidthMaxSpacingM: data.barsParallelToWidthMaxSpacingM,
    barsParallelToLengthMaxSpacingM: data.barsParallelToLengthMaxSpacingM,
  })
  const oneWayGuide = checkGuideOneWayShear({
    concreteStrengthMpa: data.concreteStrengthMpa,
    effectiveDepthM: oneWay.effectiveDepthM,
    widthShearDemandKn: oneWay.widthDirection.shearDemandKn,
    widthSectionWidthM: oneWay.widthDirection.tributaryWidthM,
    lengthShearDemandKn: oneWay.lengthDirection.shearDemandKn,
    lengthSectionWidthM: oneWay.lengthDirection.tributaryWidthM,
  })
  const punchingGuide = checkGuidePunchingShear({
    concreteStrengthMpa: data.concreteStrengthMpa,
    factoredAxialLoadKn: data.factoredAxialLoadKn,
    footingWidthM: data.footingWidthM,
    footingLengthM: data.footingLengthM,
    columnWidthM: data.columnWidthM,
    columnLengthM: data.columnLengthM,
    effectiveDepthM: oneWay.effectiveDepthM,
  })
  const minimumReinforcement = calculateGuideMinimumReinforcement({
    footingThicknessM: data.footingThicknessM,
    barDiameterM: data.barDiameterM,
    barsParallelToWidthSpacingM: reinforcementLayout.barsParallelToWidth.actualSpacingM,
    barsParallelToLengthSpacingM: reinforcementLayout.barsParallelToLength.actualSpacingM,
  })
  const requiredReinforcement = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: data.concreteStrengthMpa,
    steelYieldStrengthMpa: data.steelYieldStrengthMpa,
    effectiveDepthM: oneWay.effectiveDepthM,
    widthMomentDemandKnM: flexure.widthDirection.momentDemandKnM,
    widthStripWidthM: flexure.widthDirection.stripWidthM,
    lengthMomentDemandKnM: flexure.lengthDirection.momentDemandKnM,
    lengthStripWidthM: flexure.lengthDirection.stripWidthM,
  })
  const reinforcement = compareGuideReinforcement({
    minimumAreaPerMeterMm2: minimumReinforcement.minimumAreaPerMeterMm2,
    widthProvidedAreaPerMeterMm2: minimumReinforcement.barsParallelToWidth.providedAreaPerMeterMm2,
    lengthProvidedAreaPerMeterMm2: minimumReinforcement.barsParallelToLength.providedAreaPerMeterMm2,
    widthRequiredAreaPerMeterMm2: requiredReinforcement.widthDirection.requiredAreaPerMeterMm2,
    lengthRequiredAreaPerMeterMm2: requiredReinforcement.lengthDirection.requiredAreaPerMeterMm2,
  })
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: data.concreteStrengthMpa,
    steelYieldStrengthMpa: data.steelYieldStrengthMpa,
    barDiameterM: data.barDiameterM,
    availableLengthWidthM: data.developmentAvailableLengthWidthM,
    availableLengthLengthM: data.developmentAvailableLengthLengthM,
  })

  return { status: 'calculated', analysis: { contact, oneWay, flexure, punchingDemand, reinforcementLayout, minimumReinforcement, requiredReinforcement, reinforcement, oneWayGuide, punchingGuide, development } }
}
