import { describe, expect, it } from 'vitest'
import { getFootingPlanGeometry } from './plan-geometry'

describe('getFootingPlanGeometry', () => {
  it('conserva las proporciones de zapata y columna', () => {
    const geometry = getFootingPlanGeometry({
      footingWidthM: 2,
      footingLengthM: 1,
      columnWidthM: 0.4,
      columnLengthM: 0.2,
    })

    expect(geometry.footingWidth / geometry.footingLength).toBeCloseTo(2)
    expect(geometry.columnWidth / geometry.columnLength).toBeCloseTo(2)
  })

  it('rechaza dimensiones no físicas', () => {
    expect(() => getFootingPlanGeometry({
      footingWidthM: 0,
      footingLengthM: 1,
      columnWidthM: 0.3,
      columnLengthM: 0.3,
    })).toThrow(RangeError)
  })
})
