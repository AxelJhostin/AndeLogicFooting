import { describe, expect, it } from 'vitest'
import { analyzeCombinedFootingCase } from '../../application/combined-footing-analysis'
import { analyzeCornerFootingCase } from '../../application/corner-footing-analysis'
import { analyzeEdgeFootingCase } from '../../application/edge-footing-analysis'
import { analyzeFootingCase } from '../../application/footing-analysis'
import { analyzeMatFootingCase } from '../../application/mat-footing-analysis'
import { analyzeStrapFootingCase } from '../../application/strap-footing-analysis'
import { analyzeStripFootingCase } from '../../application/strip-footing-analysis'
import { analyzeTrapezoidalFootingCase } from '../../application/trapezoidal-footing-analysis'
import { createNewProject, type ProjectDocument } from '../projects'
import { applyFootingExample, examplesForFootingType, FOOTING_EXAMPLES, FOOTING_TYPES, type FootingExample } from './footing-examples'

function analyzeExample(example: FootingExample) {
  const project = applyFootingExample(createNewProject(), example)
  switch (example.footingType) {
    case 'isolated': return analyzeFootingCase(project)
    case 'strip': return analyzeStripFootingCase(project)
    case 'combined': return analyzeCombinedFootingCase(project)
    case 'strap': return analyzeStrapFootingCase(project)
    case 'trapezoidal': return analyzeTrapezoidalFootingCase(project)
    case 'edge': return analyzeEdgeFootingCase(project)
    case 'corner': return analyzeCornerFootingCase(project)
    case 'mat': return analyzeMatFootingCase(project)
  }
}

function attentionContactStatus(example: FootingExample) {
  const project = applyFootingExample(createNewProject(), example)
  if (example.footingType === 'isolated') {
    const outcome = analyzeFootingCase(project)
    return outcome.status === 'calculated' ? outcome.analysis.contact.status : null
  }
  if (example.footingType === 'strip') {
    const outcome = analyzeStripFootingCase(project)
    return outcome.status === 'calculated' ? outcome.analysis.contact.status : null
  }
  return null
}

describe('biblioteca de ejemplos rápidos', () => {
  it('ofrece referencia, variación y borde para todas las tipologías', () => {
    for (const footingType of FOOTING_TYPES) {
      const examples = examplesForFootingType(footingType)
      expect(examples).toHaveLength(3)
      expect(examples.map(({ category }) => category)).toEqual(['reference', 'variation', 'boundary'])
    }
  })

  it('mantiene identificadores únicos y metadatos explicativos', () => {
    expect(new Set(FOOTING_EXAMPLES.map(({ id }) => id)).size).toBe(FOOTING_EXAMPLES.length)
    for (const example of FOOTING_EXAMPLES) {
      expect(example.label.length).toBeGreaterThan(8)
      expect(example.description.length).toBeGreaterThan(20)
      expect(example.expectedObservation.length).toBeGreaterThan(20)
    }
  })

  it('produce el estado anunciado por cada ejemplo', () => {
    for (const example of FOOTING_EXAMPLES) {
      const outcome = analyzeExample(example)
      const expectedEngineStatus = example.expectation === 'blocked' ? 'invalid-input' : 'calculated'
      expect(outcome.status, example.id).toBe(expectedEngineStatus)

      if (example.expectation === 'attention') expect(attentionContactStatus(example), example.id).toBe('fail')
    }
  })

  it('reemplaza solo el snapshot activo y conserva los demás modelos', () => {
    const project = createNewProject()
    const originalStrip = project.stripInputSnapshot
    const example = examplesForFootingType('isolated')[0]
    const updated: ProjectDocument = applyFootingExample(project, example)

    expect(updated.footingType).toBe('isolated')
    expect(updated.name).toBe(example.projectName)
    expect(updated.inputSnapshot).toEqual(example.inputs)
    expect(updated.inputSnapshot).not.toBe(example.inputs)
    expect(updated.stripInputSnapshot).toBe(originalStrip)
  })
})
