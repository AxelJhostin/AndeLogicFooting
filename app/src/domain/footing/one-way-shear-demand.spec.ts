import { describe, expect, it } from 'vitest'
import { calculateOneWayShearDemand } from './one-way-shear-demand'

describe('calculateOneWayShearDemand', () => {
  it('calcula la demanda por equilibrio en ambos ejes de una zapata rectangular', () => {
    const result = calculateOneWayShearDemand({
      factoredAxialLoadKn: 900,
      footingWidthM: 2,
      footingLengthM: 3,
      columnWidthM: 0.4,
      columnLengthM: 0.6,
      footingThicknessM: 0.5,
      concreteCoverM: 0.075,
      barDiameterM: 0.016,
    })

    expect(result.factoredContactPressureKpa).toBeCloseTo(150)
    expect(result.effectiveDepthM).toBeCloseTo(0.417)
    expect(result.widthDirection.cantileverProjectionM).toBeCloseTo(0.8)
    expect(result.widthDirection.loadedLengthBeyondSectionM).toBeCloseTo(0.383)
    expect(result.widthDirection.shearDemandKn).toBeCloseTo(172.35)
    expect(result.lengthDirection.cantileverProjectionM).toBeCloseTo(1.2)
    expect(result.lengthDirection.loadedLengthBeyondSectionM).toBeCloseTo(0.783)
    expect(result.lengthDirection.shearDemandKn).toBeCloseTo(234.9)
  })

  it('devuelve demanda cero cuando la sección evaluada queda fuera del voladizo', () => {
    const result = calculateOneWayShearDemand({
      factoredAxialLoadKn: 500,
      footingWidthM: 1.2,
      footingLengthM: 1.2,
      columnWidthM: 0.5,
      columnLengthM: 0.5,
      footingThicknessM: 0.5,
      concreteCoverM: 0.05,
      barDiameterM: 0.02,
    })

    expect(result.widthDirection.loadedLengthBeyondSectionM).toBe(0)
    expect(result.widthDirection.shearDemandKn).toBe(0)
    expect(result.widthDirection.sectionWithinCantilever).toBe(false)
    expect(result.lengthDirection.shearDemandKn).toBe(0)
  })

  it('rechaza una profundidad efectiva físicamente imposible', () => {
    expect(() => calculateOneWayShearDemand({
      factoredAxialLoadKn: 500,
      footingWidthM: 1.5,
      footingLengthM: 1.5,
      columnWidthM: 0.3,
      columnLengthM: 0.3,
      footingThicknessM: 0.08,
      concreteCoverM: 0.075,
      barDiameterM: 0.016,
    })).toThrow(RangeError)
  })
})
