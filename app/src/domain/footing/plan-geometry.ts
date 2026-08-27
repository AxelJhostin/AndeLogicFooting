export type FootingPlanDimensions = {
  footingWidthM: number
  footingLengthM: number
  columnWidthM: number
  columnLengthM: number
}

export type FootingPlanGeometry = {
  footingWidth: number
  footingLength: number
  columnWidth: number
  columnLength: number
}

/** Escala de dibujo uniforme: conserva las proporciones reales en la vista en planta. */
export function getFootingPlanGeometry(dimensions: FootingPlanDimensions): FootingPlanGeometry {
  const values = Object.values(dimensions)
  if (values.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new RangeError('Las dimensiones de zapata y columna deben ser mayores que cero.')
  }

  const scale = 210 / Math.max(dimensions.footingWidthM, dimensions.footingLengthM)

  return {
    footingWidth: dimensions.footingWidthM * scale,
    footingLength: dimensions.footingLengthM * scale,
    columnWidth: dimensions.columnWidthM * scale,
    columnLength: dimensions.columnLengthM * scale,
  }
}
