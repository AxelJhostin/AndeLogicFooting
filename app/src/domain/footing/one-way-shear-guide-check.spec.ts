import { describe, expect, it } from 'vitest'
import { checkGuideOneWayShear } from './one-way-shear-guide-check'

describe('checkGuideOneWayShear', () => {
  it('calcula la resistencia de referencia y su utilización', () => {
    const result = checkGuideOneWayShear({
      concreteStrengthMpa: 23.54,
      effectiveDepthM: 0.425,
      widthShearDemandKn: 400,
      widthSectionWidthM: 2.65,
      lengthShearDemandKn: 200,
      lengthSectionWidthM: 2.65,
    })

    expect(result.concreteShearStressMpa).toBeCloseTo(0.825, 3)
    expect(result.widthDirection.designShearStrengthKn).toBeCloseTo(696.704, 3)
    expect(result.widthDirection.status).toBe('meets-guide-reference')
    expect(result.lengthDirection.utilization).toBeCloseTo(200 / 696.704, 3)
  })

  it('identifica una demanda por encima de la resistencia de referencia', () => {
    const result = checkGuideOneWayShear({
      concreteStrengthMpa: 20,
      effectiveDepthM: 0.3,
      widthShearDemandKn: 1000,
      widthSectionWidthM: 2,
      lengthShearDemandKn: 10,
      lengthSectionWidthM: 2,
    })

    expect(result.widthDirection.status).toBe('below-guide-reference')
  })
})
