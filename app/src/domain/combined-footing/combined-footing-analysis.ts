import type { CombinedFootingInputs } from '../projects'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type CombinedFootingValidationIssue = {
  field: keyof CombinedFootingInputs
  message: string
}

type PressureDistribution = {
  totalLoadKn: number
  momentAboutCentroidKnM: number
  resultantFromLeftM: number
  eccentricityM: number
  averagePressureKpa: number
  pressureLeftKpa: number
  pressureRightKpa: number
  minimumPressureKpa: number
  maximumPressureKpa: number
}

export type CombinedPunchingResult = {
  column: 1 | 2
  criticalWidthM: number
  criticalLengthM: number
  criticalPerimeterM: number
  soilReactionInsideKn: number
  shearDemandKn: number
  designShearStrengthKn: number
  utilization: number
  status: 'meets-guide-reference' | 'below-guide-reference'
}

type ReinforcementResult = {
  providedAreaPerMeterMm2: number
  requiredAreaPerMeterMm2: number | null
  governingAreaPerMeterMm2: number | null
  status: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
}

export type CombinedFootingAnalysis = {
  contact: {
    areaM2: number
    footingSelfWeightKn: number
    soilCoverWeightKn: number
    gross: PressureDistribution
    netPressureLeftKpa: number
    netPressureRightKpa: number
    grossPressureLeftKpa: number
    grossPressureRightKpa: number
    pressureForComparisonLeftKpa: number
    pressureForComparisonRightKpa: number
    maximumPressureForComparisonKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  structural: {
    effectiveDepthM: number
    factored: PressureDistribution
    factoredPressureLeftKpa: number
    factoredPressureRightKpa: number
  }
  longitudinal: {
    criticalShearSections: Array<{ label: string; xM: number; shearKn: number }>
    governingShearDemandKn: number
    maximumPositiveMomentKnM: number
    maximumPositiveMomentXM: number
    minimumNegativeMomentKnM: number
    minimumNegativeMomentXM: number
    governingAbsoluteMomentKnM: number
    endShearKn: number
    endMomentKnM: number
    diagram: Array<{ xM: number; pressureKpa: number; shearKn: number; momentKnM: number }>
  }
  transverse: {
    governingShearColumn: 1 | 2
    governingFlexureColumn: 1 | 2
    shearLocalPressureKpa: number
    flexureLocalPressureKpa: number
    cantileverProjectionM: number
    loadedLengthBeyondCriticalSectionM: number
    oneWayShearDemandKnPerM: number
    flexureDemandKnMPerM: number
  }
  shearReference: {
    longitudinal: GuideOneWayShearDirectionResult
    transverse: GuideOneWayShearDirectionResult
    concreteShearStressMpa: number
  }
  punching: [CombinedPunchingResult, CombinedPunchingResult]
  minimumReinforcement: MinimumReinforcementResult
  requiredReinforcement: {
    longitudinalBottom: GuideReinforcementDirectionResult | null
    longitudinalTop: GuideReinforcementDirectionResult | null
    transverse: GuideReinforcementDirectionResult | null
  }
  reinforcement: {
    barAreaMm2: number
    minimumAreaPerMeterMm2: number
    longitudinalBottom: ReinforcementResult
    longitudinalTop: ReinforcementResult
    transverse: ReinforcementResult
  }
  development: GuideDevelopmentLengthResult
}

export type CombinedFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: CombinedFootingValidationIssue[] }
  | { status: 'calculated'; analysis: CombinedFootingAnalysis }

const positiveFields: Array<keyof CombinedFootingInputs> = [
  'serviceColumn1LoadKn', 'serviceColumn2LoadKn', 'factoredColumn1LoadKn', 'factoredColumn2LoadKn',
  'allowableBearingKpa', 'concreteUnitWeightKnM3', 'footingWidthM', 'footingLengthM', 'footingThicknessM',
  'column1WidthM', 'column1LengthM', 'column1CenterFromLeftM', 'column2WidthM', 'column2LengthM',
  'column2CenterFromLeftM', 'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa',
  'longitudinalBottomBarSpacingM', 'longitudinalTopBarSpacingM', 'transverseBarSpacingM',
  'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM',
]

const nonNegativeFields: Array<keyof CombinedFootingInputs> = [
  'removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM',
]

