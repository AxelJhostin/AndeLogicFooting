import { describe, expect, it } from 'vitest'
import { externalBenchmarkSources } from './source-catalog'

describe('externalBenchmarkSources', () => {
  it('registra la NEC oficial como fuente pública del perfil activo', () => {
    expect(externalBenchmarkSources.find((source) => source.id === 'nec-official-portal')).toMatchObject({
      sourceKind: 'public-reference',
      confirmedProfiles: ['NEC-2015-GUIDE-TRACEABLE'],
      status: 'candidate',
    })
  })
})
