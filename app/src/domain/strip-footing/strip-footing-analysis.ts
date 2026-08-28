import type { StripFootingInputs } from '../projects'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type StripFootingValidationIssue = {
  field: keyof StripFootingInputs
  message: string
}

export type StripFootingAnalysis = {
  referenceLengthM: 1
  contact: {
    contactAreaM2PerM: number
    footingSelfWeightKnM: number
    soilCoverWeightKnM: number
    totalServiceLineLoadKnM: number
    grossContactPressureKpa: number
    netContactPressureKpa: number
    pressureForComparisonKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  structural: {
    effectiveDepthM: number
    factoredContactPressureKpa: number
    cantileverProjectionM: number
    loadedLengthBeyondCriticalSectionM: number
    oneWayShearDemandKnPerM: number
    flexureDemandKnMPerM: number
  }
  shearConcreteStressMpa: number
  shearReference: GuideOneWayShearDirectionResult
  minimumReinforcement: MinimumReinforcementResult
  requiredTransverseReinforcement: GuideReinforcementDirectionResult
  reinforcement: {
    barAreaMm2: number
    transverseProvidedAreaPerMeterMm2: number
    longitudinalProvidedAreaPerMeterMm2: number
    transverseGoverningAreaPerMeterMm2: number | null
    longitudinalGoverningAreaPerMeterMm2: number
    transverseStatus: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
    longitudinalStatus: 'meets-guide-reference' | 'below-guide-reference'
  }
  development: GuideDevelopmentLengthResult
}

export type StripFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: StripFootingValidationIssue[] }
  | { status: 'calculated'; analysis: StripFootingAnalysis }

const positiveFields: Array<keyof StripFootingInputs> = [
  'serviceLineLoadKnM',
  'factoredLineLoadKnM',
  'allowableBearingKpa',
  'concreteUnitWeightKnM3',
  'wallThicknessM',
  'footingWidthM',
  'footingThicknessM',
  'barDiameterM',
  'concreteStrengthMpa',
  'steelYieldStrengthMpa',
  'transverseBarSpacingM',
  'longitudinalBarSpacingM',
  'developmentAvailableLengthM',
]

const fieldLabels: Record<keyof StripFootingInputs, string> = {
  serviceLineLoadKnM: 'La carga lineal de servicio',
  factoredLineLoadKnM: 'La carga lineal última',
  allowableBearingKpa: 'La capacidad admisible del suelo',
  bearingCapacityBasis: 'La base de capacidad admisible',
  removedOverburdenKpa: 'El esfuerzo removido',
  concreteUnitWeightKnM3: 'El peso unitario del hormigón',
  soilCoverDepthM: 'La altura de relleno',
  soilUnitWeightKnM3: 'El peso unitario del relleno',
  wallThicknessM: 'El espesor del muro',
  footingWidthM: 'El ancho de la zapata corrida',
  footingThicknessM: 'El espesor de la zapata',
  concreteCoverM: 'El recubrimiento',
  barDiameterM: 'El diámetro de barra',
  concreteStrengthMpa: 'La resistencia del hormigón',
  steelYieldStrengthMpa: 'La fluencia del acero',
  transverseBarSpacingM: 'La separación del acero transversal',
  longitudinalBarSpacingM: 'La separación del acero longitudinal',
  developmentAvailableLengthM: 'La longitud disponible de desarrollo',
}

export function validateStripFootingInputs(inputs: StripFootingInputs): StripFootingValidationIssue[] {
  const issues: StripFootingValidationIssue[] = []
  for (const field of positiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      issues.push({ field, message: `${fieldLabels[field]} debe ser mayor que cero.` })
    }
  }
  for (const field of ['removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM'] as const) {
    const value = inputs[field]
    if (!Number.isFinite(value) || value < 0) issues.push({ field, message: `${fieldLabels[field]} debe ser mayor o igual a cero.` })
  }
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  }
  if (inputs.footingWidthM <= inputs.wallThicknessM) {
    issues.push({ field: 'footingWidthM', message: 'El ancho de zapata debe ser mayor que el espesor del muro centrado.' })
  }
  if (inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2 <= 0) {
    issues.push({ field: 'concreteCoverM', message: 'Espesor, recubrimiento y barra deben producir una profundidad efectiva positiva.' })
  }
  return issues
}

/**
 * Analiza una franja de un metro de zapata corrida bajo muro centrado.
 * Las demandas provienen de equilibrio con presión uniforme; las resistencias reutilizan
 * las referencias públicas ya aisladas en el motor para una sección de un metro.
 */
