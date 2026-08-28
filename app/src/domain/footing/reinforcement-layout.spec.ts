import { describe, expect, it } from 'vitest'
import { calculateReinforcementLayout } from './reinforcement-layout'

describe('calculateReinforcementLayout', () => {
  it('distribuye barras con separación máxima declarada en ambos sentidos', () => {
    const result = calculateReinforcementLayout({
      footingWidthM: 2,
      footingLengthM: 3,
      concreteCoverM: 0.075,
      barDiameterM: 0.016,
      barsParallelToWidthMaxSpacingM: 0.25,
      barsParallelToLengthMaxSpacingM: 0.3,
    })

    expect(result.barsParallelToWidth.count).toBe(13)
    expect(result.barsParallelToWidth.actualSpacingM).toBeCloseTo(0.2361667)
    expect(result.barsParallelToLength.count).toBe(8)
    expect(result.barsParallelToLength.actualSpacingM).toBeCloseTo(0.262)
  })

  it('rechaza una separación que no deja espacio útil entre recubrimientos', () => {
    expect(() => calculateReinforcementLayout({
      footingWidthM: 0.2,
      footingLengthM: 1,
      concreteCoverM: 0.1,
      barDiameterM: 0.016,
      barsParallelToWidthMaxSpacingM: 0.2,
      barsParallelToLengthMaxSpacingM: 0.2,
    })).toThrow(RangeError)
  })
})
