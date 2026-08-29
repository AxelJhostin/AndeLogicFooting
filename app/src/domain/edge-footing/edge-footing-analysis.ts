import type { EdgeFootingInputs } from '../projects'
import { checkGuideDevelopmentLength } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type EdgeFootingValidationIssue = {
  field: keyof EdgeFootingInputs
  message: string
}

export type EdgePressureDistribution = {
  totalLoadKn: number
  momentAboutCentroidKnM: number
  resultantFromLeftM: number
  eccentricityM: number
  middleThirdLimitM: number
  middleThirdMarginM: number
  averagePressureKpa: number
  pressureLeftKpa: number
  pressureRightKpa: number
  minimumPressureKpa: number
  maximumPressureKpa: number
}

type ReinforcementResult = {
  providedAreaPerMeterMm2: number
  requiredAreaPerMeterMm2: number | null
  governingAreaPerMeterMm2: number | null
  status: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
}

export type EdgeFootingAnalysis = {
  geometry: {
    areaM2: number
    centroidFromLeftM: number
    columnCenterFromLeftM: number
    columnLeftFaceM: number
    columnRightFaceM: number
    edgeSide: 'left' | 'right'
  }
  contact: {
    footingSelfWeightKn: number
    soilCoverWeightKn: number
    gross: EdgePressureDistribution
    grossPressureLeftKpa: number
    grossPressureRightKpa: number
    netPressureLeftKpa: number
    netPressureRightKpa: number
    pressureForComparisonLeftKpa: number
    pressureForComparisonRightKpa: number
    maximumPressureForComparisonKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  structural: {
    effectiveDepthM: number
    factored: EdgePressureDistribution
  }
  longitudinal: {
    distributedReactionKnM: { intercept: number; slope: number }
    criticalShearSections: Array<{ label: string; xM: number; shearKn: number }>
    governingShearDemandKn: number
    leftFaceFlexureDemandKnM: number
    rightFaceFlexureDemandKnM: number
    governingFlexureFace: 'left' | 'right' | 'equal'
    governingFlexureDemandKnM: number
    maximumPositiveMomentKnM: number
    maximumPositiveMomentXM: number
    minimumNegativeMomentKnM: number
    minimumNegativeMomentXM: number
    endShearKn: number
    endMomentKnM: number
    diagram: Array<{ xM: number; pressureKpa: number; reactionKnM: number; shearKn: number; momentKnM: number }>
  }
  transverse: {
    cantileverProjectionM: number
    loadedLengthBeyondCriticalSectionM: number
    integratedPressureKnM: number
    oneWayShearDemandKn: number
    flexureDemandKnM: number
  }
  shearReference: {
    longitudinal: GuideOneWayShearDirectionResult
    transverse: GuideOneWayShearDirectionResult
    concreteShearStressMpa: number
  }
  punching: {
    status: 'not-evaluated'
    reason: string
  }
  minimumReinforcement: MinimumReinforcementResult
  requiredReinforcement: {
    longitudinal: GuideReinforcementDirectionResult
    transverse: GuideReinforcementDirectionResult
  }
  reinforcement: {
    barAreaMm2: number
    minimumAreaPerMeterMm2: number
    longitudinal: ReinforcementResult
    transverse: ReinforcementResult
  }
  development: {
    requiredDevelopmentLengthM: number
    longitudinal: { availableLengthM: number; status: 'meets-guide-reference' | 'below-guide-reference' }
    transverse: { availableLengthM: number; status: 'meets-guide-reference' | 'below-guide-reference' }
  }
}

export type EdgeFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: EdgeFootingValidationIssue[] }
  | { status: 'calculated'; analysis: EdgeFootingAnalysis }

const positiveFields: Array<keyof EdgeFootingInputs> = [
  'serviceAxialLoadKn', 'factoredAxialLoadKn', 'allowableBearingKpa', 'concreteUnitWeightKnM3',
  'footingWidthM', 'footingLengthM', 'footingThicknessM', 'columnWidthM', 'columnLengthM',
  'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa', 'longitudinalBarSpacingM',
  'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM',
]
const nonNegativeFields: Array<keyof EdgeFootingInputs> = [
  'removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM',
]

const columnCenterFromLeft = (inputs: EdgeFootingInputs) => inputs.edgeSide === 'left'
  ? inputs.columnLengthM / 2
  : inputs.footingLengthM - inputs.columnLengthM / 2

