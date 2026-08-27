import { describe, expect, it } from 'vitest'
import { compareBenchmark } from './compare-benchmark'
import type { BenchmarkObservation, BenchmarkPolicy } from './types'

const observedAt = '2026-08-27T00:00:00.000Z'

const observation = (
  sourceId: string,
  sourceKind: BenchmarkObservation['sourceKind'],
  value: number,
  overrides: Partial<BenchmarkObservation> = {},
): BenchmarkObservation => ({
  sourceId,
  sourceKind,
  sourceVersion: '1.0',
  standardProfile: 'ACI-318-14',
  assumptionsId: 'centered-rigid-uniform-v1',
  metricId: 'contact-pressure',
  value,
  unit: 'kPa',
  evidence: `https://example.test/${sourceId}`,
  capturedAt: observedAt,
  ...overrides,
})

const policy: BenchmarkPolicy = {
  absoluteTolerance: 0.1,
  relativeTolerance: 0.002,
  minimumIndependentSources: 3,
  requiredSourceKinds: ['public-reference', 'software'],
  minimumSourcesByKind: { 'public-reference': 1, software: 2 },
}

describe('compareBenchmark', () => {
  it('aprueba solo con contexto compatible, fuentes independientes y tolerancia satisfecha', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('manual-publico', 'public-reference', 100.05),
      observation('software-a', 'software', 100.08),
      observation('software-b', 'software', 99.95),
    ], policy)

    expect(result.status).toBe('approved')
    expect(result.differences).toHaveLength(3)
    expect(result.differences.every((difference) => difference.withinTolerance)).toBe(true)
  })

  it('bloquea una discrepancia numérica aunque las demás fuentes coincidan', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('manual-publico', 'public-reference', 100),
      observation('software-a', 'software', 100),
      observation('software-b', 'software', 95),
    ], policy)

    expect(result.status).toBe('blocked')
    expect(result.reasons.join(' ')).toContain('software-b')
  })

  it('bloquea comparaciones que mezclan perfiles, unidades o supuestos', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('manual-publico', 'public-reference', 100),
      observation('software-a', 'software', 100),
      observation('software-b', 'software', 100, { standardProfile: 'ACI-318-25' }),
    ], policy)

    expect(result.status).toBe('blocked')
    expect(result.reasons.join(' ')).toContain('Contexto incompatible')
  })

  it('marca evidencia insuficiente cuando faltan fuentes o clases exigidas', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('software-a', 'software', 100),
      observation('software-b', 'software', 100),
    ], policy)

    expect(result.status).toBe('insufficient-evidence')
    expect(result.reasons.join(' ')).toContain('3 fuentes')
    expect(result.reasons.join(' ')).toContain('public-reference')
  })

  it('no confunde varias clases de evidencia con dos programas independientes', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('manual-publico', 'public-reference', 100),
      observation('calculo-secundario', 'independent-calculation', 100),
      observation('software-a', 'software', 100),
    ], policy)

    expect(result.status).toBe('insufficient-evidence')
    expect(result.reasons.join(' ')).toContain('2 fuentes de tipo software')
  })

  it('bloquea observaciones sin evidencia reproducible', () => {
    const result = compareBenchmark(observation('andelogic', 'independent-calculation', 100), [
      observation('manual-publico', 'public-reference', 100),
      observation('software-a', 'software', 100),
      observation('software-b', 'software', 100, { sourceVersion: '' }),
    ], policy)

    expect(result.status).toBe('blocked')
    expect(result.reasons.join(' ')).toContain('observaciones sin versión')
  })
})
