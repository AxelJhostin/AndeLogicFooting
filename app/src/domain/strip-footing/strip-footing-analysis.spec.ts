import { describe, expect, it } from 'vitest'
import { DEFAULT_STRIP_FOOTING_INPUTS } from '../projects'
import { analyzeStripFooting } from './strip-footing-analysis'

describe('analyzeStripFooting', () => {
  it('analiza una franja de un metro bajo un muro centrado', () => {
    const outcome = analyzeStripFooting({ ...DEFAULT_STRIP_FOOTING_INPUTS, developmentAvailableLengthM: 0.8 })
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return

    expect(outcome.analysis.referenceLengthM).toBe(1)
    expect(outcome.analysis.contact.grossContactPressureKpa).toBeCloseTo(158.4)
    expect(outcome.analysis.structural.effectiveDepthM).toBeCloseTo(0.269)
    expect(outcome.analysis.structural.cantileverProjectionM).toBeCloseTo(0.5)
    expect(outcome.analysis.structural.oneWayShearDemandKnPerM).toBeCloseTo(51.975)
    expect(outcome.analysis.structural.flexureDemandKnMPerM).toBeCloseTo(28.125)
  })

  it('rechaza un ancho que no sobresale del muro', () => {
    const outcome = analyzeStripFooting({ ...DEFAULT_STRIP_FOOTING_INPUTS, footingWidthM: 0.2 })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.map((issue) => issue.field)).toContain('footingWidthM')
  })
})