export function validateEdgeFootingInputs(inputs: EdgeFootingInputs): EdgeFootingValidationIssue[] {
  const issues: EdgeFootingValidationIssue[] = []
  for (const field of positiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
      issues.push({ field, message: 'Este valor debe ser un número mayor que cero.' })
    }
  }
  for (const field of nonNegativeFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      issues.push({ field, message: 'Este valor debe ser un número mayor o igual a cero.' })
    }
  }
  if (inputs.edgeSide !== 'left' && inputs.edgeSide !== 'right') {
    issues.push({ field: 'edgeSide', message: 'Selecciona el borde izquierdo o derecho.' })
  }
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  }
  if (inputs.columnLengthM >= inputs.footingLengthM) {
    issues.push({ field: 'columnLengthM', message: 'La longitud de la columna debe ser menor que la longitud excéntrica de la zapata.' })
  }
  if (inputs.columnWidthM >= inputs.footingWidthM) {
    issues.push({ field: 'columnWidthM', message: 'El ancho de la columna debe ser menor que el ancho transversal de la zapata.' })
  }
  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  if (effectiveDepthM <= 0) {
    issues.push({ field: 'concreteCoverM', message: 'Espesor, recubrimiento y barra deben producir una profundidad efectiva positiva.' })
  }
  return issues
}

const pressureDistribution = (
  inputs: EdgeFootingInputs,
  columnLoadKn: number,
  centeredAdditionalLoadKn: number,
): EdgePressureDistribution => {
  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const centroidFromLeftM = inputs.footingLengthM / 2
  const columnCenterM = columnCenterFromLeft(inputs)
  const totalLoadKn = columnLoadKn + centeredAdditionalLoadKn
  const momentAboutCentroidKnM = columnLoadKn * (columnCenterM - centroidFromLeftM)
  const eccentricityM = momentAboutCentroidKnM / totalLoadKn
  const averagePressureKpa = totalLoadKn / areaM2
  const pressureDeltaKpa = averagePressureKpa * 6 * eccentricityM / inputs.footingLengthM
  const pressureLeftKpa = averagePressureKpa - pressureDeltaKpa
  const pressureRightKpa = averagePressureKpa + pressureDeltaKpa
  const middleThirdLimitM = inputs.footingLengthM / 6
  return {
    totalLoadKn,
    momentAboutCentroidKnM,
    resultantFromLeftM: centroidFromLeftM + eccentricityM,
    eccentricityM,
    middleThirdLimitM,
    middleThirdMarginM: middleThirdLimitM - Math.abs(eccentricityM),
    averagePressureKpa,
    pressureLeftKpa,
    pressureRightKpa,
    minimumPressureKpa: Math.min(pressureLeftKpa, pressureRightKpa),
    maximumPressureKpa: Math.max(pressureLeftKpa, pressureRightKpa),
  }
}

const reinforcementResult = (
  providedAreaPerMeterMm2: number,
  minimumAreaPerMeterMm2: number,
  required: GuideReinforcementDirectionResult,
): ReinforcementResult => {
  if (required.status === 'section-insufficient') {
    return { providedAreaPerMeterMm2, requiredAreaPerMeterMm2: null, governingAreaPerMeterMm2: null, status: 'section-insufficient' }
  }
  const requiredAreaPerMeterMm2 = required.requiredAreaPerMeterMm2 ?? 0
  const governingAreaPerMeterMm2 = Math.max(minimumAreaPerMeterMm2, requiredAreaPerMeterMm2)
  return {
    providedAreaPerMeterMm2,
    requiredAreaPerMeterMm2,
    governingAreaPerMeterMm2,
    status: providedAreaPerMeterMm2 >= governingAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference',
  }
}

