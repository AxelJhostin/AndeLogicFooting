import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildCombinedFootingCalculationReport } from './combined-footing-calculation-report'

describe('buildCombinedFootingCalculationReport', () => {
  it('documenta entradas y límites exclusivos de zapata combinada', () => {
    const project = createNewProject()
    project.footingType = 'combined'
    const report = buildCombinedFootingCalculationReport(project, '2026-08-28T00:00:00.000Z')

    expect(report.inputs.some((input) => input.id === 'serviceColumn2LoadKn')).toBe(true)
    expect(report.limitations.join(' ')).toContain('dos columnas')
    expect(report.limitations.join(' ')).toContain('contacto completo')
  })
})
