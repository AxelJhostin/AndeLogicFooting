import { describe, expect, it } from 'vitest'
import { analyzeFootingCase } from './footing-analysis'
import { createNewProject } from '../domain/projects'

const referenceInputs = {
  axialLoadKn: 450, factoredAxialLoadKn: 900, allowableBearingKpa: 180, bearingCapacityBasis: 'gross' as const,
  removedOverburdenKpa: 0, concreteUnitWeightKnM3: 24, soilCoverDepthM: 0, soilUnitWeightKnM3: 0,
  columnWidthM: .4, columnLengthM: .6, footingWidthM: 2, footingLengthM: 3, footingThicknessM: .5,
  concreteCoverM: .075, barDiameterM: .016, concreteStrengthMpa: 23.54, steelYieldStrengthMpa: 412.08,
  developmentAvailableLengthWidthM: 1.3, developmentAvailableLengthLengthM: 1.3, punchingCriticalSectionOffsetM: .21,
  barsParallelToWidthMaxSpacingM: .15, barsParallelToLengthMaxSpacingM: .15,
}

describe('analyzeFootingCase', () => {
  it('orquesta los resultados existentes sin alterar sus valores de referencia', () => {
    const outcome = analyzeFootingCase({ ...createNewProject(), inputSnapshot: referenceInputs })
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.oneWay.widthDirection.shearDemandKn).toBeCloseTo(172.35, 10)
    expect(outcome.analysis.oneWay.lengthDirection.shearDemandKn).toBeCloseTo(234.9, 10)
    expect(outcome.analysis.punchingGuide.shearDemandKn).toBeCloseTo(775.36665, 10)
  })

  it('devuelve problemas de entrada sin ejecutar el caso', () => {
    const outcome = analyzeFootingCase(createNewProject())
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.length).toBeGreaterThan(0)
  })
})
