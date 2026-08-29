import type { TrapezoidalFootingInputs } from '../projects'
import { checkGuideDevelopmentLength, type GuideDevelopmentLengthResult } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type TrapezoidalValidationIssue = { field: keyof TrapezoidalFootingInputs; message: string }

type PressureDistribution = {
  totalLoadKn: number
  momentFromLeftKnM: number
  resultantFromLeftM: number
  eccentricityFromCentroidM: number
  pressureInterceptKpa: number
  pressureSlopeKpaM: number
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

export type TrapezoidalPunchingResult = {
  column: 1 | 2
  localFootingWidthM: number
  criticalWidthM: number
  criticalLengthM: number
  criticalPerimeterM: number
  soilReactionInsideKn: number
  shearDemandKn: number
  designShearStrengthKn: number
  utilization: number
  status: 'meets-guide-reference' | 'below-guide-reference'
}

export type TrapezoidalLongitudinalShearSection = {
  label: string
  xM: number
  localWidthM: number
  shearKn: number
  reference: GuideOneWayShearDirectionResult
}

export type TrapezoidalFootingAnalysis = {
  geometry: {
    areaM2: number
    centroidFromLeftM: number
    firstAreaMomentM3: number
    secondAreaMomentM4: number
    widthSlope: number
  }
  contact: {
    footingSelfWeightKn: number
    soilCoverWeightKn: number
    gross: PressureDistribution
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
    factored: PressureDistribution
    factoredPressureLeftKpa: number
    factoredPressureRightKpa: number
  }
  longitudinal: {
    reactionPolynomialKnM: { constant: number; linear: number; quadratic: number }
    criticalShearSections: TrapezoidalLongitudinalShearSection[]
    governingShearSection: TrapezoidalLongitudinalShearSection
    maximumPositiveMomentKnM: number
    maximumPositiveMomentXM: number
    minimumNegativeMomentKnM: number
    minimumNegativeMomentXM: number
    governingAbsoluteMomentKnM: number
    endShearKn: number
    endMomentKnM: number
    diagram: Array<{ xM: number; localWidthM: number; pressureKpa: number; reactionKnM: number; shearKn: number; momentKnM: number }>
  }
  transverse: {
    governingShearColumn: 1 | 2
    governingFlexureColumn: 1 | 2
    localFootingWidthM: number
    shearLocalPressureKpa: number
    flexureLocalPressureKpa: number
    cantileverProjectionM: number
    loadedLengthBeyondCriticalSectionM: number
    oneWayShearDemandKnPerM: number
    flexureDemandKnMPerM: number
    shearReference: GuideOneWayShearDirectionResult
  }
  punching: [TrapezoidalPunchingResult, TrapezoidalPunchingResult]
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

export type TrapezoidalFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: TrapezoidalValidationIssue[] }
  | { status: 'calculated'; analysis: TrapezoidalFootingAnalysis }

const positiveFields: Array<keyof TrapezoidalFootingInputs> = [
  'serviceColumn1LoadKn', 'serviceColumn2LoadKn', 'factoredColumn1LoadKn', 'factoredColumn2LoadKn',
  'allowableBearingKpa', 'concreteUnitWeightKnM3', 'leftFootingWidthM', 'rightFootingWidthM',
  'footingLengthM', 'footingThicknessM', 'column1WidthM', 'column1LengthM', 'column1CenterFromLeftM',
  'column2WidthM', 'column2LengthM', 'column2CenterFromLeftM', 'barDiameterM', 'concreteStrengthMpa',
  'steelYieldStrengthMpa', 'longitudinalBottomBarSpacingM', 'longitudinalTopBarSpacingM',
  'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM',
]
const nonNegativeFields: Array<keyof TrapezoidalFootingInputs> = ['removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM']

const geometryOf = (inputs: TrapezoidalFootingInputs) => {
  const widthSlope = (inputs.rightFootingWidthM - inputs.leftFootingWidthM) / inputs.footingLengthM
  const areaM2 = inputs.leftFootingWidthM * inputs.footingLengthM + widthSlope * inputs.footingLengthM ** 2 / 2
  const firstAreaMomentM3 = inputs.leftFootingWidthM * inputs.footingLengthM ** 2 / 2 + widthSlope * inputs.footingLengthM ** 3 / 3
  const secondAreaMomentM4 = inputs.leftFootingWidthM * inputs.footingLengthM ** 3 / 3 + widthSlope * inputs.footingLengthM ** 4 / 4
  return { widthSlope, areaM2, firstAreaMomentM3, secondAreaMomentM4, centroidFromLeftM: firstAreaMomentM3 / areaM2 }
}

const widthAt = (inputs: TrapezoidalFootingInputs, xM: number) => inputs.leftFootingWidthM
  + (inputs.rightFootingWidthM - inputs.leftFootingWidthM) * xM / inputs.footingLengthM

const punchingStrength = (concreteStrengthMpa: number, columnWidthM: number, columnLengthM: number, effectiveDepthM: number) => {
  const criticalWidthM = columnWidthM + effectiveDepthM
  const criticalLengthM = columnLengthM + effectiveDepthM
  const criticalPerimeterM = 2 * (criticalWidthM + criticalLengthM)
  const root = Math.sqrt(concreteStrengthMpa)
  const beta = Math.max(columnWidthM, columnLengthM) / Math.min(columnWidthM, columnLengthM)
  const alternatives = Math.abs(columnWidthM - columnLengthM) < 1e-9 ? [0.33 * root] : [
    0.33 * root,
    0.17 * (1 + 2 / beta) * root,
    0.083 * (2 + 0.4 * effectiveDepthM / criticalPerimeterM) * root,
  ]
  return {
    criticalWidthM,
    criticalLengthM,
    criticalPerimeterM,
    designShearStrengthKn: 0.75 * Math.min(...alternatives) * criticalPerimeterM * effectiveDepthM * 1000,
  }
}

export function validateTrapezoidalFootingInputs(inputs: TrapezoidalFootingInputs): TrapezoidalValidationIssue[] {
  const issues: TrapezoidalValidationIssue[] = []
  for (const field of positiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) issues.push({ field, message: 'Este valor debe ser un número mayor que cero.' })
  }
  for (const field of nonNegativeFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) issues.push({ field, message: 'Este valor debe ser un número mayor o igual a cero.' })
  }
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  if (Math.abs(inputs.leftFootingWidthM - inputs.rightFootingWidthM) < 1e-9) issues.push({ field: 'rightFootingWidthM', message: 'Los anchos extremos deben ser distintos; para anchos iguales usa la zapata combinada rectangular.' })
  if (inputs.column1CenterFromLeftM >= inputs.column2CenterFromLeftM) issues.push({ field: 'column2CenterFromLeftM', message: 'La columna 2 debe ubicarse a la derecha de la columna 1.' })
  const c1Left = inputs.column1CenterFromLeftM - inputs.column1LengthM / 2
  const c1Right = inputs.column1CenterFromLeftM + inputs.column1LengthM / 2
  const c2Left = inputs.column2CenterFromLeftM - inputs.column2LengthM / 2
  const c2Right = inputs.column2CenterFromLeftM + inputs.column2LengthM / 2
  if (c1Left <= 0 || c1Right >= inputs.footingLengthM) issues.push({ field: 'column1CenterFromLeftM', message: 'La columna 1 debe quedar completamente dentro de la zapata.' })
  if (c2Left <= 0 || c2Right >= inputs.footingLengthM) issues.push({ field: 'column2CenterFromLeftM', message: 'La columna 2 debe quedar completamente dentro de la zapata.' })
  if (c1Right >= c2Left) issues.push({ field: 'column2CenterFromLeftM', message: 'Las columnas no pueden superponerse.' })
  if (inputs.column1WidthM >= widthAt(inputs, inputs.column1CenterFromLeftM)) issues.push({ field: 'column1WidthM', message: 'La columna 1 debe ser más angosta que la sección local del trapecio.' })
  if (inputs.column2WidthM >= widthAt(inputs, inputs.column2CenterFromLeftM)) issues.push({ field: 'column2WidthM', message: 'La columna 2 debe ser más angosta que la sección local del trapecio.' })
  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  if (effectiveDepthM <= 0) issues.push({ field: 'concreteCoverM', message: 'Espesor, recubrimiento y barra deben producir una profundidad efectiva positiva.' })
  if (effectiveDepthM > 0) {
    const columns = [
      { field: 'column1CenterFromLeftM' as const, xM: inputs.column1CenterFromLeftM, widthM: inputs.column1WidthM, lengthM: inputs.column1LengthM },
      { field: 'column2CenterFromLeftM' as const, xM: inputs.column2CenterFromLeftM, widthM: inputs.column2WidthM, lengthM: inputs.column2LengthM },
    ]
    const intervals: Array<{ leftM: number; rightM: number }> = []
    for (const column of columns) {
      const criticalWidthM = column.widthM + effectiveDepthM
      const criticalLengthM = column.lengthM + effectiveDepthM
      const leftM = column.xM - criticalLengthM / 2
      const rightM = column.xM + criticalLengthM / 2
      intervals.push({ leftM, rightM })
      const minimumLocalWidthM = Math.min(widthAt(inputs, leftM), widthAt(inputs, rightM))
      if (leftM <= 0 || rightM >= inputs.footingLengthM || criticalWidthM >= minimumLocalWidthM) {
        issues.push({ field: column.field, message: 'El perímetro completo de punzonamiento debe quedar dentro de los bordes inclinados del trapecio.' })
      }
    }
    if (intervals[0].rightM >= intervals[1].leftM) issues.push({ field: 'column2CenterFromLeftM', message: 'Los perímetros críticos de las columnas no pueden superponerse.' })
  }
  return issues
}

