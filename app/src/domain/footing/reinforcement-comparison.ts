export type GuideReinforcementComparisonInputs = {
  minimumAreaPerMeterMm2: number
  widthProvidedAreaPerMeterMm2: number
  lengthProvidedAreaPerMeterMm2: number
  widthRequiredAreaPerMeterMm2: number | null
  lengthRequiredAreaPerMeterMm2: number | null
}

export type GuideReinforcementComparisonDirection = {
  providedAreaPerMeterMm2: number
  requiredReferenceAreaPerMeterMm2: number | null
  requiredReferenceAreaPerMeterCm2: number | null
  status: 'meets-guide-reference' | 'below-guide-reference' | 'section-insufficient'
}

export type GuideReinforcementComparisonResult = {
  minimumAreaPerMeterMm2: number
  widthDirection: GuideReinforcementComparisonDirection
  lengthDirection: GuideReinforcementComparisonDirection
  status: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0

/**
 * Integra los resultados de acero mínimo, acero requerido y acero declarado.
 * Es una comparación de referencias de guía; no añade una regla normativa nueva.
 */
export function compareGuideReinforcement(
  inputs: GuideReinforcementComparisonInputs,
): GuideReinforcementComparisonResult {
  const {
    minimumAreaPerMeterMm2,
    widthProvidedAreaPerMeterMm2,
    lengthProvidedAreaPerMeterMm2,
    widthRequiredAreaPerMeterMm2,
    lengthRequiredAreaPerMeterMm2,
  } = inputs

  if (![minimumAreaPerMeterMm2, widthProvidedAreaPerMeterMm2, lengthProvidedAreaPerMeterMm2].every(positive)) {
    throw new RangeError('Las áreas de acero para la comparación no son válidas.')
  }

  const compare = (providedAreaPerMeterMm2: number, requiredAreaPerMeterMm2: number | null): GuideReinforcementComparisonDirection => {
    if (requiredAreaPerMeterMm2 === null) {
      return {
        providedAreaPerMeterMm2,
        requiredReferenceAreaPerMeterMm2: null,
        requiredReferenceAreaPerMeterCm2: null,
        status: 'section-insufficient',
      }
    }
    if (!positive(requiredAreaPerMeterMm2)) {
      throw new RangeError('El acero requerido para la comparación no es válido.')
    }

    const requiredReferenceAreaPerMeterMm2 = Math.max(minimumAreaPerMeterMm2, requiredAreaPerMeterMm2)
    return {
      providedAreaPerMeterMm2,
      requiredReferenceAreaPerMeterMm2,
      requiredReferenceAreaPerMeterCm2: requiredReferenceAreaPerMeterMm2 / 100,
      status: providedAreaPerMeterMm2 >= requiredReferenceAreaPerMeterMm2 ? 'meets-guide-reference' : 'below-guide-reference',
    }
  }

  return {
    minimumAreaPerMeterMm2,
    widthDirection: compare(widthProvidedAreaPerMeterMm2, widthRequiredAreaPerMeterMm2),
    lengthDirection: compare(lengthProvidedAreaPerMeterMm2, lengthRequiredAreaPerMeterMm2),
    status: 'guide-reference-only',
  }
}
