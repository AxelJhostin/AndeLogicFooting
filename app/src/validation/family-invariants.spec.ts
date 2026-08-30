import { describe, expect, it } from 'vitest'
import { analyzeCombinedFootingCase } from '../application/combined-footing-analysis'
import { analyzeCornerFootingCase } from '../application/corner-footing-analysis'
import { analyzeEdgeFootingCase } from '../application/edge-footing-analysis'
import { analyzeFootingCase } from '../application/footing-analysis'
import { analyzeMatFootingCase } from '../application/mat-footing-analysis'
import { analyzeStrapFootingCase } from '../application/strap-footing-analysis'
import { analyzeStripFootingCase } from '../application/strip-footing-analysis'
import { analyzeTrapezoidalFootingCase } from '../application/trapezoidal-footing-analysis'
import {
  applyFootingExample,
  defaultExampleForFootingType,
  FOOTING_EXAMPLES,
  FOOTING_TYPES,
  type FootingExample,
} from '../domain/examples/footing-examples'
import { createNewProject, type ProjectDocument } from '../domain/projects'
import { buildCombinedFootingCalculationReport } from '../reports/combined-footing-calculation-report'
import { buildCornerFootingCalculationReport } from '../reports/corner-footing-calculation-report'
import { buildEdgeFootingCalculationReport } from '../reports/edge-footing-calculation-report'
import { buildFootingCalculationReport } from '../reports/footing-calculation-report'
import { buildMatFootingCalculationReport } from '../reports/mat-footing-calculation-report'
import { buildStrapFootingCalculationReport } from '../reports/strap-footing-calculation-report'
import { buildStripFootingCalculationReport } from '../reports/strip-footing-calculation-report'
import { buildTrapezoidalFootingCalculationReport } from '../reports/trapezoidal-footing-calculation-report'

function analyze(project: ProjectDocument, example: FootingExample) {
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

function buildReport(project: ProjectDocument) {
  switch (project.footingType) {
    case 'isolated': return buildFootingCalculationReport(project)
    case 'strip': return buildStripFootingCalculationReport(project)
    case 'combined': return buildCombinedFootingCalculationReport(project)
    case 'strap': return buildStrapFootingCalculationReport(project)
    case 'trapezoidal': return buildTrapezoidalFootingCalculationReport(project)
    case 'edge': return buildEdgeFootingCalculationReport(project)
    case 'corner': return buildCornerFootingCalculationReport(project)
    case 'mat': return buildMatFootingCalculationReport(project)
  }
}

function expectOnlyFiniteNumbers(value: unknown, path = 'analysis'): void {
  if (typeof value === 'number') {
    expect(Number.isFinite(value), `${path} contiene ${String(value)}`).toBe(true)
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => expectOnlyFiniteNumbers(item, `${path}[${index}]`))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) expectOnlyFiniteNumbers(item, `${path}.${key}`)
  }
}

describe('invariantes transversales del catálogo congelado', () => {
  it('mantiene los analizadores puros y todos sus resultados numéricos finitos', () => {
    for (const example of FOOTING_EXAMPLES) {
      const project = applyFootingExample(createNewProject(), example)
      const projectBeforeAnalysis = structuredClone(project)
      const outcome = analyze(project, example)

      expect(project, example.id).toEqual(projectBeforeAnalysis)
      if (outcome.status === 'calculated') expectOnlyFiniteNumbers(outcome.analysis, example.id)
      else {
        expect(example.expectation, example.id).toBe('blocked')
        expect(outcome.issues.length, example.id).toBeGreaterThan(0)
      }
    }
  })

  it('conserva evidencia, trazabilidad y límites en la memoria de las ocho familias', () => {
    for (const footingType of FOOTING_TYPES) {
      const example = defaultExampleForFootingType(footingType)
      const project = applyFootingExample(createNewProject(), example)
      const report = buildReport(project)
      const applicableTrace = report.profile.traceability.filter(({ appliesTo }) => appliesTo.includes(footingType))

      expect(report.profile.sources.length, footingType).toBeGreaterThan(0)
      expect(applicableTrace.length, footingType).toBeGreaterThan(0)
      expect(report.profile.releaseStatus, footingType).toBe('pending-review')
      expect(report.profile.releaseBlocker.length, footingType).toBeGreaterThan(40)
      expect(report.limitations.length, footingType).toBeGreaterThan(0)
      expect(report.limitations.every((limitation) => limitation.trim().length > 0), footingType).toBe(true)
    }
  })
})
