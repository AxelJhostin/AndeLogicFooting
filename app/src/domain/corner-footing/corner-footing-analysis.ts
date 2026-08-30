import type { CornerFootingInputs } from '../projects'
import { checkGuideDevelopmentLength } from '../footing/development-length-guide-check'
import { calculateGuideMinimumReinforcement, type MinimumReinforcementResult } from '../footing/minimum-reinforcement'
import { checkGuideOneWayShear, type GuideOneWayShearDirectionResult } from '../footing/one-way-shear-guide-check'
import { calculateGuideRequiredReinforcement, type GuideReinforcementDirectionResult } from '../footing/required-reinforcement'

export type CornerFootingValidationIssue = { field: keyof CornerFootingInputs; message: string }
export type CornerPressures = { bottomLeft: number; bottomRight: number; topLeft: number; topRight: number }

export type CornerPressureDistribution = {
  totalLoadKn: number
  momentXKnM: number
  momentYKnM: number
  eccentricityXM: number
  eccentricityYM: number
  normalizedEccentricityX: number
  normalizedEccentricityY: number
  kernInteraction: number
  kernMargin: number
  averagePressureKpa: number
  cornerPressuresKpa: CornerPressures
  minimumPressureKpa: number
  maximumPressureKpa: number
}

type ReinforcementResult = {
  providedAreaPerMeterMm2: number
  requiredAreaPerMeterMm2: number | null
  governingAreaPerMeterMm2: number | null
  status: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
}

export type CornerDirectionAnalysis = {
  axis: 'x' | 'y'
  axisLengthM: number
  perpendicularWidthM: number
  columnCenterM: number
  columnNearFaceM: number
  columnFarFaceM: number
  pressureStartKpa: number
  pressureEndKpa: number
  distributedReactionKnM: { intercept: number; slope: number }
  criticalShearSections: Array<{ label: string; coordinateM: number; shearKn: number }>
  governingShearDemandKn: number
  nearFaceFlexureDemandKnM: number
  farFaceFlexureDemandKnM: number
  governingFlexureDemandKnM: number
  endShearKn: number
  endMomentKnM: number
  diagram: Array<{ coordinateM: number; pressureKpa: number; reactionKnM: number; shearKn: number; momentKnM: number }>
}

export type CornerFootingAnalysis = {
  geometry: {
    areaM2: number
    centroidXM: number
    centroidYM: number
    columnCenterXM: number
    columnCenterYM: number
    columnLeftFaceM: number
    columnRightFaceM: number
    columnBottomFaceM: number
    columnTopFaceM: number
    cornerPosition: CornerFootingInputs['cornerPosition']
  }
  contact: {
    footingSelfWeightKn: number
    soilCoverWeightKn: number
    gross: CornerPressureDistribution
    netCornerPressuresKpa: CornerPressures
    pressureForComparisonKpa: CornerPressures
    maximumPressureForComparisonKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  structural: { effectiveDepthM: number; factored: CornerPressureDistribution }
  directions: { x: CornerDirectionAnalysis; y: CornerDirectionAnalysis }
  equilibrium: {
    integratedReactionKn: number
    integratedMomentXKnM: number
    integratedMomentYKnM: number
    verticalResidualKn: number
    momentXResidualKnM: number
    momentYResidualKnM: number
  }
  shearReference: { x: GuideOneWayShearDirectionResult; y: GuideOneWayShearDirectionResult; concreteShearStressMpa: number }
  punching: { status: 'not-evaluated'; reason: string }
  minimumReinforcement: MinimumReinforcementResult
  requiredReinforcement: { x: GuideReinforcementDirectionResult; y: GuideReinforcementDirectionResult }
  reinforcement: { barAreaMm2: number; minimumAreaPerMeterMm2: number; x: ReinforcementResult; y: ReinforcementResult }
  development: {
    requiredDevelopmentLengthM: number
    x: { availableLengthM: number; status: 'meets-guide-reference' | 'below-guide-reference' }
    y: { availableLengthM: number; status: 'meets-guide-reference' | 'below-guide-reference' }
  }
}

export type CornerFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: CornerFootingValidationIssue[] }
  | { status: 'calculated'; analysis: CornerFootingAnalysis }

