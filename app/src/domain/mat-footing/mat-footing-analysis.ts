import type { MatColumnInput, MatFootingInputs } from '../projects'

export type MatFootingValidationIssue = {
  field: keyof MatFootingInputs | 'columns'
  columnId?: string
  message: string
}

export type MatCornerValues = {
  bottomLeft: number
  bottomRight: number
  topLeft: number
  topRight: number
}

export type MatPressureDistribution = {
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
  cornerPressuresKpa: MatCornerValues
  minimumPressureKpa: number
  maximumPressureKpa: number
}

export type MatProjectionAnalysis = {
  axis: 'x' | 'y'
  axisLengthM: number
  perpendicularWidthM: number
  pressureStartKpa: number
  pressureEndKpa: number
  distributedReactionKnM: { intercept: number; slope: number }
  projectedColumns: Array<{ id: string; label: string; coordinateM: number; loadKn: number }>
  endShearKn: number
  endMomentKnM: number
  maximumShearKn: number
  maximumPositiveMomentKnM: number
  minimumNegativeMomentKnM: number
  diagram: Array<{ coordinateM: number; pressureKpa: number; reactionKnM: number; shearKn: number; momentKnM: number }>
}

type SettlementStatus = 'pass' | 'fail' | 'not-provided'

export type MatSettlementAnalysis =
  | { status: 'not-evaluated'; reason: string }
  | {
    status: 'calculated'
    pressureBasis: MatFootingInputs['settlementPressureBasis']
    subgradeModulusKnM3: number
    cornerSettlementsMm: MatCornerValues
    minimumSettlementMm: number
    maximumSettlementMm: number
    differentialSettlementMm: number
    allowableTotalSettlementMm: number | null
    allowableDifferentialSettlementMm: number | null
    totalStatus: SettlementStatus
    differentialStatus: SettlementStatus
  }

export type MatFootingAnalysis = {
  geometry: {
    areaM2: number
    centroidXM: number
    centroidYM: number
    columnCount: number
  }
  loads: {
    serviceColumnTotalKn: number
    factoredColumnTotalKn: number
  }
  contact: {
    footingSelfWeightKn: number
    soilCoverWeightKn: number
    gross: MatPressureDistribution
    netCornerPressuresKpa: MatCornerValues
    pressureForComparisonKpa: MatCornerValues
    maximumPressureForComparisonKpa: number
    allowableBearingKpa: number
    utilization: number
    status: 'pass' | 'fail'
  }
  structural: { factored: MatPressureDistribution }
  settlement: MatSettlementAnalysis
  projections: { x: MatProjectionAnalysis; y: MatProjectionAnalysis }
  equilibrium: {
    integratedReactionKn: number
    integratedMomentXKnM: number
    integratedMomentYKnM: number
    verticalResidualKn: number
    momentXResidualKnM: number
    momentYResidualKnM: number
  }
  plate: { status: 'not-evaluated'; reason: string }
  punching: { status: 'not-evaluated'; reason: string }
  reinforcement: { status: 'not-evaluated'; reason: string }
}

export type MatFootingAnalysisOutcome =
  | { status: 'invalid-input'; issues: MatFootingValidationIssue[] }
  | { status: 'calculated'; analysis: MatFootingAnalysis }

const positiveFields: Array<Exclude<keyof MatFootingInputs, 'columns' | 'bearingCapacityBasis' | 'settlementPressureBasis'>> = [
  'allowableBearingKpa', 'concreteUnitWeightKnM3', 'footingWidthM', 'footingLengthM', 'footingThicknessM',
]
const nonNegativeFields: Array<Exclude<keyof MatFootingInputs, 'columns' | 'bearingCapacityBasis' | 'settlementPressureBasis'>> = [
  'removedOverburdenKpa', 'subgradeModulusKnM3', 'allowableTotalSettlementMm',
  'allowableDifferentialSettlementMm', 'soilCoverDepthM', 'soilUnitWeightKnM3',
]

