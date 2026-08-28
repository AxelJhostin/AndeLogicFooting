export type GuideOneWayShearCheckInputs = {
  concreteStrengthMpa: number
  effectiveDepthM: number
  widthShearDemandKn: number
  widthSectionWidthM: number
  lengthShearDemandKn: number
  lengthSectionWidthM: number
}

export type GuideOneWayShearDirectionResult = {
  shearDemandKn: number
  sectionWidthM: number
  designShearStrengthKn: number
  utilization: number
  status: 'meets-guide-reference' | 'below-guide-reference'
}

export type GuideOneWayShearCheckResult = {
  concreteStrengthMpa: number
  effectiveDepthM: number
  concreteShearStressMpa: number
  strengthReductionFactor: 0.75
  widthDirection: GuideOneWayShearDirectionResult
  lengthDirection: GuideOneWayShearDirectionResult
  status: 'guide-reference-only'
}

const positive = (value: number) => Number.isFinite(value) && value > 0
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0
const strengthReductionFactor = 0.75

/**
 * Aplica la resistencia de cortante unidireccional que muestra la guía práctica NEC 2015,
 * sección 1.10.1, para hormigón de peso normal. Es una referencia de guía, no un perfil NEC liberado.
 */
export function checkGuideOneWayShear(inputs: GuideOneWayShearCheckInputs): GuideOneWayShearCheckResult {
  const {
    concreteStrengthMpa,
    effectiveDepthM,
    widthShearDemandKn,
    widthSectionWidthM,
    lengthShearDemandKn,
    lengthSectionWidthM,
  } = inputs
  if (
    !positive(concreteStrengthMpa)
    || !positive(effectiveDepthM)
    || !nonNegative(widthShearDemandKn)
    || !positive(widthSectionWidthM)
    || !nonNegative(lengthShearDemandKn)
    || !positive(lengthSectionWidthM)
  ) {
    throw new RangeError('Las entradas para revisar el cortante unidireccional no son válidas.')
  }

  const concreteShearStressMpa = 0.17 * Math.sqrt(concreteStrengthMpa)
  const calculateDirection = (shearDemandKn: number, sectionWidthM: number): GuideOneWayShearDirectionResult => {
    const designShearStrengthKn = strengthReductionFactor * concreteShearStressMpa * sectionWidthM * effectiveDepthM * 1000
    const utilization = shearDemandKn / designShearStrengthKn
    return {
      shearDemandKn,
      sectionWidthM,
      designShearStrengthKn,
      utilization,
      status: utilization <= 1 ? 'meets-guide-reference' : 'below-guide-reference',
    }
  }

  return {
    concreteStrengthMpa,
    effectiveDepthM,
    concreteShearStressMpa,
    strengthReductionFactor,
    widthDirection: calculateDirection(widthShearDemandKn, widthSectionWidthM),
    lengthDirection: calculateDirection(lengthShearDemandKn, lengthSectionWidthM),
    status: 'guide-reference-only',
  }
}