/** Analiza una zapata aislada de borde con excentricidad uniaxial y contacto completo. */
export function analyzeEdgeFooting(inputs: EdgeFootingInputs): EdgeFootingAnalysisOutcome {
  const issues = validateEdgeFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const centroidFromLeftM = inputs.footingLengthM / 2
  const columnCenterM = columnCenterFromLeft(inputs)
  const columnLeftFaceM = columnCenterM - inputs.columnLengthM / 2
  const columnRightFaceM = columnCenterM + inputs.columnLengthM / 2
  const footingSelfWeightKn = areaM2 * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKn = areaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const gross = pressureDistribution(inputs, inputs.serviceAxialLoadKn, footingSelfWeightKn + soilCoverWeightKn)
  if (gross.minimumPressureKpa < -1e-9 || gross.middleThirdMarginM < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'footingLengthM', message: 'La resultante de servicio queda fuera del tercio central. El contacto parcial está fuera de alcance.' }] }
  }

  const netPressureLeftKpa = gross.pressureLeftKpa - inputs.removedOverburdenKpa
  const netPressureRightKpa = gross.pressureRightKpa - inputs.removedOverburdenKpa
  const pressureForComparisonLeftKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureLeftKpa : netPressureLeftKpa
  const pressureForComparisonRightKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureRightKpa : netPressureRightKpa
  const maximumPressureForComparisonKpa = Math.max(pressureForComparisonLeftKpa, pressureForComparisonRightKpa)
  if (maximumPressureForComparisonKpa <= 0) {
    return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión máxima seleccionada para comparación debe ser mayor que cero.' }] }
  }

  const factored = pressureDistribution(inputs, inputs.factoredAxialLoadKn, 0)
  if (factored.minimumPressureKpa < -1e-9 || factored.middleThirdMarginM < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'footingLengthM', message: 'La resultante última queda fuera del tercio central. El levantamiento o contacto parcial está fuera de alcance.' }] }
  }

  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const distributedInterceptKnM = inputs.footingWidthM * factored.pressureLeftKpa
  const distributedSlopeKnM2 = inputs.footingWidthM * (factored.pressureRightKpa - factored.pressureLeftKpa) / inputs.footingLengthM
  const reactionTo = (xM: number) => distributedInterceptKnM * xM + distributedSlopeKnM2 * xM ** 2 / 2
  const reactionMomentTo = (xM: number) => distributedInterceptKnM * xM ** 2 / 2 + distributedSlopeKnM2 * xM ** 3 / 6
  const reactionFirstMomentTo = (xM: number) => distributedInterceptKnM * xM ** 2 / 2 + distributedSlopeKnM2 * xM ** 3 / 3
  const shearAt = (xM: number) => reactionTo(xM) - (xM >= columnCenterM ? inputs.factoredAxialLoadKn : 0)
  const momentAt = (xM: number) => reactionMomentTo(xM) - inputs.factoredAxialLoadKn * Math.max(xM - columnCenterM, 0)

  const criticalShearSections = [
    { label: 'Cara izquierda + d', xM: columnLeftFaceM - effectiveDepthM },
    { label: 'Cara derecha + d', xM: columnRightFaceM + effectiveDepthM },
  ].filter((section) => section.xM > 0 && section.xM < inputs.footingLengthM)
    .map((section) => ({ ...section, shearKn: shearAt(section.xM) }))
  const governingShearDemandKn = criticalShearSections.length
    ? Math.max(...criticalShearSections.map((section) => Math.abs(section.shearKn)))
    : 0

  const leftFaceFlexureDemandKnM = reactionMomentTo(columnLeftFaceM)
  const rightFaceFlexureDemandKnM = reactionFirstMomentTo(inputs.footingLengthM) - reactionFirstMomentTo(columnRightFaceM)
    - columnRightFaceM * (reactionTo(inputs.footingLengthM) - reactionTo(columnRightFaceM))
  const governingFlexureDemandKnM = Math.max(leftFaceFlexureDemandKnM, rightFaceFlexureDemandKnM)
  const governingFlexureFace = Math.abs(leftFaceFlexureDemandKnM - rightFaceFlexureDemandKnM) < 1e-10
    ? 'equal' as const
    : leftFaceFlexureDemandKnM > rightFaceFlexureDemandKnM ? 'left' as const : 'right' as const

  const roots: number[] = [0, inputs.footingLengthM]
  const momentCandidates = [...new Set([0, inputs.footingLengthM, columnCenterM, ...roots])]
    .map((xM) => ({ xM, momentKnM: momentAt(xM) }))
  const maximumPositive = momentCandidates.reduce((best, item) => item.momentKnM > best.momentKnM ? item : best, { xM: 0, momentKnM: 0 })
  const minimumNegative = momentCandidates.reduce((best, item) => item.momentKnM < best.momentKnM ? item : best, { xM: 0, momentKnM: 0 })

  const integratedPressureKnM = factored.totalLoadKn / inputs.footingWidthM
  const transverseCantileverProjectionM = (inputs.footingWidthM - inputs.columnWidthM) / 2
  const transverseLoadedLengthM = Math.max(transverseCantileverProjectionM - effectiveDepthM, 0)
  const transverseShearDemandKn = integratedPressureKnM * transverseLoadedLengthM
  const transverseFlexureDemandKnM = integratedPressureKnM * transverseCantileverProjectionM ** 2 / 2

  const shearCheck = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn: governingShearDemandKn,
    widthSectionWidthM: inputs.footingWidthM,
    lengthShearDemandKn: transverseShearDemandKn,
    lengthSectionWidthM: inputs.footingLengthM,
  })
  const minimumReinforcement = calculateGuideMinimumReinforcement({
    footingThicknessM: inputs.footingThicknessM,
    barDiameterM: inputs.barDiameterM,
    barsParallelToWidthSpacingM: inputs.transverseBarSpacingM,
    barsParallelToLengthSpacingM: inputs.longitudinalBarSpacingM,
  })
  const required = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    effectiveDepthM,
    widthMomentDemandKnM: governingFlexureDemandKnM,
    widthStripWidthM: inputs.footingWidthM,
    lengthMomentDemandKnM: transverseFlexureDemandKnM,
    lengthStripWidthM: inputs.footingLengthM,
  })
  const developmentCheck = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.transverseDevelopmentAvailableM,
    availableLengthLengthM: inputs.longitudinalDevelopmentAvailableM,
  })
  const diagram = Array.from({ length: 61 }, (_, index) => {
    const xM = inputs.footingLengthM * index / 60
    const pressureKpa = factored.pressureLeftKpa + (factored.pressureRightKpa - factored.pressureLeftKpa) * xM / inputs.footingLengthM
    return { xM, pressureKpa, reactionKnM: inputs.footingWidthM * pressureKpa, shearKn: shearAt(xM), momentKnM: momentAt(xM) }
  })

  return {
    status: 'calculated',
    analysis: {
      geometry: { areaM2, centroidFromLeftM, columnCenterFromLeftM: columnCenterM, columnLeftFaceM, columnRightFaceM, edgeSide: inputs.edgeSide },
      contact: {
        footingSelfWeightKn,
        soilCoverWeightKn,
        gross,
        grossPressureLeftKpa: gross.pressureLeftKpa,
        grossPressureRightKpa: gross.pressureRightKpa,
        netPressureLeftKpa,
        netPressureRightKpa,
        pressureForComparisonLeftKpa,
        pressureForComparisonRightKpa,
        maximumPressureForComparisonKpa,
        allowableBearingKpa: inputs.allowableBearingKpa,
        utilization: maximumPressureForComparisonKpa / inputs.allowableBearingKpa,
        status: maximumPressureForComparisonKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
      },
      structural: { effectiveDepthM, factored },
      longitudinal: {
        distributedReactionKnM: { intercept: distributedInterceptKnM, slope: distributedSlopeKnM2 },
        criticalShearSections,
        governingShearDemandKn,
        leftFaceFlexureDemandKnM,
        rightFaceFlexureDemandKnM,
        governingFlexureFace,
        governingFlexureDemandKnM,
        maximumPositiveMomentKnM: maximumPositive.momentKnM,
        maximumPositiveMomentXM: maximumPositive.xM,
        minimumNegativeMomentKnM: minimumNegative.momentKnM,
        minimumNegativeMomentXM: minimumNegative.xM,
        endShearKn: shearAt(inputs.footingLengthM),
        endMomentKnM: momentAt(inputs.footingLengthM),
        diagram,
      },
      transverse: {
        cantileverProjectionM: transverseCantileverProjectionM,
        loadedLengthBeyondCriticalSectionM: transverseLoadedLengthM,
        integratedPressureKnM,
        oneWayShearDemandKn: transverseShearDemandKn,
        flexureDemandKnM: transverseFlexureDemandKnM,
      },
      shearReference: {
        longitudinal: shearCheck.widthDirection,
        transverse: shearCheck.lengthDirection,
        concreteShearStressMpa: shearCheck.concreteShearStressMpa,
      },
      punching: {
        status: 'not-evaluated',
        reason: 'La columna coincide con el borde y el perímetro crítico es truncado. No se reutiliza la referencia de columna interior.',
      },
      minimumReinforcement,
      requiredReinforcement: { longitudinal: required.widthDirection, transverse: required.lengthDirection },
      reinforcement: {
        barAreaMm2: minimumReinforcement.barAreaMm2,
        minimumAreaPerMeterMm2: minimumReinforcement.minimumAreaPerMeterMm2,
        longitudinal: reinforcementResult(minimumReinforcement.barsParallelToLength.providedAreaPerMeterMm2, minimumReinforcement.minimumAreaPerMeterMm2, required.widthDirection),
        transverse: reinforcementResult(minimumReinforcement.barsParallelToWidth.providedAreaPerMeterMm2, minimumReinforcement.minimumAreaPerMeterMm2, required.lengthDirection),
      },
      development: {
        requiredDevelopmentLengthM: developmentCheck.requiredDevelopmentLengthM,
        longitudinal: developmentCheck.lengthDirection,
        transverse: developmentCheck.widthDirection,
      },
    },
  }
}
