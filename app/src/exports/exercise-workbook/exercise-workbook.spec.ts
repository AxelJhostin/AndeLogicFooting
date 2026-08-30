import { describe, expect, it } from 'vitest'
import { createNewProject } from '../../domain/projects'
import {
  FOOTING_TYPES,
  applyFootingExample,
  defaultExampleForFootingType,
  examplesForFootingType,
} from '../../domain/examples/footing-examples'
import { buildExerciseWorkbookModel, exportExerciseWorkbook } from './exercise-workbook'

describe('exercise workbook export', () => {
  it.each(FOOTING_TYPES)('builds an auditable formula model for %s', (footingType) => {
    const project = applyFootingExample(createNewProject(), defaultExampleForFootingType(footingType))
    const model = buildExerciseWorkbookModel(project, '2026-08-30T12:00:00.000Z')

    expect(model.footingType).toBe(footingType)
    expect(model.sheets).toEqual(['Resumen', 'Entradas', 'Cálculo completo', 'Comprobaciones', 'Trazabilidad', 'Control'])
    expect(model.inputRows.length).toBeGreaterThan(10)
    expect(model.calculationRows.length).toBeGreaterThanOrEqual(8)
    expect(model.calculationRows.every((row) => row.formula.startsWith('='))).toBe(true)
    expect(model.calculationRows.every((row) => !row.formula.includes('{{'))).toBe(true)
    expect(model.traceabilityRows.length).toBeGreaterThan(0)
    expect(model.limitations.length).toBeGreaterThan(0)
  })

  it('keeps mat column data as editable SI inputs', () => {
    const project = applyFootingExample(createNewProject(), defaultExampleForFootingType('mat'))
    const model = buildExerciseWorkbookModel(project)

    expect(model.inputRows.some((row) => row.id === 'columns.0.serviceLoadKn' && row.editable)).toBe(true)
    expect(model.inputRows.some((row) => row.id === 'columns.0.centerXM' && row.unit === 'm')).toBe(true)
  })

  it('creates a macro-free XLSX that requests a full automatic recalculation', () => {
    const project = applyFootingExample(createNewProject(), defaultExampleForFootingType('isolated'))
    const exported = exportExerciseWorkbook(project, '2026-08-30T12:00:00.000Z')
    const packageText = new TextDecoder().decode(exported.bytes)

    expect(Array.from(exported.bytes.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04])
    expect(exported.fileName).toMatch(/\.andelogic-zapatas-calculo\.xlsx$/)
    expect(packageText).toContain('<calcPr calcMode="auto" fullCalcOnLoad="1" forceFullCalc="1"')
    expect(packageText).toContain('name="Cálculo completo"')
    expect(packageText).toContain('Fórmula original')
    expect(packageText).toContain('Consistencia')
    expect(packageText).not.toContain('vbaProject')
    expect(packageText).not.toContain('externalLink')
  })

  it.each(FOOTING_TYPES)('refuses the blocked boundary example for %s', (footingType) => {
    const blocked = examplesForFootingType(footingType).find((example) => example.expectation === 'blocked')
    if (!blocked) return
    const project = applyFootingExample(createNewProject(), blocked)

    expect(() => buildExerciseWorkbookModel(project)).toThrow(/No se puede exportar/i)
  })
})