const pressureDistribution = (
  load1Kn: number,
  load2Kn: number,
  column1XM: number,
  column2XM: number,
  footingWidthM: number,
  footingLengthM: number,
  uniformAdditionalLoadKn = 0,
): PressureDistribution => {
  const centroidXM = footingLengthM / 2
  const totalLoadKn = load1Kn + load2Kn + uniformAdditionalLoadKn
  const momentAboutCentroidKnM = load1Kn * (column1XM - centroidXM) + load2Kn * (column2XM - centroidXM)
  const eccentricityM = momentAboutCentroidKnM / totalLoadKn
  const resultantFromLeftM = centroidXM + eccentricityM
  const averagePressureKpa = totalLoadKn / (footingWidthM * footingLengthM)
  const pressureDeltaKpa = averagePressureKpa * 6 * eccentricityM / footingLengthM
  const pressureLeftKpa = averagePressureKpa - pressureDeltaKpa
  const pressureRightKpa = averagePressureKpa + pressureDeltaKpa
  return {
    totalLoadKn,
    momentAboutCentroidKnM,
    resultantFromLeftM,
    eccentricityM,
    averagePressureKpa,
    pressureLeftKpa,
    pressureRightKpa,
    minimumPressureKpa: Math.min(pressureLeftKpa, pressureRightKpa),
    maximumPressureKpa: Math.max(pressureLeftKpa, pressureRightKpa),
  }
}

const qAt = (xM: number, leftKpa: number, rightKpa: number, lengthM: number) => leftKpa + (rightKpa - leftKpa) * xM / lengthM

const integratePressure = (fromXM: number, toXM: number, leftKpa: number, rightKpa: number, lengthM: number) => {
  const slope = (rightKpa - leftKpa) / lengthM
  return leftKpa * (toXM - fromXM) + slope * (toXM ** 2 - fromXM ** 2) / 2
}

export function validateCombinedFootingInputs(inputs: CombinedFootingInputs): CombinedFootingValidationIssue[] {
  const issues: CombinedFootingValidationIssue[] = []
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
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  }
  if (inputs.column1CenterFromLeftM >= inputs.column2CenterFromLeftM) {
    issues.push({ field: 'column2CenterFromLeftM', message: 'La columna 2 debe ubicarse a la derecha de la columna 1.' })
  }
  const firstLeft = inputs.column1CenterFromLeftM - inputs.column1LengthM / 2
  const firstRight = inputs.column1CenterFromLeftM + inputs.column1LengthM / 2
  const secondLeft = inputs.column2CenterFromLeftM - inputs.column2LengthM / 2
  const secondRight = inputs.column2CenterFromLeftM + inputs.column2LengthM / 2
  if (firstLeft <= 0 || firstRight >= inputs.footingLengthM) {
    issues.push({ field: 'column1CenterFromLeftM', message: 'La columna 1 debe quedar completamente dentro de la zapata.' })
  }
  if (secondLeft <= 0 || secondRight >= inputs.footingLengthM) {
    issues.push({ field: 'column2CenterFromLeftM', message: 'La columna 2 debe quedar completamente dentro de la zapata.' })
  }
  if (firstRight >= secondLeft) {
    issues.push({ field: 'column2CenterFromLeftM', message: 'Las dos columnas no pueden superponerse.' })
  }
  if (inputs.column1WidthM >= inputs.footingWidthM || inputs.column2WidthM >= inputs.footingWidthM) {
    issues.push({ field: 'footingWidthM', message: 'El ancho de zapata debe superar el ancho transversal de ambas columnas.' })
  }
  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  if (effectiveDepthM <= 0) {
    issues.push({ field: 'concreteCoverM', message: 'Espesor, recubrimiento y barra deben producir una profundidad efectiva positiva.' })
  }
  if (effectiveDepthM > 0) {
    const firstCriticalLeft = inputs.column1CenterFromLeftM - (inputs.column1LengthM + effectiveDepthM) / 2
    const firstCriticalRight = inputs.column1CenterFromLeftM + (inputs.column1LengthM + effectiveDepthM) / 2
    const secondCriticalLeft = inputs.column2CenterFromLeftM - (inputs.column2LengthM + effectiveDepthM) / 2
    const secondCriticalRight = inputs.column2CenterFromLeftM + (inputs.column2LengthM + effectiveDepthM) / 2
    if (firstCriticalLeft <= 0 || firstCriticalRight >= inputs.footingLengthM || inputs.column1WidthM + effectiveDepthM >= inputs.footingWidthM) {
      issues.push({ field: 'column1CenterFromLeftM', message: 'El perímetro completo de punzonamiento de la columna 1 debe quedar dentro de la zapata; columnas de borde están fuera de alcance.' })
    }
    if (secondCriticalLeft <= 0 || secondCriticalRight >= inputs.footingLengthM || inputs.column2WidthM + effectiveDepthM >= inputs.footingWidthM) {
      issues.push({ field: 'column2CenterFromLeftM', message: 'El perímetro completo de punzonamiento de la columna 2 debe quedar dentro de la zapata; columnas de borde están fuera de alcance.' })
    }
    if (firstCriticalRight >= secondCriticalLeft) {
      issues.push({ field: 'column2CenterFromLeftM', message: 'Los perímetros críticos de las columnas no pueden superponerse dentro del alcance actual.' })
    }
  }
  return issues
}

