import { describe, expect, it } from 'vitest'
import type { EdgeFootingInputs } from '../projects'
import { analyzeEdgeFooting } from './edge-footing-analysis'

const manualCase: EdgeFootingInputs = {
  serviceAxialLoadKn: 160,
  factoredAxialLoadKn: 240,
  allowableBearingKpa: 250,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 2.4,
  footingLengthM: 0.6,
  footingThicknessM: 0.5,
  columnWidthM: 0.4,
  columnLengthM: 0.45,
  edgeSide: 'left',
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 0.5,
  transverseDevelopmentAvailableM: 1,
}

describe('analyzeEdgeFooting', () => {
  it('reproduce el caso manual AXC-ECC-001 y conserva el equilibrio', () => {
    const outcome = analyzeEdgeFooting(manualCase)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return

    expect(outcome.analysis.geometry.areaM2).toBeCloseTo(1.44, 10)
    expect(outcome.analysis.geometry.columnCenterFromLeftM).toBeCloseTo(0.225, 10)
    expect(outcome.analysis.contact.footingSelfWeightKn).toBeCloseTo(17.28, 10)
    expect(outcome.analysis.contact.gross.pressureLeftKpa).toBeCloseTo(206.4444444444, 8)
    expect(outcome.analysis.contact.gross.pressureRightKpa).toBeCloseTo(39.7777777778, 8)
    expect(outcome.analysis.structural.factored.pressureLeftKpa).toBeCloseTo(291.6666666667, 8)
    expect(outcome.analysis.structural.factored.pressureRightKpa).toBeCloseTo(41.6666666667, 8)
    expect(outcome.analysis.longitudinal.endShearKn).toBeCloseTo(0, 8)
    expect(outcome.analysis.longitudinal.endMomentKnM).toBeCloseTo(0, 8)
    expect(outcome.analysis.punching.status).toBe('not-evaluated')
  })

  it('refleja el caso derecho intercambiando las presiones extremas', () => {
    const left = analyzeEdgeFooting(manualCase)
    const right = analyzeEdgeFooting({ ...manualCase, edgeSide: 'right' })
    expect(left.status).toBe('calculated')
    expect(right.status).toBe('calculated')
    if (left.status !== 'calculated' || right.status !== 'calculated') return

    expect(right.analysis.contact.gross.pressureLeftKpa).toBeCloseTo(left.analysis.contact.gross.pressureRightKpa, 9)
    expect(right.analysis.contact.gross.pressureRightKpa).toBeCloseTo(left.analysis.contact.gross.pressureLeftKpa, 9)
    expect(right.analysis.longitudinal.governingFlexureDemandKnM).toBeCloseTo(left.analysis.longitudinal.governingFlexureDemandKnM, 9)
  })

  it('bloquea una geometría cuya resultante última sale del tercio central', () => {
    const outcome = analyzeEdgeFooting({ ...manualCase, footingLengthM: 1.2 })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('tercio central'))).toBe(true)
  })

  it('rechaza dimensiones que no producen una zapata de borde válida', () => {
    const outcome = analyzeEdgeFooting({ ...manualCase, columnLengthM: 0.65 })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('longitud'))).toBe(true)
  })
})
