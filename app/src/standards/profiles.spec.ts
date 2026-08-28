import { describe, expect, it } from 'vitest'
import { getStandardProfile } from './profiles'

describe('standard profiles', () => {
  it('mantiene un único perfil activo basado en NEC y fuentes públicas', () => {
    const nec = getStandardProfile('NEC-PUBLIC-2014-PENDING')
    const archived = getStandardProfile('ARCHIVED-UNSUPPORTED')

    expect(nec.sources).toContain('NEC-SE-HM 2014')
    expect(nec.label).toContain('fuentes públicas')
    expect(archived.sources).toEqual([])
  })
})
