import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildTrapezoidalFootingCalculationReport } from './trapezoidal-footing-calculation-report'

describe('buildTrapezoidalFootingCalculationReport', () => {
  it('documenta anchos extremos, contacto completo y dos columnas', () => {
    const project = createNewProject()
    project.footingType = 'trapezoidal'
    const report = buildTrapezoidalFootingCalculationReport(project, '2026-08-29T00:00:00.000Z')
    expect(report.inputs.some((input) => input.id === 'leftFootingWidthM')).toBe(true)
    expect(report.inputs.some((input) => input.id === 'rightFootingWidthM')).toBe(true)
    expect(report.limitations.join(' ')).toContain('contacto completo')
  })
})
