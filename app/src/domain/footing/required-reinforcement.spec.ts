import { describe, expect, it } from 'vitest'
import { calculateGuideRequiredReinforcement } from './required-reinforcement'

describe('calculateGuideRequiredReinforcement', () => {
  it('reproduce el acero requerido del ejemplo de la guía por una franja de un metro', () => {
    const result = calculateGuideRequiredReinforcement({
      concreteStrengthMpa: 23.54,
      steelYieldStrengthMpa: 412.08,
      effectiveDepthM: 0.425,
      widthMomentDemandKnM: 177.35,
      widthStripWidthM: 1,
      lengthMomentDemandKnM: 177.35,
      lengthStripWidthM: 1,
    })

    expect(result.widthDirection.requiredAreaPerMeterCm2).toBeCloseTo(11.58, 2)
    expect(result.lengthDirection.requiredAreaPerMeterCm2).toBeCloseTo(11.58, 2)
    expect(result.widthDirection.status).toBe('calculated')
  })

  it('marca una sección que no puede resolverse con la expresión de la guía', () => {
    const result = calculateGuideRequiredReinforcement({
      concreteStrengthMpa: 20,
      steelYieldStrengthMpa: 420,
      effectiveDepthM: 0.2,
      widthMomentDemandKnM: 1000,
      widthStripWidthM: 1,
      lengthMomentDemandKnM: 1000,
      lengthStripWidthM: 1,
    })

    expect(result.widthDirection.status).toBe('section-insufficient')
    expect(result.widthDirection.requiredAreaPerMeterCm2).toBeNull()
  })

  it('rechaza entradas no físicas', () => {
    expect(() => calculateGuideRequiredReinforcement({
      concreteStrengthMpa: 0,
      steelYieldStrengthMpa: 420,
      effectiveDepthM: 0.4,
      widthMomentDemandKnM: 50,
      widthStripWidthM: 1,
      lengthMomentDemandKnM: 50,
      lengthStripWidthM: 1,
    })).toThrow(RangeError)
  })
})