const reinforcementResult = (
  providedAreaPerMeterMm2: number,
  minimumAreaPerMeterMm2: number,
  required: GuideReinforcementDirectionResult | null,
): ReinforcementResult => {
  const requiredAreaPerMeterMm2 = required?.requiredAreaPerMeterMm2 ?? (required ? null : 0)
  if (required && required.status === 'section-insufficient') {
    return { providedAreaPerMeterMm2, requiredAreaPerMeterMm2: null, governingAreaPerMeterMm2: null, status: 'section-insufficient' }
  }
  const governingAreaPerMeterMm2 = Math.max(minimumAreaPerMeterMm2, requiredAreaPerMeterMm2 ?? 0)
  return {
    providedAreaPerMeterMm2,
    requiredAreaPerMeterMm2,
    governingAreaPerMeterMm2,
    status: providedAreaPerMeterMm2 >= governingAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference',
  }
}

const punchingStrength = (concreteStrengthMpa: number, columnWidthM: number, columnLengthM: number, effectiveDepthM: number) => {
  const criticalWidthM = columnWidthM + effectiveDepthM
  const criticalLengthM = columnLengthM + effectiveDepthM
  const criticalPerimeterM = 2 * (criticalWidthM + criticalLengthM)
  const rootConcreteStrength = Math.sqrt(concreteStrengthMpa)
  const beta = Math.max(columnWidthM, columnLengthM) / Math.min(columnWidthM, columnLengthM)
  const isSquare = Math.abs(columnWidthM - columnLengthM) < 1e-9
  const alternatives = isSquare ? [0.33 * rootConcreteStrength] : [
      0.33 * rootConcreteStrength,
      0.17 * (1 + 2 / beta) * rootConcreteStrength,
      0.083 * (2 + 0.4 * effectiveDepthM / criticalPerimeterM) * rootConcreteStrength,
    ]
  const governingStressMpa = Math.min(...alternatives)
  return {
    criticalWidthM,
    criticalLengthM,
    criticalPerimeterM,
    designShearStrengthKn: 0.75 * governingStressMpa * criticalPerimeterM * effectiveDepthM * 1000,
  }
}

/**
 * Analiza una zapata combinada rectangular rígida para dos columnas interiores.
 * Las demandas provienen de equilibrio con presión lineal y contacto completo.
 * Las resistencias reutilizan el perfil público de guía y permanecen en validación.
 */
