export type ReinforcementLayoutInputs = {
  footingWidthM: number
  footingLengthM: number
  concreteCoverM: number
  barDiameterM: number
  barsParallelToWidthMaxSpacingM: number
  barsParallelToLengthMaxSpacingM: number
}

export type ReinforcementDirectionLayout = {
  count: number
  actualSpacingM: number
  clearDistributionLengthM: number
}

export type ReinforcementLayoutResult = {
  barsParallelToWidth: ReinforcementDirectionLayout
  barsParallelToLength: ReinforcementDirectionLayout
  status: 'layout-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

function distribute(distributionLengthM: number, maxSpacingM: number): ReinforcementDirectionLayout {
  if (distributionLengthM <= 0) throw new RangeError('No queda longitud útil para distribuir el refuerzo.')
  const count = Math.max(2, Math.ceil(distributionLengthM / maxSpacingM) + 1)
  return { count, actualSpacingM: distributionLengthM / (count - 1), clearDistributionLengthM: distributionLengthM }
}

/** Dibujo y cuantificación geométrica de barras declaradas; no diseña ni verifica acero. */
export function calculateReinforcementLayout(inputs: ReinforcementLayoutInputs): ReinforcementLayoutResult {
  const { footingWidthM, footingLengthM, concreteCoverM, barDiameterM, barsParallelToWidthMaxSpacingM, barsParallelToLengthMaxSpacingM } = inputs
  if (![footingWidthM, footingLengthM, barDiameterM, barsParallelToWidthMaxSpacingM, barsParallelToLengthMaxSpacingM].every(positive) || !Number.isFinite(concreteCoverM) || concreteCoverM < 0) {
    throw new RangeError('Las entradas del plano de refuerzo no son válidas.')
  }
  const edgeDistanceM = concreteCoverM + barDiameterM / 2
  return {
    barsParallelToWidth: distribute(footingLengthM - 2 * edgeDistanceM, barsParallelToWidthMaxSpacingM),
    barsParallelToLength: distribute(footingWidthM - 2 * edgeDistanceM, barsParallelToLengthMaxSpacingM),
    status: 'layout-only',
  }
}
