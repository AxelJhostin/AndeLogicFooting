import { describe, expect, it } from 'vitest'
import type { CombinedFootingInputs } from '../projects'
import { analyzeCombinedFooting } from './combined-footing-analysis'

const symmetricCase: CombinedFootingInputs = {
  serviceColumn1LoadKn: 600,
  serviceColumn2LoadKn: 600,
  factoredColumn1LoadKn: 900,
  factoredColumn2LoadKn: 900,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  footingWidthM: 2,
  footingLengthM: 6,
  footingThicknessM: 0.5,
  column1WidthM: 0.4,
  column1LengthM: 0.4,
  column1CenterFromLeftM: 1,
  column2WidthM: 0.4,
  column2LengthM: 0.4,
  column2CenterFromLeftM: 5,
  concreteCoverM: 0.075,
  barDiameterM: 0.016,
  concreteStrengthMpa: 23.54,
  steelYieldStrengthMpa: 412.08,
  longitudinalBottomBarSpacingM: 0.15,
  longitudinalTopBarSpacingM: 0.15,
  transverseBarSpacingM: 0.15,
  longitudinalDevelopmentAvailableM: 0.8,
  transverseDevelopmentAvailableM: 0.8,
}

describe('analyzeCombinedFooting', () => {
  it('reproduce el caso manual simétrico AXC-COMB-001', () => {
    const outcome = analyzeCombinedFooting(symmetricCase)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return

    expect(outcome.analysis.contact.footingSelfWeightKn).toBeCloseTo(144, 10)
    expect(outcome.analysis.contact.grossPressureLeftKpa).toBeCloseTo(112, 10)
    expect(outcome.analysis.contact.grossPressureRightKpa).toBeCloseTo(112, 10)
    expect(outcome.analysis.structural.factoredPressureLeftKpa).toBeCloseTo(150, 10)
    expect(outcome.analysis.structural.factoredPressureRightKpa).toBeCloseTo(150, 10)
    expect(outcome.analysis.longitudinal.endShearKn).toBeCloseTo(0, 9)
    expect(outcome.analysis.longitudinal.endMomentKnM).toBeCloseTo(0, 9)
    expect(outcome.analysis.longitudinal.maximumPositiveMomentKnM).toBeCloseTo(150, 9)
    expect(outcome.analysis.longitudinal.minimumNegativeMomentKnM).toBeCloseTo(-450, 9)
  })

  it('conserva equilibrio con cargas distintas y presión lineal', () => {
    const outcome = analyzeCombinedFooting({
      ...symmetricCase,
      serviceColumn1LoadKn: 500,
      serviceColumn2LoadKn: 700,
      factoredColumn1LoadKn: 750,
      factoredColumn2LoadKn: 1050,
    })
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return

    expect(outcome.analysis.contact.grossPressureRightKpa).toBeGreaterThan(outcome.analysis.contact.grossPressureLeftKpa)
    expect(outcome.analysis.longitudinal.endShearKn).toBeCloseTo(0, 9)
    expect(outcome.analysis.longitudinal.endMomentKnM).toBeCloseTo(0, 9)
  })

  it('bloquea levantamiento en cualquier extremo de la base', () => {
    const outcome = analyzeCombinedFooting({
      ...symmetricCase,
      serviceColumn1LoadKn: 100,
      serviceColumn2LoadKn: 1000,
      factoredColumn1LoadKn: 100,
      factoredColumn2LoadKn: 1500,
      column1CenterFromLeftM: 0.5,
      column2CenterFromLeftM: 5.5,
    })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('contacto completo'))).toBe(true)
  })

  it('rechaza columnas superpuestas o fuera de la zapata', () => {
    const outcome = analyzeCombinedFooting({
      ...symmetricCase,
      column1CenterFromLeftM: 2.8,
      column2CenterFromLeftM: 3,
    })
    expect(outcome.status).toBe('invalid-input')
  })

  it('bloquea perímetros de punzonamiento superpuestos aunque las columnas no se toquen', () => {
    const outcome = analyzeCombinedFooting({
      ...symmetricCase,
      column1CenterFromLeftM: 2.7,
      column2CenterFromLeftM: 3.3,
    })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('perímetros críticos'))).toBe(true)
  })
})
