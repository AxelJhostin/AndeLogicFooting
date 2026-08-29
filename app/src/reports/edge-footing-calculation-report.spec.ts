import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildEdgeFootingCalculationReport } from './edge-footing-calculation-report'

describe('buildEdgeFootingCalculationReport', () => {
  it('documenta orientación, contacto completo y punzonamiento no evaluado', () => {
    const project = createNewProject()
    project.footingType = 'edge'
    const report = buildEdgeFootingCalculationReport(project, '2026-08-29T00:00:00.000Z')
    expect(report.inputs.some((input) => input.id === 'edgeSide')).toBe(true)
    expect(report.limitations.join(' ')).toContain('tercio central')
    expect(report.limitations.join(' ')).toContain('Punzonamiento de borde')
  })
})
