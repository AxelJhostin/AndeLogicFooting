export type FlexureDemandInputs = {
  factoredAxialLoadKn: number
  footingWidthM: number
  footingLengthM: number
  columnWidthM: number
  columnLengthM: number
}

export type FlexureDirectionResult = {
  direction: 'width' | 'length'
  cantileverProjectionM: number
  stripWidthM: number
  momentDemandKnM: number
}

export type FlexureDemandResult = {
  footingAreaM2: number
  factoredContactPressureKpa: number
  widthDirection: FlexureDirectionResult
  lengthDirection: FlexureDirectionResult
  governingDirection: 'width' | 'length' | 'equal'
  governingMomentDemandKnM: number
  status: 'demand-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

/**
 * Demanda de flexión por equilibrio en la cara de columna para presión última uniforme.
 * Modela cada proyección como voladizo. No dimensiona acero ni determina resistencia.
 */
export function calculateFlexureDemand(inputs: FlexureDemandInputs): FlexureDemandResult {
  const { factoredAxialLoadKn, footingWidthM, footingLengthM, columnWidthM, columnLengthM } = inputs

  if (
    !positive(factoredAxialLoadKn) ||
    !positive(footingWidthM) ||
    !positive(footingLengthM) ||
    !positive(columnWidthM) ||
    !positive(columnLengthM) ||
    footingWidthM <= columnWidthM ||
    footingLengthM <= columnLengthM
  ) {
    throw new RangeError('Las entradas para la demanda de flexión no son físicamente válidas.')
  }

  const footingAreaM2 = footingWidthM * footingLengthM
  const factoredContactPressureKpa = factoredAxialLoadKn / footingAreaM2
  const widthProjectionM = (footingWidthM - columnWidthM) / 2
  const lengthProjectionM = (footingLengthM - columnLengthM) / 2
  const widthDirection = {
    direction: 'width' as const,
    cantileverProjectionM: widthProjectionM,
    stripWidthM: footingLengthM,
    momentDemandKnM: factoredContactPressureKpa * footingLengthM * widthProjectionM ** 2 / 2,
  }
  const lengthDirection = {
    direction: 'length' as const,
    cantileverProjectionM: lengthProjectionM,
    stripWidthM: footingWidthM,
    momentDemandKnM: factoredContactPressureKpa * footingWidthM * lengthProjectionM ** 2 / 2,
  }
  const governingDirection = widthDirection.momentDemandKnM > lengthDirection.momentDemandKnM
    ? 'width'
    : lengthDirection.momentDemandKnM > widthDirection.momentDemandKnM
      ? 'length'
      : 'equal'

  return {
    footingAreaM2,
    factoredContactPressureKpa,
    widthDirection,
    lengthDirection,
    governingDirection,
    governingMomentDemandKnM: Math.max(widthDirection.momentDemandKnM, lengthDirection.momentDemandKnM),
    status: 'demand-only',
  }
}
