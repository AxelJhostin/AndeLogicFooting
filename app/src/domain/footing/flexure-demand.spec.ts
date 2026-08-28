import { describe, expect, it } from 'vitest'
import { calculateFlexureDemand } from './flexure-demand'

describe('calculateFlexureDemand', () => {
  it('calcula momentos de voladizo en las dos direcciones con presión última uniforme', () => {
    const result = calculateFlexureDemand({
      factoredAxialLoadKn: 900,
      footingWidthM: 2,
      footingLengthM: 3,
      columnWidthM: 0.4,
      columnLengthM: 0.6,
    })

    expect(result.factoredContactPressureKpa).toBeCloseTo(150)
    expect(result.widthDirection.cantileverProjectionM).toBeCloseTo(0.8)
    expect(result.widthDirection.stripWidthM).toBeCloseTo(3)
    expect(result.widthDirection.momentDemandKnM).toBeCloseTo(144)
    expect(result.lengthDirection.cantileverProjectionM).toBeCloseTo(1.2)
    expect(result.lengthDirection.stripWidthM).toBeCloseTo(2)
    expect(result.lengthDirection.momentDemandKnM).toBeCloseTo(216)
    expect(result.governingDirection).toBe('length')
  })

  it('rechaza una columna que ocupa o excede la zapata', () => {
    expect(() => calculateFlexureDemand({
      factoredAxialLoadKn: 600,
      footingWidthM: 1,
      footingLengthM: 2,
      columnWidthM: 1,
      columnLengthM: 0.4,
    })).toThrow(RangeError)
  })
})
