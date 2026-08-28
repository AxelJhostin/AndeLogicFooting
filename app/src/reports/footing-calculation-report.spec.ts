import { describe, expect, it } from 'vitest'
import { createNewProject } from '../domain/projects'
import { buildFootingCalculationReport } from './footing-calculation-report'

describe('buildFootingCalculationReport', () => {
  it('preserva identidad, versión, entradas y advertencias en un modelo independiente de la interfaz', () => {
    const project = createNewProject()
    project.name = 'Caso de memoria'
    project.inputSnapshot.axialLoadKn = 450
    project.inputSnapshot.allowableBearingKpa = 180

    const report = buildFootingCalculationReport(project, '2026-08-28T12:00:00.000Z')

    expect(report.project.name).toBe('Caso de memoria')
    expect(report.product.productVersion).toBe(project.productVersion)
    expect(report.profile.id).toBe('NEC-PUBLIC-2014-PENDING')
    expect(report.inputs.find((input) => input.id === 'axialLoadKn')).toMatchObject({ value: 450, unit: 'kN' })
    expect(report.limitations).toEqual(expect.arrayContaining([
      expect.stringContaining('validación'),
      expect.stringContaining('estudio geotécnico'),
    ]))
  })
})
