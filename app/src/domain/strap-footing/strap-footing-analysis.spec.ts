import { describe, expect, it } from 'vitest'
import type { StrapFootingInputs } from '../projects'
import { analyzeStrapFooting } from './strap-footing-analysis'

const base: StrapFootingInputs = {
  serviceExteriorLoadKn: 600,
  serviceInteriorLoadKn: 900,
  factoredExteriorLoadKn: 900,
  factoredInteriorLoadKn: 1350,
  allowableBearingKpa: 250,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  exteriorFootingWidthM: 2,
  exteriorFootingLengthM: 1.6,
  exteriorFootingThicknessM: 0.5,
  interiorFootingWidthM: 2.4,
  interiorFootingLengthM: 2.2,
  interiorFootingThicknessM: 0.55,
  footingCenterSpacingM: 5,
  exteriorColumnWidthM: 0.4,
  exteriorColumnLengthM: 0.4,
  exteriorColumnCenterFromOuterEdgeM: 0.5,
  interiorColumnWidthM: 0.5,
  interiorColumnLengthM: 0.5,
  strapBeamWidthM: 0.35,
  strapBeamDepthM: 0.65,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  padLongitudinalBarSpacingM: 0.15,
  padTransverseBarSpacingM: 0.15,
  beamLongitudinalBarCount: 6,
  padDevelopmentAvailableM: 1.1,
  beamDevelopmentAvailableM: 1.2,
}

describe('analyzeStrapFooting', () => {
  it('reproduce el equilibrio manual AXC-STRAP-001', () => {
    const outcome = analyzeStrapFooting(base)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.geometry.exteriorEccentricityM).toBeCloseTo(0.3, 10)
    expect(outcome.analysis.service.eccentricMomentKnM).toBeCloseTo(180, 10)
    expect(outcome.analysis.service.strapShearKn).toBeCloseTo(36, 10)
    expect(outcome.analysis.service.exteriorStructuralReactionKn).toBeCloseTo(636, 10)
    expect(outcome.analysis.service.interiorStructuralReactionKn).toBeCloseTo(864, 10)
    expect(outcome.analysis.factored.eccentricMomentKnM).toBeCloseTo(270, 10)
    expect(outcome.analysis.factored.strapShearKn).toBeCloseTo(54, 10)
    expect(outcome.analysis.factored.exteriorReactionKn).toBeCloseTo(954, 10)
    expect(outcome.analysis.factored.interiorReactionKn).toBeCloseTo(1296, 10)
  })

  it('conserva el equilibrio vertical de ambas reacciones', () => {
    const outcome = analyzeStrapFooting(base)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.factored.exteriorReactionKn + outcome.analysis.factored.interiorReactionKn)
      .toBeCloseTo(base.factoredExteriorLoadKn + base.factoredInteriorLoadKn, 10)
  })

  it('bloquea una reacción interior nula o de levantamiento', () => {
    const outcome = analyzeStrapFooting({ ...base, factoredExteriorLoadKn: 5000, factoredInteriorLoadKn: 100 })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('reacciones positivas'))).toBe(true)
  })

  it('rechaza zapatas que se superponen o una columna exterior fuera de su base', () => {
    expect(analyzeStrapFooting({ ...base, footingCenterSpacingM: 1 }).status).toBe('invalid-input')
    expect(analyzeStrapFooting({ ...base, exteriorColumnCenterFromOuterEdgeM: 0.1 }).status).toBe('invalid-input')
  })
})