const isPositiveFinite = (value: number) => Number.isFinite(value) && value > 0
const isNonNegativeFinite = (value: number) => Number.isFinite(value) && value >= 0

export function validateMatFootingInputs(inputs: MatFootingInputs): MatFootingValidationIssue[] {
  const issues: MatFootingValidationIssue[] = []
  for (const field of positiveFields) {
    if (!isPositiveFinite(inputs[field])) issues.push({ field, message: 'Este valor debe ser un número mayor que cero.' })
  }
  for (const field of nonNegativeFields) {
    if (!isNonNegativeFinite(inputs[field])) issues.push({ field, message: 'Este valor debe ser un número mayor o igual a cero.' })
  }
  if (inputs.bearingCapacityBasis !== 'gross' && inputs.bearingCapacityBasis !== 'net') {
    issues.push({ field: 'bearingCapacityBasis', message: 'Selecciona una base bruta o neta.' })
  }
  if (inputs.settlementPressureBasis !== 'gross' && inputs.settlementPressureBasis !== 'net') {
    issues.push({ field: 'settlementPressureBasis', message: 'Selecciona una base bruta o neta para asentamientos.' })
  }
  if (inputs.soilCoverDepthM > 0 && inputs.soilUnitWeightKnM3 <= 0) {
    issues.push({ field: 'soilUnitWeightKnM3', message: 'El relleno declarado requiere un peso unitario mayor que cero.' })
  }
  if (!Array.isArray(inputs.columns) || inputs.columns.length < 2 || inputs.columns.length > 24) {
    issues.push({ field: 'columns', message: 'La losa requiere entre 2 y 24 columnas.' })
    return issues
  }

  const normalizedIds = new Set<string>()
  for (const column of inputs.columns) {
    const id = column.id.trim()
    const columnId = id || 'sin ID'
    if (!id) issues.push({ field: 'columns', columnId, message: 'Cada columna requiere un ID.' })
    if (normalizedIds.has(id.toLowerCase())) issues.push({ field: 'columns', columnId, message: `El ID ${columnId} está repetido.` })
    normalizedIds.add(id.toLowerCase())
    const numericValues: Array<[keyof MatColumnInput, number]> = [
      ['serviceLoadKn', column.serviceLoadKn], ['factoredLoadKn', column.factoredLoadKn],
      ['widthM', column.widthM], ['lengthM', column.lengthM], ['centerXM', column.centerXM], ['centerYM', column.centerYM],
    ]
    for (const [field, value] of numericValues) {
      if (!isPositiveFinite(value)) issues.push({ field: 'columns', columnId, message: `${String(field)} debe ser mayor que cero.` })
    }
    if (isPositiveFinite(inputs.footingLengthM) && isPositiveFinite(column.lengthM)
      && (column.centerXM - column.lengthM / 2 < -1e-9 || column.centerXM + column.lengthM / 2 > inputs.footingLengthM + 1e-9)) {
      issues.push({ field: 'columns', columnId, message: `La columna ${columnId} queda fuera de la losa en X.` })
    }
    if (isPositiveFinite(inputs.footingWidthM) && isPositiveFinite(column.widthM)
      && (column.centerYM - column.widthM / 2 < -1e-9 || column.centerYM + column.widthM / 2 > inputs.footingWidthM + 1e-9)) {
      issues.push({ field: 'columns', columnId, message: `La columna ${columnId} queda fuera de la losa en Y.` })
    }
  }

  for (let first = 0; first < inputs.columns.length; first += 1) {
    for (let second = first + 1; second < inputs.columns.length; second += 1) {
      const a = inputs.columns[first]
      const b = inputs.columns[second]
      const overlapX = Math.abs(a.centerXM - b.centerXM) < (a.lengthM + b.lengthM) / 2 - 1e-9
      const overlapY = Math.abs(a.centerYM - b.centerYM) < (a.widthM + b.widthM) / 2 - 1e-9
      if (overlapX && overlapY) {
        issues.push({ field: 'columns', columnId: `${a.id}/${b.id}`, message: `Las columnas ${a.id} y ${b.id} se superponen.` })
      }
    }
  }
  return issues
}

