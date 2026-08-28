export type GuidePunchingShearInputs = {
  concreteStrengthMpa: number
  factoredAxialLoadKn: number
  footingWidthM: number
  footingLengthM: number
  columnWidthM: number
  columnLengthM: number
  effectiveDepthM: number
}

export type GuidePunchingShearResult = {
  columnShape: 'square' | 'rectangular'
  factoredContactPressureKpa: number
  criticalSectionOffsetM: number
  criticalPerimeterM: number
  exteriorTributaryAreaM2: number
  shearDemandKn: number
  governingConcreteShearStressMpa: number
  governingAlternative: 'square-only' | 'alternative-1' | 'alternative-2' | 'alternative-3'
  designShearStrengthKn: number
  utilization: number
  status: 'meets-guide-reference' | 'below-guide-reference'
  referenceStatus: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0
const strengthReductionFactor = 0.75
const interiorColumnCoefficient = 0.4
const squareTolerance = 1e-9

/**
 * Aplica el procedimiento de punzonamiento mostrado en la guía práctica NEC 2015,
 * secciones 1.10.2-1.10.4, solo para columna interior centrada y hormigón normal.
 * La presión se mantiene uniforme por el alcance actual de AndeLogic.
 */
export function checkGuidePunchingShear(inputs: GuidePunchingShearInputs): GuidePunchingShearResult {
  const {
    concreteStrengthMpa,
    factoredAxialLoadKn,
    footingWidthM,
    footingLengthM,
    columnWidthM,
    columnLengthM,
    effectiveDepthM,
  } = inputs
  if (![concreteStrengthMpa, factoredAxialLoadKn, footingWidthM, footingLengthM, columnWidthM, columnLengthM, effectiveDepthM].every(positive)) {
    throw new RangeError('Las entradas para revisar el punzonamiento no son válidas.')
  }

  const criticalSectionOffsetM = effectiveDepthM / 2
  const criticalWidthM = columnWidthM + effectiveDepthM
  const criticalLengthM = columnLengthM + effectiveDepthM
  if (criticalWidthM >= footingWidthM || criticalLengthM >= footingLengthM) {
    throw new RangeError('El perímetro crítico de punzonamiento debe quedar completamente dentro de la zapata.')
  }

  const footingAreaM2 = footingWidthM * footingLengthM
  const factoredContactPressureKpa = factoredAxialLoadKn / footingAreaM2
  const criticalAreaM2 = criticalWidthM * criticalLengthM
  const exteriorTributaryAreaM2 = footingAreaM2 - criticalAreaM2
  const shearDemandKn = factoredContactPressureKpa * exteriorTributaryAreaM2
  const criticalPerimeterM = 2 * (criticalWidthM + criticalLengthM)
  const rootConcreteStrength = Math.sqrt(concreteStrengthMpa)
  const isSquare = Math.abs(columnWidthM - columnLengthM) < squareTolerance
  const alternative1 = 0.33 * rootConcreteStrength
  const alternatives: Array<{ label: 'alternative-1' | 'alternative-2' | 'alternative-3'; value: number }> = [
    { label: 'alternative-1', value: alternative1 },
  ]

  if (!isSquare) {
    const beta = Math.max(columnWidthM, columnLengthM) / Math.min(columnWidthM, columnLengthM)
    alternatives.push(
      { label: 'alternative-2' as const, value: 0.17 * (1 + 2 / beta) * rootConcreteStrength },
      { label: 'alternative-3' as const, value: 0.083 * (2 + interiorColumnCoefficient * effectiveDepthM / criticalPerimeterM) * rootConcreteStrength },
    )
  }

  const governing = alternatives.reduce((lowest, candidate) => candidate.value < lowest.value ? candidate : lowest)
  const designShearStrengthKn = strengthReductionFactor * governing.value * criticalPerimeterM * effectiveDepthM * 1000
  const utilization = shearDemandKn / designShearStrengthKn

  return {
    columnShape: isSquare ? 'square' : 'rectangular',
    factoredContactPressureKpa,
    criticalSectionOffsetM,
    criticalPerimeterM,
    exteriorTributaryAreaM2,
    shearDemandKn,
    governingConcreteShearStressMpa: governing.value,
    governingAlternative: isSquare ? 'square-only' : governing.label,
    designShearStrengthKn,
    utilization,
    status: utilization <= 1 ? 'meets-guide-reference' : 'below-guide-reference',
    referenceStatus: 'guide-reference-only',
  }
}
