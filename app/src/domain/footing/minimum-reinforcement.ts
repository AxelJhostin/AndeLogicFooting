export type MinimumReinforcementInputs = {
  footingThicknessM: number
  barDiameterM: number
  barsParallelToWidthSpacingM: number
  barsParallelToLengthSpacingM: number
}

type DirectionResult = {
  providedAreaPerMeterMm2: number
  status: 'meets-guide-minimum' | 'below-guide-minimum'
}

export type MinimumReinforcementResult = {
  /** Área geométrica de la barra usada por la referencia visual y la memoria. */
  barAreaMm2: number
  minimumAreaPerMeterMm2: number
  minimumAreaPerMeterCm2: number
  barsParallelToWidth: DirectionResult
  barsParallelToLength: DirectionResult
  status: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

/**
 * Compara acero declarado con el mínimo por metro mostrado en la guía práctica NEC 2015,
 * sección 1.10.5. Es una referencia pública de guía, no una verificación NEC completa.
 */
export function calculateGuideMinimumReinforcement(inputs: MinimumReinforcementInputs): MinimumReinforcementResult {
  const { footingThicknessM, barDiameterM, barsParallelToWidthSpacingM, barsParallelToLengthSpacingM } = inputs
  if (![footingThicknessM, barDiameterM, barsParallelToWidthSpacingM, barsParallelToLengthSpacingM].every(positive)) {
    throw new RangeError('Las entradas para revisar el acero mínimo no son válidas.')
  }

  const thicknessMm = footingThicknessM * 1000
  const barDiameterMm = barDiameterM * 1000
  const barAreaMm2 = Math.PI * barDiameterMm ** 2 / 4
  const minimumAreaPerMeterMm2 = 0.0018 * 1000 * thicknessMm
  const direction = (spacingM: number): DirectionResult => {
    const providedAreaPerMeterMm2 = barAreaMm2 * 1000 / (spacingM * 1000)
    return {
      providedAreaPerMeterMm2,
      status: providedAreaPerMeterMm2 >= minimumAreaPerMeterMm2 ? 'meets-guide-minimum' : 'below-guide-minimum',
    }
  }

  return {
    barAreaMm2,
    minimumAreaPerMeterMm2,
    minimumAreaPerMeterCm2: minimumAreaPerMeterMm2 / 100,
    barsParallelToWidth: direction(barsParallelToWidthSpacingM),
    barsParallelToLength: direction(barsParallelToLengthSpacingM),
    status: 'guide-reference-only',
  }
}
