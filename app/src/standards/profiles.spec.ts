import { describe, expect, it } from 'vitest'
import { getStandardProfile } from './profiles'

describe('standard profiles', () => {
  it('mantiene un único perfil activo basado en NEC y fuentes públicas', () => {
    const nec = getStandardProfile('NEC-2015-GUIDE-TRACEABLE')
    const archived = getStandardProfile('ARCHIVED-UNSUPPORTED')

    expect(nec.sources.map((source) => source.id)).toEqual(expect.arrayContaining(['nec-se-hm-2015', 'guide-hm-2015']))
    expect(nec.sources.find((source) => source.id === 'guide-hm-2015')?.url).toContain('habitatyvivienda.gob.ec')
    expect(nec.traceability.find((item) => item.id === 'punching')?.reference).toContain('1.10.2')
    expect(nec.sources.map((source) => source.id)).toContain('usace-em-1110-1-1905-2025')
    expect(nec.traceability.filter((item) => item.appliesTo.includes('strap')).length).toBeGreaterThan(5)
    expect(nec.traceability.filter((item) => item.appliesTo.includes('trapezoidal')).length).toBeGreaterThan(5)
    expect(nec.traceability.filter((item) => item.appliesTo.includes('edge')).length).toBeGreaterThan(5)
    expect(nec.traceability.find((item) => item.id === 'edge-punching')?.basis).toBe('Dato externo obligatorio')
    expect(nec.label).toContain('NEC 2015')
    expect(archived.sources).toEqual([])
  })
})
