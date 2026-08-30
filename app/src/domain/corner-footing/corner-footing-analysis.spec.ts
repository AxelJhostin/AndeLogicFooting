import { describe, expect, it } from 'vitest'
import { DEFAULT_CORNER_FOOTING_INPUTS } from '../projects'
import { analyzeCornerFooting } from './corner-footing-analysis'

describe('analyzeCornerFooting', () => {
  it('reproduce AXC-CORNER-001 y conserva el equilibrio biaxial', () => {
    const outcome = analyzeCornerFooting(DEFAULT_CORNER_FOOTING_INPUTS)
    expect(outcome.status).toBe('calculated')
    if (outcome.status !== 'calculated') return

    expect(outcome.analysis.geometry.areaM2).toBeCloseTo(0.275625, 10)
    expect(outcome.analysis.contact.footingSelfWeightKn).toBeCloseTo(3.3075, 10)
    expect(outcome.analysis.contact.gross.eccentricityXM).toBeCloseTo(-0.0346360330, 9)
    expect(outcome.analysis.contact.gross.eccentricityYM).toBeCloseTo(-0.0346360330, 9)
    expect(outcome.analysis.contact.gross.kernInteraction).toBeCloseTo(0.7916807547, 9)
    expect(outcome.analysis.contact.gross.cornerPressuresKpa.bottomLeft).toBeCloseTo(281.5173307, 7)
    expect(outcome.analysis.contact.gross.cornerPressuresKpa.bottomRight).toBeCloseTo(157.1247166, 7)
    expect(outcome.analysis.contact.gross.cornerPressuresKpa.topLeft).toBeCloseTo(157.1247166, 7)
    expect(outcome.analysis.contact.gross.cornerPressuresKpa.topRight).toBeCloseTo(32.7321024, 7)
    expect(outcome.analysis.structural.factored.cornerPressuresKpa.bottomLeft).toBeCloseTo(404.2759961, 7)
    expect(outcome.analysis.structural.factored.cornerPressuresKpa.topRight).toBeCloseTo(31.0981535, 7)
    expect(outcome.analysis.equilibrium.verticalResidualKn).toBeCloseTo(0, 8)
    expect(outcome.analysis.equilibrium.momentXResidualKnM).toBeCloseTo(0, 8)
    expect(outcome.analysis.equilibrium.momentYResidualKnM).toBeCloseTo(0, 8)
    expect(outcome.analysis.punching.status).toBe('not-evaluated')
  })

  it('refleja las cuatro presiones al cambiar a la esquina opuesta', () => {
    const first = analyzeCornerFooting(DEFAULT_CORNER_FOOTING_INPUTS)
    const opposite = analyzeCornerFooting({ ...DEFAULT_CORNER_FOOTING_INPUTS, cornerPosition: 'top-right' })
    expect(first.status).toBe('calculated')
    expect(opposite.status).toBe('calculated')
    if (first.status !== 'calculated' || opposite.status !== 'calculated') return

    expect(opposite.analysis.contact.gross.cornerPressuresKpa.topRight).toBeCloseTo(first.analysis.contact.gross.cornerPressuresKpa.bottomLeft, 9)
    expect(opposite.analysis.contact.gross.cornerPressuresKpa.bottomLeft).toBeCloseTo(first.analysis.contact.gross.cornerPressuresKpa.topRight, 9)
    expect(opposite.analysis.contact.maximumPressureForComparisonKpa).toBeCloseTo(first.analysis.contact.maximumPressureForComparisonKpa, 9)
  })

  it('bloquea la interacción biaxial aunque cada excentricidad aislada esté dentro de su sexto', () => {
    const outcome = analyzeCornerFooting({
      ...DEFAULT_CORNER_FOOTING_INPUTS,
      footingWidthM: 0.6,
      footingLengthM: 0.6,
    })
    expect(outcome.status).toBe('invalid-input')
    if (outcome.status !== 'invalid-input') return
    expect(outcome.issues.some((issue) => issue.message.includes('núcleo central biaxial'))).toBe(true)
  })

  it('rechaza una columna que no cabe dentro de la base', () => {
    const outcome = analyzeCornerFooting({ ...DEFAULT_CORNER_FOOTING_INPUTS, columnWidthM: 0.6 })
    expect(outcome.status).toBe('invalid-input')
  })
})
