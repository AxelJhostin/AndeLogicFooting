export type PunchingShearDemandInputs = {
  factoredAxialLoadKn: number
  footingWidthM: number
  footingLengthM: number
  columnWidthM: number
  columnLengthM: number
  criticalSectionOffsetM: number
}

export type PunchingShearDemandResult = {
  footingAreaM2: number
  factoredAxialLoadKn: number
  factoredContactPressureKpa: number
  criticalSectionOffsetM: number
  criticalSectionWidthM: number
  criticalSectionLengthM: number
  criticalPerimeterM: number
  criticalSectionAreaM2: number
  exteriorTributaryAreaM2: number
  shearDemandKn: number
  status: 'demand-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

/**
 * Acción de punzonamiento por equilibrio para presión última uniforme.
 * El usuario declara la distancia de la sección crítica desde la cara de columna.
 * No determina resistencia, factores ni cumplimiento de una norma.
 */
export function calculatePunchingShearDemand(inputs: PunchingShearDemandInputs): PunchingShearDemandResult {
  const {
    factoredAxialLoadKn,
    footingWidthM,
    footingLengthM,
    columnWidthM,
    columnLengthM,
    criticalSectionOffsetM,
  } = inputs

  if (
    !positive(factoredAxialLoadKn) ||
    !positive(footingWidthM) ||
    !positive(footingLengthM) ||
    !positive(columnWidthM) ||
    !positive(columnLengthM) ||
    !positive(criticalSectionOffsetM) ||
    footingWidthM <= columnWidthM ||
    footingLengthM <= columnLengthM
  ) {
    throw new RangeError('Las entradas para la demanda de punzonamiento no son físicamente válidas.')
  }

  const criticalSectionWidthM = columnWidthM + 2 * criticalSectionOffsetM
  const criticalSectionLengthM = columnLengthM + 2 * criticalSectionOffsetM
  if (criticalSectionWidthM >= footingWidthM || criticalSectionLengthM >= footingLengthM) {
    throw new RangeError('El perímetro crítico de punzonamiento no cabe dentro de la zapata.')
  }

  const footingAreaM2 = footingWidthM * footingLengthM
  const criticalSectionAreaM2 = criticalSectionWidthM * criticalSectionLengthM
  const exteriorTributaryAreaM2 = footingAreaM2 - criticalSectionAreaM2
  const factoredContactPressureKpa = factoredAxialLoadKn / footingAreaM2

  return {
    footingAreaM2,
    factoredAxialLoadKn,
    factoredContactPressureKpa,
    criticalSectionOffsetM,
    criticalSectionWidthM,
    criticalSectionLengthM,
    criticalPerimeterM: 2 * (criticalSectionWidthM + criticalSectionLengthM),
    criticalSectionAreaM2,
    exteriorTributaryAreaM2,
    shearDemandKn: factoredContactPressureKpa * exteriorTributaryAreaM2,
    status: 'demand-only',
  }
}
