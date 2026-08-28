import { describe, expect, it } from 'vitest'
import { checkGuidePunchingShear } from './punching-shear-guide-check'

describe('checkGuidePunchingShear', () => {
  it('calcula demanda y resistencia de referencia para una columna rectangular interior centrada', () => {
    const result = checkGuidePunchingShear({
      concreteStrengthMpa: 23.54,
      factoredAxialLoadKn: 900,
      footingWidthM: 2,
      footingLengthM: 3,
      columnWidthM: 0.4,
      columnLengthM: 0.6,
      effectiveDepthM: 0.417,
    })

    expect(result.criticalPerimeterM).toBeCloseTo(3.668)
    expect(result.shearDemandKn).toBeCloseTo(775.37, 2)
    expect(result.governingConcreteShearStressMpa).toBeCloseTo(0.824, 3)
    expect(result.status).toBe('meets-guide-reference')
  })

  it('usa solo la primera alternativa para una columna cuadrada', () => {
    const result = checkGuidePunchingShear({
      concreteStrengthMpa: 23.54,
      factoredAxialLoadKn: 1900,
      footingWidthM: 2.65,
      footingLengthM: 2.65,
      columnWidthM: 0.5,
      columnLengthM: 0.5,
      effectiveDepthM: 0.4,
    })

    expect(result.columnShape).toBe('square')
    expect(result.governingAlternative).toBe('square-only')
  })

  it('rechaza un perímetro crítico que sale de la zapata', () => {
    expect(() => checkGuidePunchingShear({
      concreteStrengthMpa: 20,
      factoredAxialLoadKn: 500,
      footingWidthM: 1,
      footingLengthM: 1,
      columnWidthM: 0.7,
      columnLengthM: 0.7,
      effectiveDepthM: 0.4,
    })).toThrow(RangeError)
  })
})
