import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildCornerFootingCalculationReport } from './corner-footing-calculation-report'

describe('buildCornerFootingCalculationReport', () => {
  it('documenta entradas biaxiales, orientación, fuentes y límites', () => {
    const project = createNewProject()
    project.footingType = 'corner'
    const report = buildCornerFootingCalculationReport(project, '2026-08-29T00:00:00.000Z')

    expect(report.inputs.some((input) => input.id === 'cornerPosition')).toBe(true)
    expect(report.inputs.some((input) => input.id === 'footingLengthM')).toBe(true)
    expect(report.profile.sources.some((source) => source.id === 'fhwa-nhi-06-089')).toBe(true)
    expect(report.profile.traceability.filter((item) => item.appliesTo.includes('corner')).length).toBeGreaterThan(5)
    expect(report.limitations.some((limit) => limit.includes('cuatro esquinas'))).toBe(true)
  })
})