const pressureDistribution = (
  inputs: TrapezoidalFootingInputs,
  load1Kn: number,
  load2Kn: number,
  additionalLoadKn: number,
): PressureDistribution => {
  const geometry = geometryOf(inputs)
  const totalLoadKn = load1Kn + load2Kn + additionalLoadKn
  const momentFromLeftKnM = load1Kn * inputs.column1CenterFromLeftM
    + load2Kn * inputs.column2CenterFromLeftM
    + additionalLoadKn * geometry.centroidFromLeftM
  const determinant = geometry.areaM2 * geometry.secondAreaMomentM4 - geometry.firstAreaMomentM3 ** 2
  const pressureInterceptKpa = (totalLoadKn * geometry.secondAreaMomentM4 - momentFromLeftKnM * geometry.firstAreaMomentM3) / determinant
  const pressureSlopeKpaM = (momentFromLeftKnM * geometry.areaM2 - totalLoadKn * geometry.firstAreaMomentM3) / determinant
  const pressureLeftKpa = pressureInterceptKpa
  const pressureRightKpa = pressureInterceptKpa + pressureSlopeKpaM * inputs.footingLengthM
  return {
    totalLoadKn,
    momentFromLeftKnM,
    resultantFromLeftM: momentFromLeftKnM / totalLoadKn,
    eccentricityFromCentroidM: momentFromLeftKnM / totalLoadKn - geometry.centroidFromLeftM,
    pressureInterceptKpa,
    pressureSlopeKpaM,
    pressureLeftKpa,
    pressureRightKpa,
    minimumPressureKpa: Math.min(pressureLeftKpa, pressureRightKpa),
    maximumPressureKpa: Math.max(pressureLeftKpa, pressureRightKpa),
  }
}

