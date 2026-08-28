import { describe, expect, it } from 'vitest'
import { calculateGuideMinimumReinforcement } from './minimum-reinforcement'

describe('calculateGuideMinimumReinforcement', () => {
  it('compara el acero declarado por metro con el mínimo de la guía oficial', () => {
    const result = calculateGuideMinimumReinforcement({
      footingThicknessM: 0.5,
      barDiameterM: 0.016,
      barsParallelToWidthSpacingM: 0.25,
      barsParallelToLengthSpacingM: 0.3,
    })

    expect(result.minimumAreaPerMeterMm2).toBeCloseTo(900)
    expect(result.barsParallelToWidth.providedAreaPerMeterMm2).toBeCloseTo(804.2477)
    expect(result.barsParallelToWidth.status).toBe('below-guide-minimum')
    expect(result.barsParallelToLength.providedAreaPerMeterMm2).toBeCloseTo(670.2064)
  })
})
