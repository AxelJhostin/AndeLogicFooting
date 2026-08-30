import { describe, expect, it } from 'vitest'
import { FOOTING_TYPES } from '../domain/examples/footing-examples'
import {
  assessValidationRelease,
  familyValidationCatalog,
  type FamilyValidationRecord,
} from './release-gate'

const withEveryGatePassed = (record: FamilyValidationRecord): FamilyValidationRecord => ({
  ...record,
  completedExternalBenchmarks: record.requiredExternalBenchmarks,
  gates: Object.fromEntries(
    Object.entries(record.gates).map(([gate, result]) => [gate, { ...result, status: 'passed' }]),
  ) as FamilyValidationRecord['gates'],
})

describe('puerta de liberación técnica', () => {
  it('cubre exactamente una vez las ocho familias congeladas', () => {
    expect(familyValidationCatalog).toHaveLength(8)
    expect(new Set(familyValidationCatalog.map(({ footingType }) => footingType))).toEqual(new Set(FOOTING_TYPES))
  })

  it('mantiene la liberación pendiente mientras falten benchmarks y revisión profesional', () => {
    const result = assessValidationRelease(familyValidationCatalog)
    expect(result.status).toBe('pending-review')
    expect(result.familyCount).toBe(8)
    expect(result.passedGateCount).toBe(24)
    expect(result.totalGateCount).toBe(40)
    expect(result.reasons.join(' ')).toContain('contraste externo')
  })

  it('bloquea catálogos incompletos, duplicados o con una puerta bloqueada', () => {
    expect(assessValidationRelease(familyValidationCatalog.slice(1)).status).toBe('blocked')
    expect(assessValidationRelease([...familyValidationCatalog, familyValidationCatalog[0]]).status).toBe('blocked')
    const blocked = familyValidationCatalog.map((record, index) => index === 0
      ? { ...record, gates: { ...record.gates, traceability: { status: 'blocked' as const, note: 'Discrepancia abierta.' } } }
      : record)
    expect(assessValidationRelease(blocked).status).toBe('blocked')
  })

  it('solo aprueba cuando todas las puertas de las ocho familias están aprobadas', () => {
    expect(assessValidationRelease(familyValidationCatalog.map(withEveryGatePassed)).status).toBe('approved')
  })

  it('no acepta una puerta externa marcada como aprobada sin la evidencia mínima registrada', () => {
    const inconsistent = familyValidationCatalog.map(withEveryGatePassed).map((record, index) => index === 0
      ? { ...record, completedExternalBenchmarks: record.requiredExternalBenchmarks - 1 }
      : record)

    const result = assessValidationRelease(inconsistent)
    expect(result.status).toBe('blocked')
    expect(result.reasons.join(' ')).toContain('evidencias externas')
  })
})
