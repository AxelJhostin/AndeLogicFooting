import { describe, expect, it } from 'vitest'
import { DEFAULT_MAT_FOOTING_INPUTS } from '../projects'
import { analyzeMatFooting } from './mat-footing-analysis'

describe('analyzeMatFooting', () => {
  it('reproduce AXC-MAT-001 y cierra el equilibrio multicolumna', () => {
    const outcome = analyzeMatFooting(DEFAULT_MAT_FOOTING_INPUTS)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    const { analysis } = outcome
    expect(analysis.geometry.areaM2).toBeCloseTo(48, 10)
    expect(analysis.contact.footingSelfWeightKn).toBeCloseTo(806.4, 9)
    expect(analysis.contact.gross.totalLoadKn).toBeCloseTo(3806.4, 9)
    expect(analysis.contact.gross.momentYKnM).toBeCloseTo(800, 9)
    expect(analysis.contact.gross.momentXKnM).toBeCloseTo(300, 9)
    expect(analysis.contact.gross.kernInteraction).toBeCloseTo(0.23644388398, 9)
    expect(analysis.contact.gross.cornerPressuresKpa.bottomLeft).toBeCloseTo(60.55, 9)
    expect(analysis.contact.gross.cornerPressuresKpa.bottomRight).toBeCloseTo(85.55, 9)
    expect(analysis.contact.gross.cornerPressuresKpa.topLeft).toBeCloseTo(73.05, 9)
    expect(analysis.contact.gross.cornerPressuresKpa.topRight).toBeCloseTo(98.05, 9)
    expect(analysis.structural.factored.cornerPressuresKpa.bottomLeft).toBeCloseTo(65.625, 9)
    expect(analysis.structural.factored.cornerPressuresKpa.topRight).toBeCloseTo(121.875, 9)
    expect(analysis.settlement.status).toBe('calculated')
    if (analysis.settlement.status !== 'calculated') return
    expect(analysis.settlement.maximumSettlementMm).toBeCloseTo(6.536666667, 8)
    expect(analysis.settlement.differentialSettlementMm).toBeCloseTo(2.5, 8)
    expect(analysis.equilibrium.verticalResidualKn).toBeCloseTo(0, 8)
    expect(analysis.equilibrium.momentXResidualKnM).toBeCloseTo(0, 8)
    expect(analysis.equilibrium.momentYResidualKnM).toBeCloseTo(0, 8)
    expect(analysis.plate.status).toBe('not-evaluated')
  })

  it('deja asentamientos no evaluados cuando no se declara módulo de balasto', () => {
    const outcome = analyzeMatFooting({ ...DEFAULT_MAT_FOOTING_INPUTS, subgradeModulusKnM3: 0 })
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return
    expect(outcome.analysis.settlement.status).toBe('not-evaluated')
  })

  it('bloquea columnas superpuestas o fuera de la losa', () => {
    const overlap = analyzeMatFooting({ ...DEFAULT_MAT_FOOTING_INPUTS, columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column, index) => index === 1 ? { ...column, centerXM: 2, centerYM: 1.5 } : column) })
    expect(overlap.status).toBe('invalid-input')
    const outside = analyzeMatFooting({ ...DEFAULT_MAT_FOOTING_INPUTS, columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column, index) => index === 0 ? { ...column, centerXM: 0.1 } : column) })
    expect(outside.status).toBe('invalid-input')
  })

  it('bloquea contacto parcial producido por una distribución extrema', () => {
    const outcome = analyzeMatFooting({ ...DEFAULT_MAT_FOOTING_INPUTS, columns: DEFAULT_MAT_FOOTING_INPUTS.columns.map((column, index) => index === 0 ? { ...column, serviceLoadKn: 10000, factoredLoadKn: 15000 } : { ...column, serviceLoadKn: 10, factoredLoadKn: 15 }) })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('núcleo central biaxial'))).toBe(true)
  })
})
