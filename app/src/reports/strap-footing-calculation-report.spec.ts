import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildStrapFootingCalculationReport } from './strap-footing-calculation-report'

describe('buildStrapFootingCalculationReport', () => {
  it('documenta las dos bases, la viga y el límite de punzonamiento', () => {
    const project = createNewProject()
    project.footingType = 'strap'
    const report = buildStrapFootingCalculationReport(project, '2026-08-28T00:00:00.000Z')
    expect(report.inputs.some((input) => input.id === 'strapBeamDepthM')).toBe(true)
    expect(report.limitations.join(' ')).toContain('sin contacto con el suelo')
    expect(report.limitations.join(' ')).toContain('punzonamiento')
  })
})