const cornerMap = (values: MatCornerValues, transform: (value: number) => number): MatCornerValues => ({
  bottomLeft: transform(values.bottomLeft), bottomRight: transform(values.bottomRight),
  topLeft: transform(values.topLeft), topRight: transform(values.topRight),
})

const pressureDistribution = (
  inputs: MatFootingInputs,
  loadSelector: (column: MatColumnInput) => number,
  centeredAdditionalLoadKn: number,
): MatPressureDistribution => {
  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const columnLoadKn = inputs.columns.reduce((sum, column) => sum + loadSelector(column), 0)
  const totalLoadKn = columnLoadKn + centeredAdditionalLoadKn
  const momentYKnM = inputs.columns.reduce((sum, column) => sum + loadSelector(column) * (column.centerXM - inputs.footingLengthM / 2), 0)
  const momentXKnM = inputs.columns.reduce((sum, column) => sum + loadSelector(column) * (column.centerYM - inputs.footingWidthM / 2), 0)
  const eccentricityXM = momentYKnM / totalLoadKn
  const eccentricityYM = momentXKnM / totalLoadKn
  const normalizedEccentricityX = 6 * eccentricityXM / inputs.footingLengthM
  const normalizedEccentricityY = 6 * eccentricityYM / inputs.footingWidthM
  const kernInteraction = Math.abs(normalizedEccentricityX) + Math.abs(normalizedEccentricityY)
  const averagePressureKpa = totalLoadKn / areaM2
  const corner = (sx: -1 | 1, sy: -1 | 1) => averagePressureKpa * (1 + sx * normalizedEccentricityX + sy * normalizedEccentricityY)
  const cornerPressuresKpa: MatCornerValues = {
    bottomLeft: corner(-1, -1), bottomRight: corner(1, -1),
    topLeft: corner(-1, 1), topRight: corner(1, 1),
  }
  const cornerValues = Object.values(cornerPressuresKpa)
  return {
    totalLoadKn, momentXKnM, momentYKnM, eccentricityXM, eccentricityYM,
    normalizedEccentricityX, normalizedEccentricityY, kernInteraction, kernMargin: 1 - kernInteraction,
    averagePressureKpa, cornerPressuresKpa,
    minimumPressureKpa: Math.min(...cornerValues), maximumPressureKpa: Math.max(...cornerValues),
  }
}