const reinforcementResult = (provided: number, minimum: number, required: GuideReinforcementDirectionResult | null): ReinforcementResult => {
  if (required?.status === 'section-insufficient') return { providedAreaPerMeterMm2: provided, requiredAreaPerMeterMm2: null, governingAreaPerMeterMm2: null, status: 'section-insufficient' }
  const requiredAreaPerMeterMm2 = required?.requiredAreaPerMeterMm2 ?? 0
  const governingAreaPerMeterMm2 = Math.max(minimum, requiredAreaPerMeterMm2)
  return { providedAreaPerMeterMm2: provided, requiredAreaPerMeterMm2, governingAreaPerMeterMm2, status: provided >= governingAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference' }
}

/** Analiza una base trapezoidal rígida para dos columnas interiores y contacto completo. */
export function analyzeTrapezoidalFooting(inputs: TrapezoidalFootingInputs): TrapezoidalFootingAnalysisOutcome {
  const issues = validateTrapezoidalFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }
  const geometry = geometryOf(inputs)
  const footingSelfWeightKn = geometry.areaM2 * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKn = geometry.areaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const gross = pressureDistribution(inputs, inputs.serviceColumn1LoadKn, inputs.serviceColumn2LoadKn, footingSelfWeightKn + soilCoverWeightKn)
  if (gross.minimumPressureKpa < -1e-9) return { status: 'invalid-input', issues: [{ field: 'serviceColumn2LoadKn', message: 'La distribución de servicio pierde contacto completo. El levantamiento o contacto parcial está fuera de alcance.' }] }
  const netPressureLeftKpa = gross.pressureLeftKpa - inputs.removedOverburdenKpa
  const netPressureRightKpa = gross.pressureRightKpa - inputs.removedOverburdenKpa
  const pressureForComparisonLeftKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureLeftKpa : netPressureLeftKpa
  const pressureForComparisonRightKpa = inputs.bearingCapacityBasis === 'gross' ? gross.pressureRightKpa : netPressureRightKpa
  if (Math.min(pressureForComparisonLeftKpa, pressureForComparisonRightKpa) <= 0) return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión seleccionada para comparación debe permanecer positiva en ambos extremos.' }] }
  const maximumPressureForComparisonKpa = Math.max(pressureForComparisonLeftKpa, pressureForComparisonRightKpa)

  const factored = pressureDistribution(inputs, inputs.factoredColumn1LoadKn, inputs.factoredColumn2LoadKn, 0)
  if (factored.minimumPressureKpa < -1e-9) return { status: 'invalid-input', issues: [{ field: 'factoredColumn2LoadKn', message: 'La distribución última pierde contacto completo. El levantamiento o contacto parcial está fuera de alcance.' }] }
  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const qAt = (xM: number) => factored.pressureInterceptKpa + factored.pressureSlopeKpaM * xM
  const localWidthAt = (xM: number) => widthAt(inputs, xM)
  const c0 = factored.pressureInterceptKpa * inputs.leftFootingWidthM
  const c1 = factored.pressureInterceptKpa * geometry.widthSlope + factored.pressureSlopeKpaM * inputs.leftFootingWidthM
  const c2 = factored.pressureSlopeKpaM * geometry.widthSlope
  const reactionTo = (xM: number) => c0 * xM + c1 * xM ** 2 / 2 + c2 * xM ** 3 / 3
  const reactionMomentTo = (xM: number) => c0 * xM ** 2 / 2 + c1 * xM ** 3 / 6 + c2 * xM ** 4 / 12
  const columns = [
    { xM: inputs.column1CenterFromLeftM, loadKn: inputs.factoredColumn1LoadKn },
    { xM: inputs.column2CenterFromLeftM, loadKn: inputs.factoredColumn2LoadKn },
  ]
  const shearAt = (xM: number) => reactionTo(xM) - columns.filter((column) => column.xM <= xM).reduce((sum, column) => sum + column.loadKn, 0)
  const momentAt = (xM: number) => reactionMomentTo(xM) - columns.reduce((sum, column) => sum + column.loadKn * Math.max(xM - column.xM, 0), 0)

  const rootCandidates: number[] = []
  const intervals = [
    { from: 0, to: columns[0].xM, previousLoadKn: 0 },
    { from: columns[0].xM, to: columns[1].xM, previousLoadKn: columns[0].loadKn },
    { from: columns[1].xM, to: inputs.footingLengthM, previousLoadKn: columns[0].loadKn + columns[1].loadKn },
  ]
  for (const interval of intervals) {
    const value = (xM: number) => reactionTo(xM) - interval.previousLoadKn
    let left = interval.from
    let right = interval.to
    let leftValue = value(left)
    const rightValue = value(right)
    if (Math.abs(leftValue) < 1e-9) rootCandidates.push(left)
    if (leftValue * rightValue < 0) {
      for (let iteration = 0; iteration < 80; iteration += 1) {
        const middle = (left + right) / 2
        const middleValue = value(middle)
        if (leftValue * middleValue <= 0) right = middle
        else { left = middle; leftValue = middleValue }
      }
      rootCandidates.push((left + right) / 2)
    }
  }
  const momentCandidates = [...new Set([0, inputs.footingLengthM, ...columns.map((column) => column.xM), ...rootCandidates])]
    .map((xM) => ({ xM, momentKnM: momentAt(xM) }))
  const maximumPositive = momentCandidates.reduce((best, candidate) => candidate.momentKnM > best.momentKnM ? candidate : best, { xM: 0, momentKnM: 0 })
  const minimumNegative = momentCandidates.reduce((best, candidate) => candidate.momentKnM < best.momentKnM ? candidate : best, { xM: 0, momentKnM: 0 })

  const criticalPositions = [
    { label: 'C1 izquierda', xM: inputs.column1CenterFromLeftM - inputs.column1LengthM / 2 - effectiveDepthM },
    { label: 'C1 derecha', xM: inputs.column1CenterFromLeftM + inputs.column1LengthM / 2 + effectiveDepthM },
    { label: 'C2 izquierda', xM: inputs.column2CenterFromLeftM - inputs.column2LengthM / 2 - effectiveDepthM },
    { label: 'C2 derecha', xM: inputs.column2CenterFromLeftM + inputs.column2LengthM / 2 + effectiveDepthM },
  ].filter((section) => section.xM > 0 && section.xM < inputs.footingLengthM)
  const criticalShearSections = criticalPositions.map((section): TrapezoidalLongitudinalShearSection => {
    const shearKn = shearAt(section.xM)
    const localWidthM = localWidthAt(section.xM)
    const reference = checkGuideOneWayShear({
      concreteStrengthMpa: inputs.concreteStrengthMpa,
      effectiveDepthM,
      widthShearDemandKn: Math.abs(shearKn),
      widthSectionWidthM: localWidthM,
      lengthShearDemandKn: 0,
      lengthSectionWidthM: 1,
    }).widthDirection
    return { ...section, localWidthM, shearKn, reference }
  })
  const governingShearSection = criticalShearSections.reduce((governing, candidate) => candidate.reference.utilization > governing.reference.utilization ? candidate : governing)

  const transverseCandidates = ([
    { column: 1 as const, xM: inputs.column1CenterFromLeftM, columnWidthM: inputs.column1WidthM },
    { column: 2 as const, xM: inputs.column2CenterFromLeftM, columnWidthM: inputs.column2WidthM },
  ]).map((candidate) => {
    const localFootingWidthM = localWidthAt(candidate.xM)
    const pressureKpa = qAt(candidate.xM)
    const cantileverProjectionM = (localFootingWidthM - candidate.columnWidthM) / 2
    const loadedLengthBeyondCriticalSectionM = Math.max(cantileverProjectionM - effectiveDepthM, 0)
    return {
      ...candidate, localFootingWidthM, pressureKpa, cantileverProjectionM, loadedLengthBeyondCriticalSectionM,
      oneWayShearDemandKnPerM: pressureKpa * loadedLengthBeyondCriticalSectionM,
      flexureDemandKnMPerM: pressureKpa * cantileverProjectionM ** 2 / 2,
    }
  })
  const transverseShear = transverseCandidates.reduce((governing, candidate) => candidate.oneWayShearDemandKnPerM > governing.oneWayShearDemandKnPerM ? candidate : governing)
  const transverseFlexure = transverseCandidates.reduce((governing, candidate) => candidate.flexureDemandKnMPerM > governing.flexureDemandKnMPerM ? candidate : governing)
  const transverseShearReference = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn: 0,
    widthSectionWidthM: 1,
    lengthShearDemandKn: transverseShear.oneWayShearDemandKnPerM,
    lengthSectionWidthM: 1,
  }).lengthDirection

  const integrateQ = (fromXM: number, toXM: number) => factored.pressureInterceptKpa * (toXM - fromXM)
    + factored.pressureSlopeKpaM * (toXM ** 2 - fromXM ** 2) / 2
  const punching = ([
    { column: 1 as const, xM: inputs.column1CenterFromLeftM, widthM: inputs.column1WidthM, lengthM: inputs.column1LengthM, loadKn: inputs.factoredColumn1LoadKn },
    { column: 2 as const, xM: inputs.column2CenterFromLeftM, widthM: inputs.column2WidthM, lengthM: inputs.column2LengthM, loadKn: inputs.factoredColumn2LoadKn },
  ]).map((column): TrapezoidalPunchingResult => {
    const strength = punchingStrength(inputs.concreteStrengthMpa, column.widthM, column.lengthM, effectiveDepthM)
    const leftM = column.xM - strength.criticalLengthM / 2
    const rightM = column.xM + strength.criticalLengthM / 2
    const soilReactionInsideKn = strength.criticalWidthM * integrateQ(leftM, rightM)
    const shearDemandKn = Math.max(column.loadKn - soilReactionInsideKn, 0)
    const utilization = shearDemandKn / strength.designShearStrengthKn
    return { column: column.column, localFootingWidthM: localWidthAt(column.xM), ...strength, soilReactionInsideKn, shearDemandKn, utilization, status: utilization <= 1 ? 'meets-guide-reference' : 'below-guide-reference' }
  }) as [TrapezoidalPunchingResult, TrapezoidalPunchingResult]

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
  const longitudinalBottomRequired = calculateRequired(maximumPositive.momentKnM, localWidthAt(maximumPositive.xM))
  const longitudinalTopRequired = calculateRequired(Math.abs(minimumNegative.momentKnM), localWidthAt(minimumNegative.xM))
  const transverseRequired = calculateRequired(transverseFlexure.flexureDemandKnMPerM, 1)
  const barAreaMm2 = minimumReinforcement.barAreaMm2
  const minimumAreaPerMeterMm2 = minimumReinforcement.minimumAreaPerMeterMm2
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa,
    steelYieldStrengthMpa: inputs.steelYieldStrengthMpa,
    barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.transverseDevelopmentAvailableM,
    availableLengthLengthM: inputs.longitudinalDevelopmentAvailableM,
  })
  const diagram = Array.from({ length: 121 }, (_, index) => {
    const xM = inputs.footingLengthM * index / 120
    return { xM, localWidthM: localWidthAt(xM), pressureKpa: qAt(xM), reactionKnM: c0 + c1*xM + c2*xM**2, shearKn: shearAt(xM), momentKnM: momentAt(xM) }
  })

  return {
    status: 'calculated',
    analysis: {
      geometry,
      contact: {
        footingSelfWeightKn, soilCoverWeightKn, gross,
        grossPressureLeftKpa: gross.pressureLeftKpa, grossPressureRightKpa: gross.pressureRightKpa,
        netPressureLeftKpa, netPressureRightKpa, pressureForComparisonLeftKpa, pressureForComparisonRightKpa,
        maximumPressureForComparisonKpa, allowableBearingKpa: inputs.allowableBearingKpa,
        utilization: maximumPressureForComparisonKpa / inputs.allowableBearingKpa,
        status: maximumPressureForComparisonKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
      },
      structural: { effectiveDepthM, factored, factoredPressureLeftKpa: factored.pressureLeftKpa, factoredPressureRightKpa: factored.pressureRightKpa },
      longitudinal: {
        reactionPolynomialKnM: { constant: c0, linear: c1, quadratic: c2 }, criticalShearSections, governingShearSection,
        maximumPositiveMomentKnM: maximumPositive.momentKnM, maximumPositiveMomentXM: maximumPositive.xM,
        minimumNegativeMomentKnM: minimumNegative.momentKnM, minimumNegativeMomentXM: minimumNegative.xM,
        governingAbsoluteMomentKnM: Math.max(maximumPositive.momentKnM, Math.abs(minimumNegative.momentKnM)),
        endShearKn: shearAt(inputs.footingLengthM), endMomentKnM: momentAt(inputs.footingLengthM), diagram,
      },
      transverse: {
        governingShearColumn: transverseShear.column, governingFlexureColumn: transverseFlexure.column,
        localFootingWidthM: transverseFlexure.localFootingWidthM, shearLocalPressureKpa: transverseShear.pressureKpa,
        flexureLocalPressureKpa: transverseFlexure.pressureKpa, cantileverProjectionM: transverseFlexure.cantileverProjectionM,
        loadedLengthBeyondCriticalSectionM: transverseShear.loadedLengthBeyondCriticalSectionM,
        oneWayShearDemandKnPerM: transverseShear.oneWayShearDemandKnPerM,
        flexureDemandKnMPerM: transverseFlexure.flexureDemandKnMPerM, shearReference: transverseShearReference,
      },
      punching,
      minimumReinforcement,
      requiredReinforcement: { longitudinalBottom: longitudinalBottomRequired, longitudinalTop: longitudinalTopRequired, transverse: transverseRequired },
      reinforcement: {
        barAreaMm2, minimumAreaPerMeterMm2,
        longitudinalBottom: reinforcementResult(barAreaMm2 / inputs.longitudinalBottomBarSpacingM, minimumAreaPerMeterMm2, longitudinalBottomRequired),
        longitudinalTop: reinforcementResult(barAreaMm2 / inputs.longitudinalTopBarSpacingM, minimumAreaPerMeterMm2, longitudinalTopRequired),
        transverse: reinforcementResult(barAreaMm2 / inputs.transverseBarSpacingM, minimumAreaPerMeterMm2, transverseRequired),
      },
      development,
    },
  }
}
