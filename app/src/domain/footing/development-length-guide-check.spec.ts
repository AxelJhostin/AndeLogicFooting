import { describe, expect, it } from 'vitest'
import { checkGuideDevelopmentLength } from './development-length-guide-check'

describe('checkGuideDevelopmentLength', () => {
  it('reproduce la longitud de referencia del ejemplo de la guía', () => {
    const result = checkGuideDevelopmentLength({
      concreteStrengthMpa: 23.536,
      steelYieldStrengthMpa: 411.88,
      barDiameterM: 0.02,
      availableLengthWidthM: 1.25,
      availableLengthLengthM: 1.1,
    })

    expect(result.requiredDevelopmentLengthM).toBeCloseTo(1.213, 3)
    expect(result.widthDirection.status).toBe('meets-guide-reference')
    expect(result.lengthDirection.status).toBe('below-guide-reference')
  })

  it('rechaza longitudes o materiales no físicos', () => {
    expect(() => checkGuideDevelopmentLength({
      concreteStrengthMpa: 0,
      steelYieldStrengthMpa: 420,
      barDiameterM: 0.016,
      availableLengthWidthM: 1,
      availableLengthLengthM: 1,
    })).toThrow(RangeError)
  })
})
