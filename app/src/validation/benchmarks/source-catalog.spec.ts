import { describe, expect, it } from 'vitest'
import { externalBenchmarkSources } from './source-catalog'

describe('externalBenchmarkSources', () => {
  it('no presenta una fuente sin edición confirmada como compatible con ACI 318-25', () => {
    expect(
      externalBenchmarkSources.some((source) => source.confirmedProfiles.includes('ACI-318-25')),
    ).toBe(false)
  })

  it('mantiene la verificación pública ACI 318-14 como fixture histórico', () => {
    expect(externalBenchmarkSources.find((source) => source.id === 'skyciv-verification-aci14')).toMatchObject({
      confirmedProfiles: ['ACI-318-14'],
      status: 'historical-fixture',
    })
  })

  it('exige confirmar la edición cuando el proveedor solo declara la versión más reciente', () => {
    expect(externalBenchmarkSources.find((source) => source.id === 'asdip-free-footing')).toMatchObject({
      confirmedProfiles: [],
      status: 'candidate',
    })
  })
})