export function analyzeCombinedFooting(inputs: CombinedFootingInputs): CombinedFootingAnalysisOutcome {
  const issues = validateCombinedFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const footingSelfWeightKn = areaM2 * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKn = areaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const gross = pressureDistribution(
    inputs.serviceColumn1LoadKn,
    inputs.serviceColumn2LoadKn,
    inputs.column1CenterFromLeftM,
    inputs.column2CenterFromLeftM,
    inputs.footingWidthM,
    inputs.footingLengthM,
    footingSelfWeightKn + soilCoverWeightKn,
  )
  if (gross.minimumPressureKpa < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'serviceColumn2LoadKn', message: 'La distribución de servicio pierde contacto completo. El levantamiento o contacto parcial está fuera de alcance.' }] }
  }
  const netPressureLeftKpa = gross.pressureLeftKpa - inputs.removedOverburdenKpa
  const netPressureRightKpa = gross.pressureRightKpa - inputs.removedOverburdenKpa
  const pressureForComparisonLeftKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureLeftKpa : netPressureLeftKpa
  const pressureForComparisonRightKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureRightKpa : netPressureRightKpa
  const maximumPressureForComparisonKpa = Math.max(pressureForComparisonLeftKpa, pressureForComparisonRightKpa)
  if (maximumPressureForComparisonKpa <= 0) {
    return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión seleccionada para comparación debe ser mayor que cero.' }] }
  }

  const factored = pressureDistribution(
    inputs.factoredColumn1LoadKn,
    inputs.factoredColumn2LoadKn,
    inputs.column1CenterFromLeftM,
    inputs.column2CenterFromLeftM,
    inputs.footingWidthM,
    inputs.footingLengthM,
  )
  if (factored.minimumPressureKpa < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'factoredColumn2LoadKn', message: 'La distribución última pierde contacto completo. El levantamiento o contacto parcial está fuera de alcance.' }] }
  }

  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const distributedLeftKnM = inputs.footingWidthM * factored.pressureLeftKpa
  const distributedSlopeKnM2 = inputs.footingWidthM * (factored.pressureRightKpa - factored.pressureLeftKpa) / inputs.footingLengthM
  const columns = [
    { xM: inputs.column1CenterFromLeftM, loadKn: inputs.factoredColumn1LoadKn },
    { xM: inputs.column2CenterFromLeftM, loadKn: inputs.factoredColumn2LoadKn },
  ]
  const shearAt = (xM: number) => distributedLeftKnM * xM + distributedSlopeKnM2 * xM ** 2 / 2
    - columns.filter((column) => column.xM <= xM).reduce((sum, column) => sum + column.loadKn, 0)
  const momentAt = (xM: number) => distributedLeftKnM * xM ** 2 / 2 + distributedSlopeKnM2 * xM ** 3 / 6
    - columns.reduce((sum, column) => sum + column.loadKn * Math.max(xM - column.xM, 0), 0)

  const rootCandidates: number[] = []
  const intervals = [
    { from: 0, to: columns[0].xM, previousLoadKn: 0 },
    { from: columns[0].xM, to: columns[1].xM, previousLoadKn: columns[0].loadKn },
    { from: columns[1].xM, to: inputs.footingLengthM, previousLoadKn: columns[0].loadKn + columns[1].loadKn },
  ]
  for (const interval of intervals) {
    if (Math.abs(distributedSlopeKnM2) < 1e-12) {
      const root = interval.previousLoadKn / distributedLeftKnM
      if (root >= interval.from - 1e-9 && root <= interval.to + 1e-9) rootCandidates.push(root)
    } else {
      const discriminant = distributedLeftKnM ** 2 + 2 * distributedSlopeKnM2 * interval.previousLoadKn
      if (discriminant >= 0) {
        for (const root of [
          (-distributedLeftKnM + Math.sqrt(discriminant)) / distributedSlopeKnM2,
          (-distributedLeftKnM - Math.sqrt(discriminant)) / distributedSlopeKnM2,
        ]) {
          if (root >= interval.from - 1e-9 && root <= interval.to + 1e-9) rootCandidates.push(root)
        }
      }
    }
  }
  const momentCandidates = [...new Set([0, inputs.footingLengthM, ...columns.map((column) => column.xM), ...rootCandidates])]
    .map((xM) => ({ xM, momentKnM: momentAt(xM) }))
  const maximumPositive = momentCandidates.reduce((best, candidate) => candidate.momentKnM > best.momentKnM ? candidate : best, { xM: 0, momentKnM: 0 })
  const minimumNegative = momentCandidates.reduce((best, candidate) => candidate.momentKnM < best.momentKnM ? candidate : best, { xM: 0, momentKnM: 0 })

  const criticalSectionPositions = [
    { label: 'C1 izquierda', xM: inputs.column1CenterFromLeftM - inputs.column1LengthM / 2 - effectiveDepthM },
    { label: 'C1 derecha', xM: inputs.column1CenterFromLeftM + inputs.column1LengthM / 2 + effectiveDepthM },
    { label: 'C2 izquierda', xM: inputs.column2CenterFromLeftM - inputs.column2LengthM / 2 - effectiveDepthM },
    { label: 'C2 derecha', xM: inputs.column2CenterFromLeftM + inputs.column2LengthM / 2 + effectiveDepthM },
  ].filter((section) => section.xM > 0 && section.xM < inputs.footingLengthM)
  const criticalShearSections = criticalSectionPositions.map((section) => ({ ...section, shearKn: shearAt(section.xM) }))
  const governingShearDemandKn = Math.max(...criticalShearSections.map((section) => Math.abs(section.shearKn)))

  const transverseCandidates = [
    { column: 1 as const, pressureKpa: qAt(inputs.column1CenterFromLeftM, factored.pressureLeftKpa, factored.pressureRightKpa, inputs.footingLengthM), widthM: inputs.column1WidthM },
    { column: 2 as const, pressureKpa: qAt(inputs.column2CenterFromLeftM, factored.pressureLeftKpa, factored.pressureRightKpa, inputs.footingLengthM), widthM: inputs.column2WidthM },
  ].map((candidate) => {
    const cantileverProjectionM = (inputs.footingWidthM - candidate.widthM) / 2
    const loadedLengthBeyondCriticalSectionM = Math.max(cantileverProjectionM - effectiveDepthM, 0)
    return {
      ...candidate,
      cantileverProjectionM,
      loadedLengthBeyondCriticalSectionM,
      oneWayShearDemandKnPerM: candidate.pressureKpa * loadedLengthBeyondCriticalSectionM,
      flexureDemandKnMPerM: candidate.pressureKpa * cantileverProjectionM ** 2 / 2,
    }
  })
  const transverseFlexure = transverseCandidates.reduce((governing, candidate) => candidate.flexureDemandKnMPerM > governing.flexureDemandKnMPerM ? candidate : governing)
  const transverseShear = transverseCandidates.reduce((governing, candidate) => candidate.oneWayShearDemandKnPerM > governing.oneWayShearDemandKnPerM ? candidate : governing)

  const shearCheck = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn: governingShearDemandKn,
    widthSectionWidthM: inputs.footingWidthM,
    lengthShearDemandKn: transverseShear.oneWayShearDemandKnPerM,
    lengthSectionWidthM: 1,
  })

  const punching = ([
    { column: 1 as const, xM: inputs.column1CenterFromLeftM, widthM: inputs.column1WidthM, lengthM: inputs.column1LengthM, loadKn: inputs.factoredColumn1LoadKn },
    { column: 2 as const, xM: inputs.column2CenterFromLeftM, widthM: inputs.column2WidthM, lengthM: inputs.column2LengthM, loadKn: inputs.factoredColumn2LoadKn },
  ] as const).map((column): CombinedPunchingResult => {
    const strength = punchingStrength(inputs.concreteStrengthMpa, column.widthM, column.lengthM, effectiveDepthM)
    const leftXM = column.xM - strength.criticalLengthM / 2
    const rightXM = column.xM + strength.criticalLengthM / 2
    const soilReactionInsideKn = strength.criticalWidthM * integratePressure(leftXM, rightXM, factored.pressureLeftKpa, factored.pressureRightKpa, inputs.footingLengthM)
    const shearDemandKn = Math.max(column.loadKn - soilReactionInsideKn, 0)
    const utilization = shearDemandKn / strength.designShearStrengthKn
    return {
      column: column.column,
      criticalWidthM: strength.criticalWidthM,
      criticalLengthM: strength.criticalLengthM,
      criticalPerimeterM: strength.criticalPerimeterM,
      soilReactionInsideKn,
      shearDemandKn,
      designShearStrengthKn: strength.designShearStrengthKn,
      utilization,
      status: utilization <= 1 ? 'meets-guide-reference' : 'below-guide-reference',
    }
  }) as [CombinedPunchingResult, CombinedPunchingResult]

  const minimumReinforcement = calculateGuideMinimumReinforcement({
    footingThicknessM: inputs.footingThicknessM,
    barDiameterM: inputs.barDiameterM,
    barsParallelToWidthSpacingM: inputs.transverseBarSpacingM,
    barsParallelToLengthSpacingM: inputs.longitudinalBottomBarSpacingM,
  })
  const calculateRequired = (momentKnM: number, widthM: number) => momentKnM <= 1e-12 ? null : calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    effectiveDepthM,
    widthMomentDemandKnM: momentKnM,
    widthStripWidthM: widthM,
    lengthMomentDemandKnM: momentKnM,
    lengthStripWidthM: widthM,
  }).widthDirection
  const longitudinalBottomRequired = calculateRequired(maximumPositive.momentKnM, inputs.footingWidthM)
  const longitudinalTopRequired = calculateRequired(Math.abs(minimumNegative.momentKnM), inputs.footingWidthM)
  const transverseRequired = calculateRequired(transverseFlexure.flexureDemandKnMPerM, 1)
  const barAreaMm2 = minimumReinforcement.barAreaMm2
  const minimumAreaPerMeterMm2 = minimumReinforcement.minimumAreaPerMeterMm2
  const longitudinalBottomProvided = barAreaMm2 / inputs.longitudinalBottomBarSpacingM
  const longitudinalTopProvided = barAreaMm2 / inputs.longitudinalTopBarSpacingM
  const transverseProvided = barAreaMm2 / inputs.transverseBarSpacingM
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.transverseDevelopmentAvailableM,
    availableLengthLengthM: inputs.longitudinalDevelopmentAvailableM,
  })
  const diagram = Array.from({ length: 121 }, (_, index) => {
    const xM = inputs.footingLengthM * index / 120
    return {
      xM,
      pressureKpa: qAt(xM, factored.pressureLeftKpa, factored.pressureRightKpa, inputs.footingLengthM),
      shearKn: shearAt(xM),
      momentKnM: momentAt(xM),
    }
  })

  return {
    status: 'calculated',
    analysis: {
      contact: {
        areaM2,
        footingSelfWeightKn,
        soilCoverWeightKn,
        gross,
        netPressureLeftKpa,
        netPressureRightKpa,
        grossPressureLeftKpa: gross.pressureLeftKpa,
        grossPressureRightKpa: gross.pressureRightKpa,
        pressureForComparisonLeftKpa,
        pressureForComparisonRightKpa,
        maximumPressureForComparisonKpa,
        allowableBearingKpa: inputs.allowableBearingKpa,
        utilization: maximumPressureForComparisonKpa / inputs.allowableBearingKpa,
        status: maximumPressureForComparisonKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
      },
      structural: {
        effectiveDepthM,
        factored,
        factoredPressureLeftKpa: factored.pressureLeftKpa,
        factoredPressureRightKpa: factored.pressureRightKpa,
      },
      longitudinal: {
        criticalShearSections,
        governingShearDemandKn,
        maximumPositiveMomentKnM: maximumPositive.momentKnM,
        maximumPositiveMomentXM: maximumPositive.xM,
        minimumNegativeMomentKnM: minimumNegative.momentKnM,
        minimumNegativeMomentXM: minimumNegative.xM,
        governingAbsoluteMomentKnM: Math.max(maximumPositive.momentKnM, Math.abs(minimumNegative.momentKnM)),
        endShearKn: shearAt(inputs.footingLengthM),
        endMomentKnM: momentAt(inputs.footingLengthM),
        diagram,
      },
      transverse: {
        governingShearColumn: transverseShear.column,
        governingFlexureColumn: transverseFlexure.column,
        shearLocalPressureKpa: transverseShear.pressureKpa,
        flexureLocalPressureKpa: transverseFlexure.pressureKpa,
        cantileverProjectionM: transverseFlexure.cantileverProjectionM,
        loadedLengthBeyondCriticalSectionM: transverseShear.loadedLengthBeyondCriticalSectionM,
        oneWayShearDemandKnPerM: transverseShear.oneWayShearDemandKnPerM,
        flexureDemandKnMPerM: transverseFlexure.flexureDemandKnMPerM,
      },
      shearReference: {
        longitudinal: shearCheck.widthDirection,
        transverse: shearCheck.lengthDirection,
        concreteShearStressMpa: shearCheck.concreteShearStressMpa,
      },
      punching,
      minimumReinforcement,
      requiredReinforcement: {
        longitudinalBottom: longitudinalBottomRequired,
        longitudinalTop: longitudinalTopRequired,
        transverse: transverseRequired,
      },
      reinforcement: {
        barAreaMm2,
        minimumAreaPerMeterMm2,
        longitudinalBottom: reinforcementResult(longitudinalBottomProvided, minimumAreaPerMeterMm2, longitudinalBottomRequired),
        longitudinalTop: reinforcementResult(longitudinalTopProvided, minimumAreaPerMeterMm2, longitudinalTopRequired),
        transverse: reinforcementResult(transverseProvided, minimumAreaPerMeterMm2, transverseRequired),
      },
      development,
    },
  }
}
