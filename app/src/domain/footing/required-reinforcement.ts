export type GuideRequiredReinforcementInputs = {
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  effectiveDepthM: number
  widthMomentDemandKnM: number
  widthStripWidthM: number
  lengthMomentDemandKnM: number
  lengthStripWidthM: number
}

export type GuideReinforcementDirectionResult = {
  stripWidthM: number
  momentDemandKnM: number
  requiredAreaMm2: number | null
  requiredAreaPerMeterMm2: number | null
  requiredAreaPerMeterCm2: number | null
  status: 'calculated' | 'section-insufficient'
}

export type GuideRequiredReinforcementResult = {
  effectiveDepthM: number
  concreteStrengthMpa: number
  steelYieldStrengthMpa: number
  strengthReductionFactor: 0.9
  widthDirection: GuideReinforcementDirectionResult
  lengthDirection: GuideReinforcementDirectionResult
  status: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0
const strengthReductionFactor = 0.9

/**
 * Aplica la expresión de acero requerido mostrada en la guía práctica NEC 2015,
 * sección 1.10.5, como referencia de cálculo para una sección rectangular.
 * No representa por sí sola un diseño NEC completo ni una comprobación de ductilidad.
 */
export function calculateGuideRequiredReinforcement(
  inputs: GuideRequiredReinforcementInputs,
): GuideRequiredReinforcementResult {
  const {
    concreteStrengthMpa,
    steelYieldStrengthMpa,
    effectiveDepthM,
    widthMomentDemandKnM,
    widthStripWidthM,
    lengthMomentDemandKnM,
    lengthStripWidthM,
  } = inputs

  if (![concreteStrengthMpa, steelYieldStrengthMpa, effectiveDepthM, widthMomentDemandKnM, widthStripWidthM, lengthMomentDemandKnM, lengthStripWidthM].every(positive)) {
    throw new RangeError('Las entradas para calcular el acero requerido no son físicamente válidas.')
  }

  const effectiveDepthMm = effectiveDepthM * 1000
  const calculateDirection = (momentDemandKnM: number, stripWidthM: number): GuideReinforcementDirectionResult => {
    const stripWidthMm = stripWidthM * 1000
    const momentDemandNmm = momentDemandKnM * 1_000_000
    const denominator = 0.85 * strengthReductionFactor * concreteStrengthMpa * stripWidthMm * effectiveDepthMm ** 2
    const radicand = 1 - (2 * momentDemandNmm) / denominator

    if (radicand < 0) {
      return {
        stripWidthM,
        momentDemandKnM,
        requiredAreaMm2: null,
        requiredAreaPerMeterMm2: null,
        requiredAreaPerMeterCm2: null,
        status: 'section-insufficient',
      }
    }

    const requiredAreaMm2 = (0.85 * concreteStrengthMpa * stripWidthMm * effectiveDepthMm / steelYieldStrengthMpa)
      * (1 - Math.sqrt(radicand))
    const requiredAreaPerMeterMm2 = requiredAreaMm2 / stripWidthM

    return {
      stripWidthM,
      momentDemandKnM,
      requiredAreaMm2,
      requiredAreaPerMeterMm2,
      requiredAreaPerMeterCm2: requiredAreaPerMeterMm2 / 100,
      status: 'calculated',
    }
  }

  return {
    effectiveDepthM,
    concreteStrengthMpa,
    steelYieldStrengthMpa,
    strengthReductionFactor,
    widthDirection: calculateDirection(widthMomentDemandKnM, widthStripWidthM),
    lengthDirection: calculateDirection(lengthMomentDemandKnM, lengthStripWidthM),
    status: 'guide-reference-only',
  }
}
