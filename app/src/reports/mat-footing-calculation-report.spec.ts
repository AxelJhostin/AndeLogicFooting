import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildMatFootingCalculationReport } from './mat-footing-calculation-report'

describe('buildMatFootingCalculationReport', () => {
  it('conserva fuentes, parámetros geotécnicos, número de columnas y límites de placa', () => {
    const project = createNewProject()
    project.footingType = 'mat'
    const report = buildMatFootingCalculationReport(project, '2026-08-29T00:00:00.000Z')
    expect(report.generatedAt).toBe('2026-08-29T00:00:00.000Z')
    expect(report.inputs.find(({ id }) => id === 'columns')?.value).toBe(4)
    expect(report.inputs.find(({ id }) => id === 'subgradeModulusKnM3')?.value).toBe(15000)
    expect(report.profile.sources.some(({ id }) => id === 'fhwa-nhi-06-089')).toBe(true)
    expect(report.profile.traceability.some(({ id }) => id === 'mat-contact')).toBe(true)
    expect(report.limitations.some((limit) => limit.includes('punzonamiento'))).toBe(true)
  })
})
