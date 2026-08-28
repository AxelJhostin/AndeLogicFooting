export type GuideDevelopmentLengthInputs = {
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  barDiameterM: number
  availableLengthWidthM: number
  availableLengthLengthM: number
}

type DirectionResult = {
  availableLengthM: number
  status: 'meets-guide-reference' | 'below-guide-reference'
}

export type GuideDevelopmentLengthResult = {
  requiredDevelopmentLengthM: number
  barDiameterM: number
  topBarFactor: 1
  coatingFactor: 1
  normalWeightConcreteFactor: 1
  widthDirection: DirectionResult
  lengthDirection: DirectionResult
  status: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

/**
 * Aplica el ejemplo de desarrollo a tracción de la guía práctica NEC 2015, sección 1.10.6.
 * Solo representa barra sin recubrimiento especial, otros casos y hormigón de peso normal.
 */
export function checkGuideDevelopmentLength(inputs: GuideDevelopmentLengthInputs): GuideDevelopmentLengthResult {
  const { concreteStrengthMpa, steelYieldStrengthMpa, barDiameterM, availableLengthWidthM, availableLengthLengthM } = inputs
  if (![concreteStrengthMpa, steelYieldStrengthMpa, barDiameterM, availableLengthWidthM, availableLengthLengthM].every(positive)) {
    throw new RangeError('Las entradas para revisar la longitud de desarrollo no son válidas.')
  }

  const requiredDevelopmentLengthM = steelYieldStrengthMpa / (1.4 * Math.sqrt(concreteStrengthMpa)) * barDiameterM
  const direction = (availableLengthM: number): DirectionResult => ({
    availableLengthM,
    status: availableLengthM >= requiredDevelopmentLengthM ? 'meets-guide-reference' : 'below-guide-reference',
  })

  return {
    requiredDevelopmentLengthM,
    barDiameterM,
    topBarFactor: 1,
    coatingFactor: 1,
    normalWeightConcreteFactor: 1,
    widthDirection: direction(availableLengthWidthM),
    lengthDirection: direction(availableLengthLengthM),
    status: 'guide-reference-only',
  }
}