const positiveFields: Array<keyof CornerFootingInputs> = [
  'serviceAxialLoadKn', 'factoredAxialLoadKn', 'allowableBearingKpa', 'concreteUnitWeightKnM3',
  'footingWidthM', 'footingLengthM', 'footingThicknessM', 'columnWidthM', 'columnLengthM',
  'barDiameterM', 'concreteStrengthMpa', 'steelYieldStrengthMpa', 'longitudinalBarSpacingM',
  'transverseBarSpacingM', 'longitudinalDevelopmentAvailableM', 'transverseDevelopmentAvailableM',
]
const nonNegativeFields: Array<keyof CornerFootingInputs> = [
  'removedOverburdenKpa', 'soilCoverDepthM', 'soilUnitWeightKnM3', 'concreteCoverM',
]
const cornerPositions: CornerFootingInputs['cornerPosition'][] = ['bottom-left', 'bottom-right', 'top-left', 'top-right']

export function validateCornerFootingInputs(inputs: CornerFootingInputs): CornerFootingValidationIssue[] {
  const issues: CornerFootingValidationIssue[] = []
  for (const field of positiveFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) issues.push({ field, message: 'Este valor debe ser un número mayor que cero.' })
  }
  for (const field of nonNegativeFields) {
    const value = inputs[field]
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) issues.push({ field, message: 'Este valor debe ser un número mayor o igual a cero.' })
  }
  if (!cornerPositions.includes(inputs.cornerPosition)) issues.push({ field: 'cornerPosition', message: 'Selecciona una de las cuatro esquinas.' })
  if (inputs.columnLengthM >= inputs.footingLengthM) issues.push({ field: 'columnLengthM', message: 'La longitud de la columna debe ser menor que la longitud de la zapata.' })
  if (inputs.columnWidthM >= inputs.footingWidthM) issues.push({ field: 'columnWidthM', message: 'El ancho de la columna debe ser menor que el ancho de la zapata.' })
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  if (inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2 <= 0) issues.push({ field: 'concreteCoverM', message: 'Espesor, recubrimiento y barra deben producir una profundidad efectiva positiva.' })
  return issues
}

const columnCoordinates = (inputs: CornerFootingInputs) => {
  const isLeft = inputs.cornerPosition.endsWith('left')
  const isBottom = inputs.cornerPosition.startsWith('bottom')
  const x = isLeft ? inputs.columnLengthM / 2 : inputs.footingLengthM - inputs.columnLengthM / 2
  const y = isBottom ? inputs.columnWidthM / 2 : inputs.footingWidthM - inputs.columnWidthM / 2
  return { x, y }
}

const pressureDistribution = (inputs: CornerFootingInputs, columnLoadKn: number, centeredAdditionalLoadKn: number): CornerPressureDistribution => {
  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const column = columnCoordinates(inputs)
  const totalLoadKn = columnLoadKn + centeredAdditionalLoadKn
  const momentYKnM = columnLoadKn * (column.x - inputs.footingLengthM / 2)
  const momentXKnM = columnLoadKn * (column.y - inputs.footingWidthM / 2)
  const eccentricityXM = momentYKnM / totalLoadKn
  const eccentricityYM = momentXKnM / totalLoadKn
  const normalizedEccentricityX = 6 * eccentricityXM / inputs.footingLengthM
  const normalizedEccentricityY = 6 * eccentricityYM / inputs.footingWidthM
  const kernInteraction = Math.abs(normalizedEccentricityX) + Math.abs(normalizedEccentricityY)
  const averagePressureKpa = totalLoadKn / areaM2
  const corner = (sx: -1 | 1, sy: -1 | 1) => averagePressureKpa * (1 + sx * normalizedEccentricityX + sy * normalizedEccentricityY)
  const cornerPressuresKpa = {
    bottomLeft: corner(-1, -1),
    bottomRight: corner(1, -1),
    topLeft: corner(-1, 1),
    topRight: corner(1, 1),
  }
  const values = Object.values(cornerPressuresKpa)
  return {
    totalLoadKn, momentXKnM, momentYKnM, eccentricityXM, eccentricityYM,
    normalizedEccentricityX, normalizedEccentricityY, kernInteraction, kernMargin: 1 - kernInteraction,
    averagePressureKpa, cornerPressuresKpa, minimumPressureKpa: Math.min(...values), maximumPressureKpa: Math.max(...values),
  }
}