export function analyzeStripFooting(inputs: StripFootingInputs): StripFootingAnalysisOutcome {
  const issues = validateStripFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const referenceLengthM = 1 as const
  const contactAreaM2PerM = inputs.footingWidthM * referenceLengthM
  const footingSelfWeightKnM = inputs.footingWidthM * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKnM = inputs.footingWidthM * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const totalServiceLineLoadKnM = inputs.serviceLineLoadKnM + footingSelfWeightKnM + soilCoverWeightKnM
  const grossContactPressureKpa = totalServiceLineLoadKnM / contactAreaM2PerM
  const netContactPressureKpa = grossContactPressureKpa - inputs.removedOverburdenKpa
  const pressureForComparisonKpa = inputs.bearingCapacityBasis === 'gross' ? grossContactPressureKpa : netContactPressureKpa
  if (pressureForComparisonKpa <= 0) {
    return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión seleccionada para comparación debe ser mayor que cero.' }] }
  }
  const contactUtilization = pressureForComparisonKpa / inputs.allowableBearingKpa

  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const factoredContactPressureKpa = inputs.factoredLineLoadKnM / inputs.footingWidthM
  const cantileverProjectionM = (inputs.footingWidthM - inputs.wallThicknessM) / 2
  const loadedLengthBeyondCriticalSectionM = Math.max(cantileverProjectionM - effectiveDepthM, 0)
  const oneWayShearDemandKnPerM = factoredContactPressureKpa * loadedLengthBeyondCriticalSectionM * referenceLengthM
  const flexureDemandKnMPerM = factoredContactPressureKpa * referenceLengthM * cantileverProjectionM ** 2 / 2

  const shearCheck = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn: oneWayShearDemandKnPerM,
    widthSectionWidthM: referenceLengthM,
    lengthShearDemandKn: oneWayShearDemandKnPerM,
    lengthSectionWidthM: referenceLengthM,
  })
  const shearReference = shearCheck.widthDirection
  const minimumReinforcement = calculateGuideMinimumReinforcement({
    footingThicknessM: inputs.footingThicknessM,
    barDiameterM: inputs.barDiameterM,
    barsParallelToWidthSpacingM: inputs.transverseBarSpacingM,
    barsParallelToLengthSpacingM: inputs.longitudinalBarSpacingM,
  })
  const requiredTransverseReinforcement = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    effectiveDepthM,
    widthMomentDemandKnM: flexureDemandKnMPerM,
    widthStripWidthM: referenceLengthM,
    lengthMomentDemandKnM: flexureDemandKnMPerM,
    lengthStripWidthM: referenceLengthM,
  }).widthDirection
  const transverseGoverningAreaPerMeterMm2 = requiredTransverseReinforcement.requiredAreaPerMeterMm2 === null
    ? null
    : Math.max(requiredTransverseReinforcement.requiredAreaPerMeterMm2, minimumReinforcement.minimumAreaPerMeterMm2)
  const transverseProvidedAreaPerMeterMm2 = minimumReinforcement.barsParallelToWidth.providedAreaPerMeterMm2
  const longitudinalProvidedAreaPerMeterMm2 = minimumReinforcement.barsParallelToLength.providedAreaPerMeterMm2
  const transverseStatus = transverseGoverningAreaPerMeterMm2 === null
    ? 'section-insufficient' as const
    : transverseProvidedAreaPerMeterMm2 >= transverseGoverningAreaPerMeterMm2 ? 'meets-guide-reference' as const : 'below-guide-reference' as const
  const longitudinalStatus = longitudinalProvidedAreaPerMeterMm2 >= minimumReinforcement.minimumAreaPerMeterMm2
    ? 'meets-guide-reference' as const
    : 'below-guide-reference' as const
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.developmentAvailableLengthM,
    availableLengthLengthM: inputs.developmentAvailableLengthM,
  })

  return {
    status: 'calculated',
    analysis: {
      referenceLengthM,
      contact: {
        contactAreaM2PerM,
        footingSelfWeightKnM,
        soilCoverWeightKnM,
        totalServiceLineLoadKnM,
        grossContactPressureKpa,
        netContactPressureKpa,
        pressureForComparisonKpa,
        allowableBearingKpa: inputs.allowableBearingKpa,
        utilization: contactUtilization,
        status: contactUtilization <= 1 ? 'pass' : 'fail',
      },
      structural: { effectiveDepthM, factoredContactPressureKpa, cantileverProjectionM, loadedLengthBeyondCriticalSectionM, oneWayShearDemandKnPerM, flexureDemandKnMPerM },
      shearConcreteStressMpa: shearCheck.concreteShearStressMpa,
      shearReference,
      minimumReinforcement,
      requiredTransverseReinforcement,
      reinforcement: {
        barAreaMm2: minimumReinforcement.barAreaMm2,
        transverseProvidedAreaPerMeterMm2,
        longitudinalProvidedAreaPerMeterMm2,
        transverseGoverningAreaPerMeterMm2,
        longitudinalGoverningAreaPerMeterMm2: minimumReinforcement.minimumAreaPerMeterMm2,
        transverseStatus,
        longitudinalStatus,
      },
      development,
    },
  }
}