const projectionAnalysis = (
  axis: 'x' | 'y', inputs: MatFootingInputs, distribution: MatPressureDistribution,
): MatProjectionAnalysis => {
  const isX = axis === 'x'
  const axisLengthM = isX ? inputs.footingLengthM : inputs.footingWidthM
  const perpendicularWidthM = isX ? inputs.footingWidthM : inputs.footingLengthM
  const normalizedEccentricity = isX ? distribution.normalizedEccentricityX : distribution.normalizedEccentricityY
  const pressureStartKpa = distribution.averagePressureKpa * (1 - normalizedEccentricity)
  const pressureEndKpa = distribution.averagePressureKpa * (1 + normalizedEccentricity)
  const intercept = perpendicularWidthM * pressureStartKpa
  const slope = perpendicularWidthM * (pressureEndKpa - pressureStartKpa) / axisLengthM
  const projectedColumns = inputs.columns.map((column) => ({
    id: column.id, label: column.label, coordinateM: isX ? column.centerXM : column.centerYM, loadKn: column.factoredLoadKn,
  })).sort((a, b) => a.coordinateM - b.coordinateM)
  const reactionTo = (coordinateM: number) => intercept * coordinateM + slope * coordinateM ** 2 / 2
  const reactionMomentTo = (coordinateM: number) => intercept * coordinateM ** 2 / 2 + slope * coordinateM ** 3 / 6
  const shearAt = (coordinateM: number) => reactionTo(coordinateM)
    - projectedColumns.reduce((sum, column) => sum + (column.coordinateM <= coordinateM + 1e-12 ? column.loadKn : 0), 0)
  const momentAt = (coordinateM: number) => reactionMomentTo(coordinateM)
    - projectedColumns.reduce((sum, column) => sum + column.loadKn * Math.max(coordinateM - column.coordinateM, 0), 0)
  const diagram = Array.from({ length: 81 }, (_, index) => {
    const coordinateM = axisLengthM * index / 80
    const pressureKpa = pressureStartKpa + (pressureEndKpa - pressureStartKpa) * coordinateM / axisLengthM
    return { coordinateM, pressureKpa, reactionKnM: perpendicularWidthM * pressureKpa, shearKn: shearAt(coordinateM), momentKnM: momentAt(coordinateM) }
  })
  return {
    axis, axisLengthM, perpendicularWidthM, pressureStartKpa, pressureEndKpa,
    distributedReactionKnM: { intercept, slope }, projectedColumns,
    endShearKn: shearAt(axisLengthM), endMomentKnM: momentAt(axisLengthM),
    maximumShearKn: Math.max(...diagram.map(({ shearKn }) => Math.abs(shearKn))),
    maximumPositiveMomentKnM: Math.max(...diagram.map(({ momentKnM }) => momentKnM)),
    minimumNegativeMomentKnM: Math.min(...diagram.map(({ momentKnM }) => momentKnM)), diagram,
  }
}