const directionAnalysis = (axis: 'x' | 'y', axisLengthM: number, perpendicularWidthM: number, columnCenterM: number, columnSizeM: number, pressureStartKpa: number, pressureEndKpa: number, loadKn: number, effectiveDepthM: number): CornerDirectionAnalysis => {
  const columnNearFaceM = columnCenterM - columnSizeM / 2
  const columnFarFaceM = columnCenterM + columnSizeM / 2
  const intercept = perpendicularWidthM * pressureStartKpa
  const slope = perpendicularWidthM * (pressureEndKpa - pressureStartKpa) / axisLengthM
  const reactionTo = (coordinateM: number) => intercept * coordinateM + slope * coordinateM ** 2 / 2
  const reactionMomentTo = (coordinateM: number) => intercept * coordinateM ** 2 / 2 + slope * coordinateM ** 3 / 6
  const reactionFirstMomentTo = (coordinateM: number) => intercept * coordinateM ** 2 / 2 + slope * coordinateM ** 3 / 3
  const shearAt = (coordinateM: number) => reactionTo(coordinateM) - (coordinateM >= columnCenterM ? loadKn : 0)
  const momentAt = (coordinateM: number) => reactionMomentTo(coordinateM) - loadKn * Math.max(coordinateM - columnCenterM, 0)
  const criticalShearSections = [
    { label: 'Cara inicial − d', coordinateM: columnNearFaceM - effectiveDepthM },
    { label: 'Cara final + d', coordinateM: columnFarFaceM + effectiveDepthM },
  ].filter(({ coordinateM }) => coordinateM > 0 && coordinateM < axisLengthM)
    .map((section) => ({ ...section, shearKn: shearAt(section.coordinateM) }))
  const nearFaceFlexureDemandKnM = reactionMomentTo(columnNearFaceM)
  const farFaceFlexureDemandKnM = reactionFirstMomentTo(axisLengthM) - reactionFirstMomentTo(columnFarFaceM)
    - columnFarFaceM * (reactionTo(axisLengthM) - reactionTo(columnFarFaceM))
  return {
    axis, axisLengthM, perpendicularWidthM, columnCenterM, columnNearFaceM, columnFarFaceM,
    pressureStartKpa, pressureEndKpa, distributedReactionKnM: { intercept, slope }, criticalShearSections,
    governingShearDemandKn: criticalShearSections.length ? Math.max(...criticalShearSections.map(({ shearKn }) => Math.abs(shearKn))) : 0,
    nearFaceFlexureDemandKnM, farFaceFlexureDemandKnM,
    governingFlexureDemandKnM: Math.max(nearFaceFlexureDemandKnM, farFaceFlexureDemandKnM),
    endShearKn: shearAt(axisLengthM), endMomentKnM: momentAt(axisLengthM),
    diagram: Array.from({ length: 61 }, (_, index) => {
      const coordinateM = axisLengthM * index / 60
      const pressureKpa = pressureStartKpa + (pressureEndKpa - pressureStartKpa) * coordinateM / axisLengthM
      return { coordinateM, pressureKpa, reactionKnM: perpendicularWidthM * pressureKpa, shearKn: shearAt(coordinateM), momentKnM: momentAt(coordinateM) }
    }),
  }
}

