import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildStripFootingCalculationReport } from './strip-footing-calculation-report'

describe('buildStripFootingCalculationReport', () => {
  it('documenta entradas y trazabilidad exclusivas de zapata corrida', () => {
    const project = createNewProject()
    project.footingType = 'strip'
    const report = buildStripFootingCalculationReport(project, '2026-08-28T12:00:00.000Z')
    expect(report.inputs.find((item) => item.id === 'serviceLineLoadKnM')?.unit).toBe('kN/m')
    expect(report.profile.traceability.some((item) => item.id === 'strip-shear')).toBe(true)
    expect(report.limitations.join(' ')).toContain('1.00 m')
  })
})
