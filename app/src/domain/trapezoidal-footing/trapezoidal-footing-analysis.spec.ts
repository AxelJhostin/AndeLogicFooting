import { describe, expect, it } from 'vitest'
import type { TrapezoidalFootingInputs } from '../projects'
import { analyzeTrapezoidalFooting } from './trapezoidal-footing-analysis'

const manualCase: TrapezoidalFootingInputs = {
  serviceColumn1LoadKn: 500,
  serviceColumn2LoadKn: 700,
  factoredColumn1LoadKn: 750,
  factoredColumn2LoadKn: 1050,
  allowableBearingKpa: 180,
  bearingCapacityBasis: 'gross',
  removedOverburdenKpa: 0,
  concreteUnitWeightKnM3: 24,
  soilCoverDepthM: 0,
  soilUnitWeightKnM3: 0,
  leftFootingWidthM: 1.5,
  rightFootingWidthM: 2.5,
  footingLengthM: 6,
  footingThicknessM: 0.5,
  column1WidthM: 0.4,
  column1LengthM: 0.4,
  column1CenterFromLeftM: 0.75,
  column2WidthM: 0.4,
  column2LengthM: 0.4,
  column2CenterFromLeftM: 5.035714285714286,
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

describe('analyzeTrapezoidalFooting', () => {
  it('reproduce el caso manual AXC-TRAP-001 con presión uniforme', () => {
    const outcome = analyzeTrapezoidalFooting(manualCase)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.geometry.areaM2).toBeCloseTo(12, 10)
    expect(outcome.analysis.geometry.centroidFromLeftM).toBeCloseTo(3.25, 10)
    expect(outcome.analysis.contact.footingSelfWeightKn).toBeCloseTo(144, 10)
    expect(outcome.analysis.contact.grossPressureLeftKpa).toBeCloseTo(112, 9)
    expect(outcome.analysis.contact.grossPressureRightKpa).toBeCloseTo(112, 9)
    expect(outcome.analysis.structural.factoredPressureLeftKpa).toBeCloseTo(150, 9)
    expect(outcome.analysis.structural.factoredPressureRightKpa).toBeCloseTo(150, 9)
    expect(outcome.analysis.longitudinal.endShearKn).toBeCloseTo(0, 8)
    expect(outcome.analysis.longitudinal.endMomentKnM).toBeCloseTo(0, 8)
  })

  it('resuelve una presión lineal cuando resultante y centroide no coinciden', () => {
    const outcome = analyzeTrapezoidalFooting({ ...manualCase, serviceColumn2LoadKn: 800, factoredColumn2LoadKn: 1200 })
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.contact.grossPressureRightKpa).toBeGreaterThan(outcome.analysis.contact.grossPressureLeftKpa)
    expect(outcome.analysis.longitudinal.endShearKn).toBeCloseTo(0, 8)
    expect(outcome.analysis.longitudinal.endMomentKnM).toBeCloseTo(0, 8)
  })

  it('bloquea pérdida de contacto completo', () => {
    const outcome = analyzeTrapezoidalFooting({
      ...manualCase,
      serviceColumn1LoadKn: 50,
      serviceColumn2LoadKn: 1500,
      factoredColumn1LoadKn: 50,
      factoredColumn2LoadKn: 2200,
      column1CenterFromLeftM: 0.5,
      column2CenterFromLeftM: 5.5,
    })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('contacto completo'))).toBe(true)
  })

  it('rechaza un perímetro de punzonamiento que sale del borde inclinado', () => {
    const outcome = analyzeTrapezoidalFooting({ ...manualCase, leftFootingWidthM: 0.7 })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('perímetro'))).toBe(true)
  })
})