const reinforcementResult = (providedAreaPerMeterMm2: number, minimumAreaPerMeterMm2: number, required: GuideReinforcementDirectionResult): ReinforcementResult => {
  if (required.status === 'section-insufficient') return { providedAreaPerMeterMm2, requiredAreaPerMeterMm2: null, governingAreaPerMeterMm2: null, status: 'section-insufficient' }
  const requiredAreaPerMeterMm2 = required.requiredAreaPerMeterMm2 ?? 0
  const governingAreaPerMeterMm2 = Math.max(minimumAreaPerMeterMm2, requiredAreaPerMeterMm2)
  return { providedAreaPerMeterMm2, requiredAreaPerMeterMm2, governingAreaPerMeterMm2, status: providedAreaPerMeterMm2 >= governingAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference' }
}

/** Analiza una zapata rectangular de esquina bajo carga axial y contacto completo biaxial. */
export function analyzeCornerFooting(inputs: CornerFootingInputs): CornerFootingAnalysisOutcome {
  const issues = validateCornerFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const column = columnCoordinates(inputs)
  const footingSelfWeightKn = areaM2 * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKn = areaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const gross = pressureDistribution(inputs, inputs.serviceAxialLoadKn, footingSelfWeightKn + soilCoverWeightKn)
  if (gross.minimumPressureKpa < -1e-9 || gross.kernMargin < -1e-9) return { status: 'invalid-input', issues: [{ field: 'footingLengthM', message: 'La resultante de servicio queda fuera del núcleo central biaxial. El contacto parcial está fuera de alcance.' }] }

  const netCornerPressuresKpa = Object.fromEntries(Object.entries(gross.cornerPressuresKpa).map(([key, value]) => [key, value - inputs.removedOverburdenKpa])) as CornerPressures
  const pressureForComparisonKpa = inputs.bearingCapacityBasis === 'gross' ? gross.cornerPressuresKpa : netCornerPressuresKpa
  const maximumPressureForComparisonKpa = Math.max(...Object.values(pressureForComparisonKpa))
  if (maximumPressureForComparisonKpa <= 0) return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión máxima seleccionada para comparación debe ser mayor que cero.' }] }

  const factored = pressureDistribution(inputs, inputs.factoredAxialLoadKn, 0)
  if (factored.minimumPressureKpa < -1e-9 || factored.kernMargin < -1e-9) return { status: 'invalid-input', issues: [{ field: 'footingLengthM', message: 'La resultante última queda fuera del núcleo central biaxial. El levantamiento o contacto parcial está fuera de alcance.' }] }

  const effectiveDepthM = inputs.footingThicknessM - inputs.concreteCoverM - inputs.barDiameterM / 2
  const xPressureStart = factored.averagePressureKpa * (1 - factored.normalizedEccentricityX)
  const xPressureEnd = factored.averagePressureKpa * (1 + factored.normalizedEccentricityX)
  const yPressureStart = factored.averagePressureKpa * (1 - factored.normalizedEccentricityY)
  const yPressureEnd = factored.averagePressureKpa * (1 + factored.normalizedEccentricityY)
  const x = directionAnalysis('x', inputs.footingLengthM, inputs.footingWidthM, column.x, inputs.columnLengthM, xPressureStart, xPressureEnd, inputs.factoredAxialLoadKn, effectiveDepthM)
  const y = directionAnalysis('y', inputs.footingWidthM, inputs.footingLengthM, column.y, inputs.columnWidthM, yPressureStart, yPressureEnd, inputs.factoredAxialLoadKn, effectiveDepthM)

  const shearCheck = checkGuideOneWayShear({
    concreteStrengthMpa: inputs.concreteStrengthMpa, effectiveDepthM,
    widthShearDemandKn: x.governingShearDemandKn, widthSectionWidthM: inputs.footingWidthM,
    lengthShearDemandKn: y.governingShearDemandKn, lengthSectionWidthM: inputs.footingLengthM,
  })
  const minimumReinforcement = calculateGuideMinimumReinforcement({
    footingThicknessM: inputs.footingThicknessM, barDiameterM: inputs.barDiameterM,
    barsParallelToWidthSpacingM: inputs.transverseBarSpacingM, barsParallelToLengthSpacingM: inputs.longitudinalBarSpacingM,
  })
  const required = calculateGuideRequiredReinforcement({
    concreteStrengthMpa: inputs.concreteStrengthMpa, steelYieldStrengthMpa: inputs.steelYieldStrengthMpa, effectiveDepthM,
    widthMomentDemandKnM: Math.max(x.governingFlexureDemandKnM, 1e-12), widthStripWidthM: inputs.footingWidthM,
    lengthMomentDemandKnM: Math.max(y.governingFlexureDemandKnM, 1e-12), lengthStripWidthM: inputs.footingLengthM,
  })
  const development = checkGuideDevelopmentLength({
    concreteStrengthMpa: inputs.concreteStrengthMpa, steelYieldStrengthMpa: inputs.steelYieldStrengthMpa, barDiameterM: inputs.barDiameterM,
    availableLengthWidthM: inputs.transverseDevelopmentAvailableM, availableLengthLengthM: inputs.longitudinalDevelopmentAvailableM,
  })

  const recoveredReactionKn = factored.averagePressureKpa * areaM2
  const recoveredMomentYKnM = recoveredReactionKn * factored.eccentricityXM
  const recoveredMomentXKnM = recoveredReactionKn * factored.eccentricityYM
  return { status: 'calculated', analysis: {
    geometry: {
      areaM2, centroidXM: inputs.footingLengthM / 2, centroidYM: inputs.footingWidthM / 2,
      columnCenterXM: column.x, columnCenterYM: column.y,
      columnLeftFaceM: column.x - inputs.columnLengthM / 2, columnRightFaceM: column.x + inputs.columnLengthM / 2,
      columnBottomFaceM: column.y - inputs.columnWidthM / 2, columnTopFaceM: column.y + inputs.columnWidthM / 2,
      cornerPosition: inputs.cornerPosition,
    },
    contact: {
      footingSelfWeightKn, soilCoverWeightKn, gross, netCornerPressuresKpa, pressureForComparisonKpa,
      maximumPressureForComparisonKpa, allowableBearingKpa: inputs.allowableBearingKpa,
      utilization: maximumPressureForComparisonKpa / inputs.allowableBearingKpa,
      status: maximumPressureForComparisonKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
    },
    structural: { effectiveDepthM, factored }, directions: { x, y },
    equilibrium: {
      integratedReactionKn: recoveredReactionKn, integratedMomentXKnM: recoveredMomentXKnM, integratedMomentYKnM: recoveredMomentYKnM,
      verticalResidualKn: recoveredReactionKn - factored.totalLoadKn,
      momentXResidualKnM: recoveredMomentXKnM - factored.momentXKnM,
      momentYResidualKnM: recoveredMomentYKnM - factored.momentYKnM,
    },
    shearReference: { x: shearCheck.widthDirection, y: shearCheck.lengthDirection, concreteShearStressMpa: shearCheck.concreteShearStressMpa },
    punching: { status: 'not-evaluated', reason: 'La columna coincide con dos bordes y el perímetro crítico queda truncado en ambas direcciones. No se reutilizan referencias de columna interior o de borde.' },
    minimumReinforcement,
    requiredReinforcement: { x: required.widthDirection, y: required.lengthDirection },
    reinforcement: {
      barAreaMm2: minimumReinforcement.barAreaMm2, minimumAreaPerMeterMm2: minimumReinforcement.minimumAreaPerMeterMm2,
      x: reinforcementResult(minimumReinforcement.barsParallelToLength.providedAreaPerMeterMm2, minimumReinforcement.minimumAreaPerMeterMm2, required.widthDirection),
      y: reinforcementResult(minimumReinforcement.barsParallelToWidth.providedAreaPerMeterMm2, minimumReinforcement.minimumAreaPerMeterMm2, required.lengthDirection),
    },
    development: { requiredDevelopmentLengthM: development.requiredDevelopmentLengthM, x: development.lengthDirection, y: development.widthDirection },
  } }
}