/** Evalúa una losa rectangular rígida multicolumna con contacto completo y pantalla Winkler declarada. */
export function analyzeMatFooting(inputs: MatFootingInputs): MatFootingAnalysisOutcome {
  const issues = validateMatFootingInputs(inputs)
  if (issues.length) return { status: 'invalid-input', issues }

  const areaM2 = inputs.footingWidthM * inputs.footingLengthM
  const serviceColumnTotalKn = inputs.columns.reduce((sum, column) => sum + column.serviceLoadKn, 0)
  const factoredColumnTotalKn = inputs.columns.reduce((sum, column) => sum + column.factoredLoadKn, 0)
  const footingSelfWeightKn = areaM2 * inputs.footingThicknessM * inputs.concreteUnitWeightKnM3
  const soilCoverWeightKn = areaM2 * inputs.soilCoverDepthM * inputs.soilUnitWeightKnM3
  const gross = pressureDistribution(inputs, (column) => column.serviceLoadKn, footingSelfWeightKn + soilCoverWeightKn)
  if (gross.minimumPressureKpa < -1e-9 || gross.kernMargin < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'columns', message: 'La resultante de servicio queda fuera del núcleo central biaxial. El contacto parcial está fuera de alcance.' }] }
  }
  const factored = pressureDistribution(inputs, (column) => column.factoredLoadKn, 0)
  if (factored.minimumPressureKpa < -1e-9 || factored.kernMargin < -1e-9) {
    return { status: 'invalid-input', issues: [{ field: 'columns', message: 'La resultante última queda fuera del núcleo central biaxial. El levantamiento o contacto parcial está fuera de alcance.' }] }
  }

  const netCornerPressuresKpa = cornerMap(gross.cornerPressuresKpa, (value) => value - inputs.removedOverburdenKpa)
  const pressureForComparisonKpa = inputs.bearingCapacityBasis === 'gross' ? gross.cornerPressuresKpa : netCornerPressuresKpa
  const maximumPressureForComparisonKpa = Math.max(...Object.values(pressureForComparisonKpa))
  if (maximumPressureForComparisonKpa <= 0) {
    return { status: 'invalid-input', issues: [{ field: 'removedOverburdenKpa', message: 'La presión máxima seleccionada para comparación debe ser mayor que cero.' }] }
  }

  const settlementPressure = inputs.settlementPressureBasis === 'gross' ? gross.cornerPressuresKpa : netCornerPressuresKpa
  const settlement: MatSettlementAnalysis = inputs.subgradeModulusKnM3 <= 0
    ? { status: 'not-evaluated', reason: 'No se declaró un módulo de balasto k mayor que cero.' }
    : Math.min(...Object.values(settlementPressure)) < 0
      ? { status: 'not-evaluated', reason: 'La base de presión seleccionada produce valores negativos; la pantalla Winkler rígida no se aplica.' }
      : (() => {
        const cornerSettlementsMm = cornerMap(settlementPressure, (value) => value / inputs.subgradeModulusKnM3 * 1000)
        const settlements = Object.values(cornerSettlementsMm)
        const minimumSettlementMm = Math.min(...settlements)
        const maximumSettlementMm = Math.max(...settlements)
        const differentialSettlementMm = maximumSettlementMm - minimumSettlementMm
        const allowableTotalSettlementMm = inputs.allowableTotalSettlementMm > 0 ? inputs.allowableTotalSettlementMm : null
        const allowableDifferentialSettlementMm = inputs.allowableDifferentialSettlementMm > 0 ? inputs.allowableDifferentialSettlementMm : null
        return {
          status: 'calculated' as const, pressureBasis: inputs.settlementPressureBasis,
          subgradeModulusKnM3: inputs.subgradeModulusKnM3, cornerSettlementsMm,
          minimumSettlementMm, maximumSettlementMm, differentialSettlementMm,
          allowableTotalSettlementMm, allowableDifferentialSettlementMm,
          totalStatus: allowableTotalSettlementMm === null ? 'not-provided' as const : maximumSettlementMm <= allowableTotalSettlementMm ? 'pass' as const : 'fail' as const,
          differentialStatus: allowableDifferentialSettlementMm === null ? 'not-provided' as const : differentialSettlementMm <= allowableDifferentialSettlementMm ? 'pass' as const : 'fail' as const,
        }
      })()

  const integratedReactionKn = factored.averagePressureKpa * areaM2
  const integratedMomentYKnM = integratedReactionKn * factored.eccentricityXM
  const integratedMomentXKnM = integratedReactionKn * factored.eccentricityYM
  return { status: 'calculated', analysis: {
    geometry: { areaM2, centroidXM: inputs.footingLengthM / 2, centroidYM: inputs.footingWidthM / 2, columnCount: inputs.columns.length },
    loads: { serviceColumnTotalKn, factoredColumnTotalKn },
    contact: {
      footingSelfWeightKn, soilCoverWeightKn, gross, netCornerPressuresKpa, pressureForComparisonKpa,
      maximumPressureForComparisonKpa, allowableBearingKpa: inputs.allowableBearingKpa,
      utilization: maximumPressureForComparisonKpa / inputs.allowableBearingKpa,
      status: maximumPressureForComparisonKpa <= inputs.allowableBearingKpa ? 'pass' : 'fail',
    },
    structural: { factored }, settlement,
    projections: { x: projectionAnalysis('x', inputs, factored), y: projectionAnalysis('y', inputs, factored) },
    equilibrium: {
      integratedReactionKn, integratedMomentXKnM, integratedMomentYKnM,
      verticalResidualKn: integratedReactionKn - factored.totalLoadKn,
      momentXResidualKnM: integratedMomentXKnM - factored.momentXKnM,
      momentYResidualKnM: integratedMomentYKnM - factored.momentYKnM,
    },
    plate: { status: 'not-evaluated', reason: 'Las proyecciones globales cierran equilibrio, pero no representan la rigidez ni el diseño por franjas de una placa bidireccional.' },
    punching: { status: 'not-evaluated', reason: 'Cada columna requiere geometría de perímetro crítico, transferencia de momento y una referencia estructural específica no incorporada en este alcance.' },
    reinforcement: { status: 'not-evaluated', reason: 'No se dimensiona armado sin un análisis estructural de placa compatible con la rigidez de la losa y el suelo.' },
  } }
}
