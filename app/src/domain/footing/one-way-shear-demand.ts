export type OneWayShearDemandInputs = {
  factoredAxialLoadKn: number
  footingWidthM: number
  footingLengthM: number
  columnWidthM: number
  columnLengthM: number
  footingThicknessM: number
  concreteCoverM: number
  barDiameterM: number
}

export type OneWayShearDirectionResult = {
  direction: 'width' | 'length'
  cantileverProjectionM: number
  sectionOffsetFromColumnFaceM: number
  loadedLengthBeyondSectionM: number
  tributaryWidthM: number
  tributaryAreaM2: number
  shearDemandKn: number
  sectionWithinCantilever: boolean
}

export type OneWayShearDemandResult = {
  footingAreaM2: number
  factoredAxialLoadKn: number
  factoredContactPressureKpa: number
  effectiveDepthM: number
  widthDirection: OneWayShearDirectionResult
  lengthDirection: OneWayShearDirectionResult
  governingDirection: 'width' | 'length' | 'equal'
  governingShearDemandKn: number
  status: 'demand-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0

function directionDemand(
  direction: OneWayShearDirectionResult['direction'],
  projectionM: number,
  effectiveDepthM: number,
  tributaryWidthM: number,
  pressureKpa: number,
): OneWayShearDirectionResult {
  const loadedLengthBeyondSectionM = Math.max(projectionM - effectiveDepthM, 0)
  const tributaryAreaM2 = loadedLengthBeyondSectionM * tributaryWidthM

  return {
    direction,
    cantileverProjectionM: projectionM,
    sectionOffsetFromColumnFaceM: effectiveDepthM,
    loadedLengthBeyondSectionM,
    tributaryWidthM,
    tributaryAreaM2,
    shearDemandKn: pressureKpa * tributaryAreaM2,
    sectionWithinCantilever: loadedLengthBeyondSectionM > 0,
  }
}

/**
 * Calcula únicamente la acción de cortante por equilibrio con presión última uniforme.
 * La sección se evalúa a una profundidad efectiva desde la cara de la columna como
 * hipótesis visible pendiente de vincular al perfil normativo. No calcula resistencia.
 */
export function calculateOneWayShearDemand(inputs: OneWayShearDemandInputs): OneWayShearDemandResult {
  const {
    factoredAxialLoadKn,
    footingWidthM,
    footingLengthM,
    columnWidthM,
    columnLengthM,
    footingThicknessM,
    concreteCoverM,
    barDiameterM,
  } = inputs

  if (
    !positive(factoredAxialLoadKn) ||
    !positive(footingWidthM) ||
    !positive(footingLengthM) ||
    !positive(columnWidthM) ||
    !positive(columnLengthM) ||
    !positive(footingThicknessM) ||
    !nonNegative(concreteCoverM) ||
    !positive(barDiameterM) ||
    footingWidthM <= columnWidthM ||
    footingLengthM <= columnLengthM
  ) {
    throw new RangeError('Las entradas para la demanda de cortante no son físicamente válidas.')
  }

  const effectiveDepthM = footingThicknessM - concreteCoverM - barDiameterM / 2
  if (effectiveDepthM <= 0) {
    throw new RangeError('El espesor, recubrimiento y diámetro no producen una profundidad efectiva positiva.')
  }

  const footingAreaM2 = footingWidthM * footingLengthM
  const factoredContactPressureKpa = factoredAxialLoadKn / footingAreaM2
  const widthDirection = directionDemand(
    'width',
    (footingWidthM - columnWidthM) / 2,
    effectiveDepthM,
    footingLengthM,
    factoredContactPressureKpa,
  )
  const lengthDirection = directionDemand(
    'length',
    (footingLengthM - columnLengthM) / 2,
    effectiveDepthM,
    footingWidthM,
    factoredContactPressureKpa,
  )
  const governingDirection = widthDirection.shearDemandKn > lengthDirection.shearDemandKn
    ? 'width'
    : lengthDirection.shearDemandKn > widthDirection.shearDemandKn
      ? 'length'
      : 'equal'

  return {
    footingAreaM2,
    factoredAxialLoadKn,
    factoredContactPressureKpa,
    effectiveDepthM,
    widthDirection,
    lengthDirection,
    governingDirection,
    governingShearDemandKn: Math.max(widthDirection.shearDemandKn, lengthDirection.shearDemandKn),
    status: 'demand-only',
  }
}
