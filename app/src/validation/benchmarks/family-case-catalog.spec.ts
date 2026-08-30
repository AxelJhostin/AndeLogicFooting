import { describe, expect, it } from 'vitest'
import { defaultExampleForFootingType, FOOTING_TYPES } from '../../domain/examples/footing-examples'
import { familyValidationCatalog } from '../release-gate'
import { familyBenchmarkCases } from './family-case-catalog'

describe('catálogo de casos para contraste externo', () => {
  it('define exactamente un caso principal para cada familia congelada', () => {
    expect(familyBenchmarkCases).toHaveLength(8)
    expect(new Set(familyBenchmarkCases.map(({ footingType }) => footingType))).toEqual(new Set(FOOTING_TYPES))
    expect(new Set(familyBenchmarkCases.map(({ caseId }) => caseId)).size).toBe(8)
  })

  it('reutiliza el ejemplo de referencia y conserva una firma de hipótesis por familia', () => {
    for (const benchmarkCase of familyBenchmarkCases) {
      const example = defaultExampleForFootingType(benchmarkCase.footingType)
      expect(benchmarkCase.exampleId).toBe(example.id)
      expect(benchmarkCase.inputs).toEqual(example.inputs)
      expect(benchmarkCase.standardProfile).toBe('NEC-2015-GUIDE-TRACEABLE')
      expect(benchmarkCase.assumptionsId).toMatch(/^AXC-[A-Z]+-ASSUMPTIONS-001$/)
    }
  })

  it('publica tres métricas finitas y tolerancias previas para cada caso', () => {
    for (const benchmarkCase of familyBenchmarkCases) {
      expect(benchmarkCase.metrics).toHaveLength(3)
      expect(new Set(benchmarkCase.metrics.map(({ metricId }) => metricId)).size).toBe(3)
      for (const metric of benchmarkCase.metrics) {
        expect(Number.isFinite(metric.engineValue), `${benchmarkCase.caseId}/${metric.metricId}`).toBe(true)
        expect(metric.unit.length).toBeGreaterThan(0)
        expect(metric.absoluteTolerance).toBeGreaterThanOrEqual(0)
        expect(metric.relativeTolerance).toBe(0.005)
      }
    }
  })

  it('coincide con la puerta de liberación sin acreditar evidencia todavía vacía', () => {
    for (const releaseRecord of familyValidationCatalog) {
      expect(familyBenchmarkCases.filter(({ footingType }) => footingType === releaseRecord.footingType)).toHaveLength(1)
      expect(releaseRecord.requiredExternalBenchmarks).toBe(3)
      expect(releaseRecord.completedExternalBenchmarks).toBe(0)
    }
  })
})
