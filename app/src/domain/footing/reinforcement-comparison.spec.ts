import { describe, expect, it } from 'vitest'
import { compareGuideReinforcement } from './reinforcement-comparison'

describe('compareGuideReinforcement', () => {
  it('exige el mayor entre acero mínimo y acero requerido en cada dirección', () => {
    const result = compareGuideReinforcement({
      minimumAreaPerMeterMm2: 900,
      widthProvidedAreaPerMeterMm2: 1000,
      lengthProvidedAreaPerMeterMm2: 1300,
      widthRequiredAreaPerMeterMm2: 1100,
      lengthRequiredAreaPerMeterMm2: 850,
    })

    expect(result.widthDirection.requiredReferenceAreaPerMeterMm2).toBe(1100)
    expect(result.widthDirection.status).toBe('below-guide-reference')
    expect(result.lengthDirection.requiredReferenceAreaPerMeterMm2).toBe(900)
    expect(result.lengthDirection.status).toBe('meets-guide-reference')
  })

  it('propaga la sección insuficiente cuando el acero requerido no tiene solución', () => {
    const result = compareGuideReinforcement({
      minimumAreaPerMeterMm2: 900,
      widthProvidedAreaPerMeterMm2: 2000,
      lengthProvidedAreaPerMeterMm2: 2000,
      widthRequiredAreaPerMeterMm2: null,
      lengthRequiredAreaPerMeterMm2: 1000,
    })

    expect(result.widthDirection.status).toBe('section-insufficient')
    expect(result.widthDirection.requiredReferenceAreaPerMeterMm2).toBeNull()
  })
})
