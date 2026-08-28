import { describe, expect, it } from 'vitest'
import { calculatePunchingShearDemand } from './punching-shear-demand'

describe('calculatePunchingShearDemand', () => {
  it('calcula perímetro, área exterior y demanda por equilibrio con un perímetro declarado', () => {
    const result = calculatePunchingShearDemand({
      factoredAxialLoadKn: 900,
      footingWidthM: 2,
      footingLengthM: 3,
      columnWidthM: 0.4,
      columnLengthM: 0.6,
      criticalSectionOffsetM: 0.2085,
    })

    expect(result.factoredContactPressureKpa).toBeCloseTo(150)
    expect(result.criticalSectionWidthM).toBeCloseTo(0.817)
    expect(result.criticalSectionLengthM).toBeCloseTo(1.017)
    expect(result.criticalPerimeterM).toBeCloseTo(3.668)
    expect(result.criticalSectionAreaM2).toBeCloseTo(0.830889)
    expect(result.exteriorTributaryAreaM2).toBeCloseTo(5.169111)
    expect(result.shearDemandKn).toBeCloseTo(775.36665)
  })

  it('rechaza un perímetro crítico que sale de la zapata', () => {
    expect(() => calculatePunchingShearDemand({
      factoredAxialLoadKn: 500,
      footingWidthM: 1,
      footingLengthM: 1,
      columnWidthM: 0.5,
      columnLengthM: 0.5,
      criticalSectionOffsetM: 0.3,
    })).toThrow(/no cabe/i)
  })

  it('rechaza una distancia crítica no positiva', () => {
    expect(() => calculatePunchingShearDemand({
      factoredAxialLoadKn: 500,
      footingWidthM: 1.5,
      footingLengthM: 1.5,
      columnWidthM: 0.3,
      columnLengthM: 0.3,
      criticalSectionOffsetM: 0,
    })).toThrow(RangeError)
  })
})
